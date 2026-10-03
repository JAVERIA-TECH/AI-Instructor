import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';
import crypto from 'crypto';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ALLOW_DEMO_FALLBACK =
  String(process.env.ALLOW_DEMO_FALLBACK || 'false').toLowerCase() === 'true';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024
  }
});

app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173'],
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));

/* =========================
   MONGODB
========================= */

let db = false;

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      db = true;
      console.log('MongoDB connected');
    })
    .catch((e) => {
      console.log('MongoDB unavailable:', e.message);
    });
}

/* =========================
   SIMPLE AUTH
========================= */

const memoryUsers = new Map();

const hashPassword = (password) =>
  crypto.createHash('sha256').update(String(password)).digest('hex');

const signUser = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

/* =========================
   HEALTH
========================= */

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Ustaad AI Node backend',
    database: db ? 'mongodb' : 'local-demo',
    ai: GROQ_API_KEY ? 'configured' : 'missing-key',
    provider: 'Groq',
    model: GROQ_MODEL,
    visionModel: GROQ_VISION_MODEL,
    grounding: false,
    note: 'Ustaad AI is currently using Groq for AI generation.'
  });
});

/* =========================
   SIGNUP
========================= */

app.post('/api/auth/signup', (req, res) => {
  const {
    name = 'Student',
    email,
    password,
    grade = 8,
    language = 'English'
  } = req.body || {};

  if (!email || !password || password.length < 6) {
    return res.status(400).json({
      error: 'Email and a password of at least 6 characters are required.'
    });
  }

  const key = email.toLowerCase().trim();

  if (memoryUsers.has(key)) {
    return res.status(409).json({
      error: 'An account with this email already exists.'
    });
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: key,
    passwordHash: hashPassword(password),
    grade: Number(grade),
    language
  };

  memoryUsers.set(key, user);

  res.json({
    token: signUser(user),
    user: {
      name,
      email: key,
      grade: user.grade,
      language
    }
  });
});

/* =========================
   LOGIN
========================= */

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  const user = memoryUsers.get(
    String(email || '').toLowerCase().trim()
  );

  if (
    !user ||
    user.passwordHash !== hashPassword(password || '')
  ) {
    return res.status(401).json({
      error: 'Invalid email or password.'
    });
  }

  res.json({
    token: signUser(user),
    user: {
      name: user.name,
      email: user.email,
      grade: user.grade,
      language: user.language
    }
  });
});

/* =========================
   CHANGE PASSWORD
========================= */

app.post('/api/auth/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body || {};
  const key = String(email || '').toLowerCase().trim();

  if (!key || !currentPassword || !newPassword || String(newPassword).length < 6) {
    return res.status(400).json({
      error: 'Email, current password and a new password of at least 6 characters are required.'
    });
  }

  const user = memoryUsers.get(key);

  if (!user || user.passwordHash !== hashPassword(currentPassword)) {
    return res.status(401).json({
      error: 'Current password is incorrect.'
    });
  }

  user.passwordHash = hashPassword(newPassword);
  memoryUsers.set(key, user);

  res.json({ ok: true, message: 'Password changed successfully.' });
});

/* =========================
   DEMO LOGIN
========================= 

app.post('/api/auth/demo-login', (req, res) => {
  const user = {
    id: 'demo',
    name: req.body?.name || 'Student',
    email: 'demo@ustaad.ai',
    grade: Number(req.body?.grade || 8),
    language: req.body?.language || 'Roman Urdu'
  };

  res.json({
    token: signUser(user),
    user
  });
});

/* =========================
   GROQ API
========================= */

async function groqChat({
  messages,
  model = GROQ_MODEL,
  temperature = 0.25,
  maxTokens = 4096
}) {
  if (!GROQ_API_KEY) {
    throw new Error(
      'GROQ_API_KEY is missing. Add your Groq API key to backend/.env.'
    );
  }

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },

      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Groq HTTP ${response.status}`
    );
  }

  const text =
    data?.choices?.[0]?.message?.content?.trim() || '';

  return {
    text,
    usage: data?.usage || null
  };
}

/* =========================
   GROQ VISION
========================= */

async function groqVision({
  prompt,
  file,
  model = GROQ_VISION_MODEL
}) {
  if (!GROQ_API_KEY) {
    throw new Error(
      'GROQ_API_KEY is missing. Add your Groq API key to backend/.env.'
    );
  }

  if (!file) {
    throw new Error('No file was provided.');
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new Error(
      'This AI vision endpoint currently accepts image files such as PNG, JPG or WEBP.'
    );
  }

  const base64 = file.buffer.toString('base64');

  const dataUrl =
    `data:${file.mimetype};base64,${base64}`;

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },

      body: JSON.stringify({
        model,

        messages: [
          {
            role: 'user',

            content: [
              {
                type: 'text',
                text: prompt
              },

              {
                type: 'image_url',
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ],

        temperature: 0.2,
        max_tokens: 4096
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Groq Vision HTTP ${response.status}`
    );
  }

  const text =
    data?.choices?.[0]?.message?.content?.trim() || '';

  return {
    text,
    usage: data?.usage || null
  };
}

/* =========================
   DEMO FALLBACK
========================= */

function demoAnswer(
  message,
  language,
  grade,
  subject
) {
  return `Demo response for Grade ${grade} ${subject} (${language}).

I received your question:

"${message}"

The AI service is currently unavailable. Please check your Groq API key and restart the backend.`;
}

/* =========================
   CHAT
========================= */

app.post(
  '/api/ai/chat',
  upload.single('file'),
  async (req, res) => {
    const message =
      String(req.body?.message || '').trim();

    const language =
      req.body?.language || 'English';

    const grade =
      req.body?.grade || 8;

    const subject =
      req.body?.subject || 'Mathematics';

    if (!message && !req.file) {
      return res.status(400).json({
        error: 'Ask a question or attach a file.'
      });
    }

    try {
      const systemPrompt = `
You are Ustaad AI, a careful multilingual personal AI teacher.

Student grade: ${grade}
Subject: ${subject}
Preferred language: ${language}

Teaching rules:

1. Understand the student's exact question before answering.
2. Answer in the student's selected language.
3. Explain concepts step by step.
4. Use simple language appropriate for the student's grade.
5. For mathematics, show the complete working.
6. For programming, provide correct code and explain it.
7. Use examples when useful.
8. Do not invent facts, sources, statistics or citations.
9. If something is uncertain, clearly say that it is uncertain.
10. Help students understand homework rather than merely giving unexplained answers.
11. If the student asks a simple question, keep the explanation appropriately concise.
12. For difficult questions, break the solution into clear sections.
13. Be encouraging and respectful.
14. Never claim that you searched the web unless web search was actually performed.
15. Do not fabricate references.

Return a useful educational answer.
`;

      let result;

      if (req.file && req.file.mimetype.startsWith('image/')) {
        result = await groqVision({
          file: req.file,

          prompt: `
${systemPrompt}

The student has attached an image.

Read the image carefully.

If it contains homework:
- identify the question,
- read the student's work,
- identify mistakes,
- explain what is wrong,
- provide the correct method,
- explain the correction step by step.

If the image is unclear, say exactly which part cannot be read.

Student question:
${message || 'Please analyze this image and teach me what it contains.'}
`
        });
      } else {
        result = await groqChat({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ]
        });
      }

      res.json({
        answer: result.text,
        sources: [],
        grounded: false,
        provider: 'Groq',
        model: req.file
          ? GROQ_VISION_MODEL
          : GROQ_MODEL
      });

    } catch (e) {
      console.error('AI chat error:', e.message);

      if (ALLOW_DEMO_FALLBACK) {
        return res.json({
          answer: demoAnswer(
            message,
            language,
            grade,
            subject
          ),
          sources: [],
          demo: true
        });
      }

      res.status(502).json({
        error: e.message,
        hint: 'Check GROQ_API_KEY in backend/.env and restart the backend.'
      });
    }
  }
);

/* =========================
   TRANSLATION
========================= */

app.post('/api/ai/translate', async (req, res) => {
  const {
    text,
    targetLanguage = 'English',
    grade = 8
  } = req.body || {};

  if (!text) {
    return res.status(400).json({
      error: 'Text is required.'
    });
  }

  try {
    const result = await groqChat({
      messages: [
        {
          role: 'system',
          content: `
You are an educational translator.

Translate the provided educational content into ${targetLanguage}
for a Grade ${grade} student.

Preserve:
- meaning
- formulas
- code
- headings
- examples

Do not add commentary.
`
        },
        {
          role: 'user',
          content: text
        }
      ],

      temperature: 0.1
    });

    res.json({
      text: result.text
    });

  } catch (e) {
    res.status(502).json({
      error: e.message
    });
  }
});

/* =========================
   ASSIGNMENT GENERATOR
========================= */

app.post(
  '/api/assignments/generate',
  async (req, res) => {
    const {
      subject = 'Mathematics',
      grade = 8,
      topic = 'General revision',
      difficulty = 'medium',
      questions = 10,
      language = 'English',
      studentDetails = ''
    } = req.body || {};

    try {
      const result = await groqChat({
        messages: [
          {
            role: 'system',
            content: `
You are an expert school teacher.

Create a useful Grade ${grade}
${subject} assignment.

Topic: ${topic}
Difficulty: ${difficulty}
Language: ${language}
Number of questions: ${questions}

Student details:
${studentDetails || 'None provided'}

Return ONLY valid JSON.

Required structure:

{
  "title": "...",
  "instructions": "...",
  "questions": [
    {
      "number": 1,
      "question": "...",
      "marks": 2
    }
  ]
}

Do not use markdown.
`
          },
          {
            role: 'user',
            content:
              `Create the assignment about ${topic}.`
          }
        ],

        temperature: 0.4,
        maxTokens: 5000
      });

      const cleaned = result.text
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      res.json(JSON.parse(cleaned));

    } catch (e) {
      res.status(502).json({
        error: e.message
      });
    }
  }
);

/* =========================
   QUIZ GENERATOR
========================= */

app.post(
  '/api/quizzes/generate',
  async (req, res) => {
    const {
      subject = 'Mathematics',
      grade = 8,
      topic = 'General revision',
      language = 'English',
      questions = 5
    } = req.body || {};

    try {
      const result = await groqChat({
        messages: [
          {
            role: 'system',
            content: `
You are an expert school teacher.

Create a Grade ${grade}
${subject} multiple-choice quiz.

Topic:
${topic}

Language:
${language}

Questions:
${questions}

Return ONLY valid JSON:

{
  "title": "...",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "..."
    }
  ]
}

The answer field must contain the
zero-based index of the correct option.

Do not use markdown.
`
          },
          {
            role: 'user',
            content:
              `Generate the quiz for ${topic}.`
          }
        ],

        temperature: 0.4,
        maxTokens: 5000
      });

      const cleaned = result.text
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      res.json(JSON.parse(cleaned));

    } catch (e) {
      res.status(502).json({
        error: e.message
      });
    }
  }
);

/* =========================
   HOMEWORK CHECKER
========================= */

app.post(
  '/api/homework/analyze',
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error:
            'Please upload a homework image.'
        });
      }

      const allowed = [
        'image/png',
        'image/jpeg',
        'image/webp'
      ];

      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({
          error:
            'For AI homework checking, upload PNG, JPG/JPEG or WEBP.'
        });
      }

      const grade =
        req.body?.grade || 8;

      const language =
        req.body?.language || 'English';

      const result = await groqVision({
        file: req.file,

        prompt: `
You are a meticulous Grade ${grade}
homework checker.

Student language:
${language}

Carefully inspect the uploaded homework.

Do NOT guess unreadable handwriting.

Return ONLY valid JSON in this exact structure:

{
  "summary": "...",
  "results": [
    {
      "question": "...",
      "student_answer": "...",
      "status": "correct",
      "correct_answer": "...",
      "explanation": "..."
    }
  ]
}

status must be exactly one of:

correct
incorrect
partial
unclear

For every mistake:
- explain what went wrong,
- give the correct answer,
- teach the correct method simply.

If something cannot be read:
use "unclear".
`
      });

      const cleaned = result.text
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      res.json(JSON.parse(cleaned));

    } catch (e) {
      console.error(
        'Homework checker error:',
        e.message
      );

      res.status(502).json({
        error: e.message
      });
    }
  }
);

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `Ustaad AI backend running on http://localhost:${PORT}`
  );

  console.log(
    `AI provider=Groq | model=${GROQ_MODEL} | vision=${GROQ_VISION_MODEL}`
  );
});