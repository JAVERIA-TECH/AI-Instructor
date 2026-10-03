# Ustaad AI — Your Personal Multilingual AI Teacher

Ustaad AI is a premium student-learning MVP for Grades 1–10. Students can ask questions in English, Urdu, or Roman Urdu, receive step-by-step explanations, use voice learning, upload homework for AI vision checking, generate assignments, save lessons, manage files, and track learning progress.

## Project overview

The application is intentionally split into a **JavaScript-only core**:

- **Frontend:** React + Vite + Tailwind CSS + custom premium CSS
- **Backend:** Node.js + Express REST APIs
- **AI:** Groq-hosted open models
- **AI generation:** Groq chat completion API
- **Homework vision:** Groq multimodal input for images
- **Voice:** browser Speech Recognition + Speech Synthesis for the MVP
- **Database:** MongoDB Atlas is an optional production persistence layer
- **Deployment:** Vercel frontend + Node-compatible backend; optional Streamlit showcase wrapper
- **CI/CD:** GitHub Actions build/check workflow

> Important: this MVP uses the configured Groq model for generation. It does not claim live web search or custom RAG in the free-tier submission build.


## Main features

### Public experience
- Home / landing page
- About page
- Subjects page
- Contact page
- Login / Sign Up
- Premium dark navy + cream visual system with lemon, pista, falsa and tea-pink accents

### Student dashboard
- Home
- Chat with AI
- Voice Learning
- Homework Checker
- Assignment Builder
- My Progress
- Saved Lessons
- My Files
- Subjects
- Settings
- Light/dark theme

### AI tutor
- Grade selector: 1–10
- Mathematics, English, Computer Science
- English, Urdu, Roman Urdu
- Step-by-step teaching prompts
- Multilingual generation through the configured Groq model
- File attachment in chat for image questions
- Translation of the latest answer

### Voice learning
- Browser speech recognition for student input
- Browser speech synthesis for AI output
- Voice output can be enabled/disabled
- Selected language is used for speech locale where the browser supports it

### Homework checker
- PNG/JPG/WEBP upload
- AI vision analysis
- Correct / incorrect / partial / unclear result states
- Correct answer and teaching explanation
- Unclear handwriting is explicitly marked instead of guessed

### Assignments
- Topic
- Difficulty
- Number of questions
- Grade and language context
- Personalized student details
- Generated assignment preview
- DOC export
- Browser print-to-PDF workflow

## Architecture

```text
Student
   ↓
React + Vite + Tailwind/CSS
   ↓ REST/JSON + multipart upload
Node.js + Express
   ├── Groq chat completion API
   │      └── No Google/Gemini dependency in the local free-tier build
   ├── Groq multimodal chat
   │      └── Homework images
   └── MongoDB Atlas (optional production persistence)
```

The browser never receives the Groq API key. The key belongs in `backend/.env` and is read by Node.js.

## AI provider and free-tier setup

The submission build uses a server-side **Groq API** configuration so the local
MVP can be tested without putting an AI credential in the browser. The backend
supports normal chat generation and image-based homework analysis through the
configured Groq models.

This build intentionally does **not** advertise Google Search grounding as an
active feature. That keeps the free-tier configuration honest and avoids making
the application depend on a paid/restricted grounding entitlement.

## Local setup

### Requirements
- Node.js 20+
- npm
- A Groq API key with access to the selected Groq model

Python is **not required for the main application**.

### 1. Backend

```powershell
cd backend
npm install
copy .env.example .env
notepad .env
```

Set:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=YOUR_GROQ_KEY
GROQ_MODEL=openai/gpt-oss-20b
GROQ_VISION_MODEL=qwen/qwen3.8-27b
ALLOW_DEMO_FALLBACK=false
JWT_SECRET=change-this
MONGODB_URI=
```

Start:

```powershell
npm start
```

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

### 3. Verify backend health

Open:

```text
http://localhost:5000/api/health
```

It should show the selected model and AI configuration status.

## AI access troubleshooting

If the backend reports a provider/API-key error, verify the `GROQ_API_KEY`,
model names and account access in `backend/.env`, then restart the Node server.
The frontend cannot fix a provider-side access restriction.

## Security notes

- Never put `GROQ_API_KEY` in `frontend/.env`.
- Never commit `backend/.env`.
- Use a strong `JWT_SECRET` in production.
- Use HTTPS in production.
- Configure a real MongoDB Atlas database for persistent accounts/chats/files.
- Add rate limiting and a production authentication provider before public SaaS launch.
- Keep upload size/type restrictions enabled.

## Production persistence

The current submission MVP keeps many demo preferences/chat/file references in the browser's local storage so the UI remains usable without a database. MongoDB is wired as an optional backend connection point. For a full SaaS release, add MongoDB schemas for:

- users
- conversations/messages
- saved lessons
- assignments/quizzes
- homework analyses
- uploaded-file metadata
- progress events

## Deployment

Recommended:

```text
GitHub
 ├── frontend → Vercel
 ├── backend  → Render/Railway/another Node host
 └── streamlit → Streamlit Community Cloud (optional showcase shell)
```

### Vercel

Set the Vercel project root directory to `frontend`.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

Environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND.example.com
```

### Node backend

Deploy the `backend` folder to a Node-compatible host and set:

```text
PORT=5000
GROQ_API_KEY=...
GROQ_MODEL=openai/gpt-oss-20b
CLIENT_URL=https://YOUR-VERCEL-APP.vercel.app
JWT_SECRET=...
MONGODB_URI=...
```

### Streamlit

The `streamlit/` directory is only an optional showcase wrapper around the React app. Streamlit itself requires a Python runtime, but the **core Ustaad AI application does not**.

## GitHub

From the project root:

```bash
git init
git add .
git commit -m "Build Ustaad AI multilingual teacher MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ustaad-ai.git
git push -u origin main
```

## CI/CD

`.github/workflows/ci.yml` checks the Node backend syntax and builds the React frontend on push/pull request.

## API summary

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Backend status |
| `POST /api/auth/signup` | Demo/MVP signup |
| `POST /api/auth/login` | Demo/MVP login |
| `POST /api/ai/chat` | Grounded AI tutoring + optional file |
| `POST /api/ai/translate` | Translate an answer |
| `POST /api/homework/analyze` | AI homework vision checking |
| `POST /api/assignments/generate` | Assignment generation |
| `POST /api/quizzes/generate` | Quiz generation |

## Tech stack requested for the project

JavaScript, HTML5, CSS3, React, Vite, Tailwind CSS, Node.js, Express.js, REST APIs, MongoDB, generative AI, Groq, browser voice APIs, CDN-ready frontend assets, GitHub Actions CI/CD, SaaS-ready architecture and Vercel/Streamlit deployment options.

## MVP boundary

This is a submission-ready MVP foundation rather than a fully audited commercial SaaS. The real Groq integration, multimodal homework route, voice UI, assignment generation, public pages and dashboard are wired. Production-grade authentication, persistent MongoDB schemas, object storage, rate limiting, billing, monitoring and a true always-on Live API voice agent should be completed before a public launch.


## Student account and chat controls

The dashboard includes:
- New chat
- Delete current chat
- Separate local chat history per account
- Language and grade preferences
- Password change in Settings
- Add account
- Switch between saved accounts on the same device
- Remove a saved account from the device
- Voice output on/off
- Light/dark mode with dark-mode legibility fixes

## Project purpose

Ustaad AI is designed as a practical multilingual study companion for school
students. The goal is to make explanations easier to understand, support
practice and homework review, and keep common learning workflows in one
student-friendly interface.

## Submission security checklist

Before pushing to GitHub:
1. Never commit `backend/.env`.
2. Keep only `backend/.env.example` with placeholder values.
3. Keep API keys server-side.
4. Confirm `.gitignore` excludes `.env` and `node_modules`.
5. Add deployment environment variables only in the hosting provider dashboard.
