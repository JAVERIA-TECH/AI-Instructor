import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain, Mic, ClipboardCheck, BarChart3, Bookmark, FileText, Settings, Home, Menu, Moon, Sun,
  GraduationCap, Send, Upload, ChevronRight, Languages, Paperclip, Plus, CircleUserRound,
  Sparkles, BookOpen, Mail, Info, LogIn, UserPlus, Download, Volume2, VolumeX, Search, ShieldCheck,
  WandSparkles, CheckCircle2, XCircle, FileDown, RefreshCw, Trash2, ExternalLink, KeyRound, UserRoundPlus, ListPlus, Lightbulb
} from 'lucide-react';
import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const subjects = ['Mathematics', 'English', 'Computer Science'];
const languages = ['English', 'Urdu', 'Roman Urdu'];
const grades = Array.from({ length: 10 }, (_, i) => String(i + 1));

const ACCOUNTS_KEY = 'ustaadAccounts';

function saveAccountSession(user, token) {
  try {
    const current = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    const next = current.filter(a => a.email !== user.email);
    next.unshift({ user, token });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next.slice(0, 8)));
  } catch {}
}

const nav = [
  ['Home', Home],
  ['Chat with AI', Brain],
  ['Voice Learning', Mic],
  ['Homework Checker', ClipboardCheck],
  ['Assignments', FileDown],
  ['My Progress', BarChart3],
  ['Saved Lessons', Bookmark],
  ['My Files', FileText],
  ['Subjects', BookOpen],
  ['Settings', Settings]
];

async function api(path, body, options = {}) {
  const isForm = body instanceof FormData;

  const res = await fetch(API + path, {
    method: options.method || 'POST',
    ...(isForm ? {} : { headers: { 'Content-Type': 'application/json' } }),
    body:
      options.method === 'GET'
        ? undefined
        : isForm
          ? body
          : JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

/* -------------------------------------------------------
   CLEAN MARKDOWN RENDERER
------------------------------------------------------- */

function MarkdownAnswer({ children }) {
  if (!children) return null;

  return (
    <div className="markdown-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h3 className="md-h1">{children}</h3>,
          h2: ({ children }) => <h3 className="md-h2">{children}</h3>,
          h3: ({ children }) => <h4 className="md-h3">{children}</h4>,
          h4: ({ children }) => <h4 className="md-h4">{children}</h4>,

          p: ({ children }) => (
            <p className="md-paragraph">{children}</p>
          ),

          strong: ({ children }) => (
            <strong className="md-bold">{children}</strong>
          ),

          em: ({ children }) => (
            <em className="md-italic">{children}</em>
          ),

          ul: ({ children }) => (
            <ul className="md-list">{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className="md-list md-ordered">{children}</ol>
          ),

          li: ({ children }) => (
            <li className="md-list-item">{children}</li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="md-quote">{children}</blockquote>
          ),

          hr: () => (
            <div className="md-spacer" />
          ),

          table: ({ children }) => (
            <div className="md-table-wrap">
              <table className="md-table">{children}</table>
            </div>
          ),

          thead: ({ children }) => (
            <thead>{children}</thead>
          ),

          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),

          tr: ({ children }) => (
            <tr>{children}</tr>
          ),

          th: ({ children }) => (
            <th>{children}</th>
          ),

          td: ({ children }) => (
            <td>{children}</td>
          ),

          code: ({ inline, className, children }) => {
            const language =
              className?.replace('language-', '') || '';

            if (inline) {
              return (
                <code className="md-inline-code">
                  {children}
                </code>
              );
            }

            return (
              <div className="md-code-wrap">
                {language && (
                  <div className="md-code-language">
                    {language}
                  </div>
                )}
                <pre className="md-code">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="md-link"
            >
              {children}
            </a>
          ),

          br: () => <br />
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

/* -------------------------------------------------------
   LOGO
------------------------------------------------------- */

function Logo() {
  return (
    <div className="logo">
      <span>
        <GraduationCap />
      </span>

      <div>
        <b>
          Ustaad <i>AI</i>
        </b>
        <small>Learn • Ask • Grow</small>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PUBLIC SHELL
------------------------------------------------------- */

function PublicShell({ page, setPage, children }) {
  return (
    <div className="public">
      <nav className="publicnav">
        <button
          className="brandbutton"
          onClick={() => setPage('Home')}
        >
          <Logo />
        </button>

        <div className="publiclinks">
          {['Home', 'About', 'Subjects', 'Contact'].map(x => (
            <button
              key={x}
              className={page === x ? 'selected' : ''}
              onClick={() => setPage(x)}
            >
              {x}
            </button>
          ))}
        </div>

        <button
          className="publiclogin"
          onClick={() => setPage('Auth')}
        >
          <LogIn size={16} />
          Login / Sign Up
        </button>
      </nav>

      {children}
    </div>
  );
}

/* -------------------------------------------------------
   LANDING
------------------------------------------------------- */

function Landing({ setPage }) {
  return (
    <PublicShell page="Home" setPage={setPage}>
      <section className="hero">
        <div className="hero-copy">
          <label>
            <Sparkles size={15} />
            YOUR PERSONAL MULTILINGUAL AI TEACHER
          </label>

          <h1>
            Learn smarter.
            <br />
            <em>Understand deeply.</em>
          </h1>

          <p>
            Ask questions, learn in English, Urdu or Roman Urdu,
            speak with your AI instructor, get careful explanations check homework, create assignments
            and build better learning habits.
          </p>

          <div className="hero-actions">
            <button
              className="primary"
              onClick={() => setPage('Auth')}
            >
              Start Learning
              <ChevronRight />
            </button>

            <button
              className="ghostlight"
              onClick={() => setPage('Subjects')}
            >
              Explore Subjects
            </button>
          </div>

          <div className="trust">
            <ShieldCheck />
            API keys stay server-side • Student files stay local
            until you connect MongoDB
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span>🎓</span>

            <div>
              <b>Ustaad AI</b>
              <small>Multilingual learning companion</small>
            </div>

            <span className="live-dot">●</span>
          </div>

          <div className="mini-user">
            Explain fractions in simple words.
          </div>

          <div className="mini-ai">
            Bilkul! Chalo fractions ko step by step samajhtay hain.
            A fraction shows equal parts of a whole…
          </div>

          <div className="mini-source">
            <Search size={14} />
            Grounded answer • sources shown when available
          </div>
        </div>
      </section>

      <section className="featuregrid">
        {[
          [
            'AI Tutor',
            'Careful step-by-step explanations across Grades 1–10.',
            Brain
          ],
          [
            'Voice Instructor',
            'Speak to Ustaad and hear answers aloud.',
            Mic
          ],
          [
            'Homework Vision',
            'Upload homework images and learn from mistakes.',
            ClipboardCheck
          ],
          [
            'Assignments & Quizzes',
            'Generate personalized practice and export it.',
            WandSparkles
          ]
        ].map(([a, b, I]) => (
          <div className="feature" key={a}>
            <I />
            <b>{a}</b>
            <p>{b}</p>
          </div>
        ))}
      </section>
    </PublicShell>
  );
}

/* -------------------------------------------------------
   ABOUT
------------------------------------------------------- */

function About({ setPage }) {
  return (
    <PublicShell page="About" setPage={setPage}>
      <div className="publicpage">
        <div className="eyebrow">ABOUT USTAAD AI</div>

        <h1>
          A teacher that adapts to the student.
        </h1>

        <p>
          Ustaad AI is designed as a multilingual learning assistant
          for students from Grade 1 to Grade 10. The MVP combines
          React, Vite, Tailwind/CSS, Node.js and Express REST APIs
          with a server-side Groq AI provider. The submission build
          focuses on multilingual teaching, homework vision, voice
          learning and student workflow tools without claiming live web search.
        </p>

        <div className="aboutgrid">
          <InfoCard
            icon={Brain}
            title="Personalized teaching"
            text="Grade, subject and selected language shape the teaching prompt."
          />

          <InfoCard
            icon={Search}
            title="Careful explanations"
            text="Grade, subject and language context shape every teaching prompt."
          />

          <InfoCard
            icon={ShieldCheck}
            title="Security foundation"
            text="The Groq key is kept on the Node server; production persistence can use MongoDB Atlas."
          />
        </div>
      </div>
    </PublicShell>
  );
}

function InfoCard({ icon: I, title, text }) {
  return (
    <div className="info-card">
      <I />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* -------------------------------------------------------
   PUBLIC SUBJECTS
------------------------------------------------------- */

function PublicSubjects({ setPage }) {
  const [grade, setGrade] = useState('1');

  return (
    <PublicShell page="Subjects" setPage={setPage}>
      <div className="publicpage">
        <div className="eyebrow">
          SUBJECTS • GRADES 1–10
        </div>

        <h1>
          Learn from foundations to advanced school problems.
        </h1>

        <p>
          Select a grade and explore the core learning tracks.
        </p>

        <div className="grade-pills">
          {grades.map(g => (
            <button
              className={grade === g ? 'activepill' : ''}
              onClick={() => setGrade(g)}
              key={g}
            >
              Grade {g}
            </button>
          ))}
        </div>

        <div className="subject-public-grid">
          {subjects.map((s, i) => (
            <div className="subject-public" key={s}>
              <span>{['∑', 'Aa', '</>'][i]}</span>

              <h3>{s}</h3>

              <p>
                Grade {grade} lessons, explanations, practice
                questions and guided problem solving.
              </p>

              <button
                className="textbutton"
                onClick={() => setPage('Auth')}
              >
                Start {s}
                <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}

/* -------------------------------------------------------
   CONTACT
------------------------------------------------------- */

function Contact({ setPage }) {
  return (
    <PublicShell page="Contact" setPage={setPage}>
      <div className="publicpage contactpage">
        <div className="eyebrow">CONTACT US</div>

        <h1>
          Build better learning, one question at a time.
        </h1>

        <p>
          For a submission/demo, use the dashboard feedback form
          or connect your production email provider later.
        </p>

        <div className="contactbox">
          <Mail />

          <div>
            <b>Support</b>
            <p>support@ustaad-ai.local</p>
            <small>
              This address is a placeholder for the MVP.
            </small>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

/* -------------------------------------------------------
   AUTH
------------------------------------------------------- */

function Auth({ onLogin, setPage }) {
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: 'Student',
    email: '',
    password: '',
    grade: '8',
    language: 'English'
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const data = await api(
        mode === 'login'
          ? '/api/auth/login'
          : '/api/auth/signup',
        mode === 'login'
          ? {
              email: form.email,
              password: form.password
            }
          : form
      );

      localStorage.setItem(
        'ustaadUser',
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        'ustaadToken',
        data.token
      );

      saveAccountSession(data.user, data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PublicShell page="Auth" setPage={setPage}>
      <div className="auth-wrap">
        <div className="auth-card">
          <Logo />

          <h1>
            {mode === 'login'
              ? 'Welcome back.'
              : 'Create your student account.'}
          </h1>

          <p>
            {mode === 'login'
              ? 'Continue your learning journey.'
              : 'Your local MVP profile will remember your preferences.'}
          </p>

          {error && (
            <div className="errorbox">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {mode === 'signup' && (
              <input
                placeholder="Full name"
                value={form.name}
                onChange={e =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
              />
            )}

            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />

            <input
              required
              minLength={6}
              type="password"
              placeholder="Password (6+ characters)"
              value={form.password}
              onChange={e =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
            />

            {mode === 'signup' && (
              <div className="formrow">
                <select
                  value={form.grade}
                  onChange={e =>
                    setForm({
                      ...form,
                      grade: e.target.value
                    })
                  }
                >
                  {grades.map(g => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>

                <select
                  value={form.language}
                  onChange={e =>
                    setForm({
                      ...form,
                      language: e.target.value
                    })
                  }
                >
                  {languages.map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="primary wide"
              disabled={busy}
            >
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Login'
                  : 'Create Account'}
            </button>
          </form>

          <button
            className="switch"
            onClick={() => {
              setMode(
                mode === 'login'
                  ? 'signup'
                  : 'login'
              );
              setError('');
            }}
          >
            {mode === 'login' ? (
              <>
                <UserPlus size={15} />
                Need an account? Sign up
              </>
            ) : (
              <>
                <LogIn size={15} />
                Already have an account? Login
              </>
            )}
          </button>

          <button
            className="demo"
            onClick={() =>
              (() => {
            const demo = {
              name: 'Demo Student',
              email: 'demo@ustaad.ai',
              grade: 8,
              language: 'Roman Urdu'
            };
            const token = 'demo-local-token';
            localStorage.setItem('ustaadToken', token);
            saveAccountSession(demo, token);
            onLogin(demo);
          })()
            }
          >
            Use Demo Dashboard
          </button>
        </div>
      </div>
    </PublicShell>
  );
}

/* -------------------------------------------------------
   APP
------------------------------------------------------- */

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('ustaadUser') || 'null'
      );
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState('Home');

  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('ustaadTheme') === 'dark'
  );

  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      'ustaadTheme',
      dark ? 'dark' : 'light'
    );
  }, [dark]);

  const logout = () => {
    localStorage.removeItem('ustaadToken');
    localStorage.removeItem('ustaadUser');

    setUser(null);
    setPage('Home');
  };

  if (!user) {
    if (page === 'About') {
      return <About setPage={setPage} />;
    }

    if (page === 'Subjects') {
      return <PublicSubjects setPage={setPage} />;
    }

    if (page === 'Contact') {
      return <Contact setPage={setPage} />;
    }

    if (page === 'Auth') {
      return (
        <Auth
          onLogin={u => {
            localStorage.setItem(
              'ustaadUser',
              JSON.stringify(u)
            );

            const token = localStorage.getItem('ustaadToken') || '';
            saveAccountSession(u, token);
            setUser(u);
            setPage('Home');
          }}
          setPage={setPage}
        />
      );
    }

    return <Landing setPage={setPage} />;
  }

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <aside className={mobile ? 'open' : ''}>
        <Logo />

        <div className="nav">
          {nav.map(([n, I]) => (
            <button
              key={n}
              className={
                page === n ? 'active' : ''
              }
              onClick={() => {
                setPage(n);
                setMobile(false);
              }}
            >
              <I size={18} />
              {n}
            </button>
          ))}
        </div>

      </aside>

      <main>
        <header>
          <button
            className="mobilemenu"
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>

          <div>
            <b>
              Hello, {user.name || 'Student'}! 👋
            </b>

            <small>
              Grade {user.grade || 8} •{' '}
              {user.language || 'English'}
            </small>
          </div>

          <div className="topright">
            <button
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun /> : <Moon />}
            </button>

            <button
              className="avatar"
              onClick={() => setPage('Settings')}
            >
              <CircleUserRound />
            </button>

            <button
              className="logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="content">
          {page === 'Home' && (
            <Dashboard
              setPage={setPage}
              user={user}
            />
          )}

          {page === 'Chat with AI' && (
            <Chat key={user.email} user={user} />
          )}

          {page === 'Voice Learning' && (
            <Voice user={user} />
          )}

          {page === 'Homework Checker' && (
            <Homework user={user} />
          )}

          {page === 'Assignments' && (
            <Assignments user={user} />
          )}

          {page === 'My Progress' && <Progress />}

          {page === 'Saved Lessons' && <Saved />}

          {page === 'My Files' && <Files />}

          {page === 'Subjects' && (
            <SubjectsDashboard setPage={setPage} />
          )}

          {page === 'Settings' && (
            <SettingsPage
              key={user.email}
              user={user}
              onUpdate={u => {
                setUser(u);
                localStorage.setItem(
                  'ustaadUser',
                  JSON.stringify(u)
                );
              }}
              onSwitch={u => {
                setUser(u);
                setPage('Home');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------
   DASHBOARD
------------------------------------------------------- */

function Card({ children, className = '' }) {
  return (
    <section className={'card ' + className}>
      {children}
    </section>
  );
}

function Dashboard({ setPage, user }) {
  return (
    <>
      <div className="welcome-strip">
        <div>
          <div className="eyebrow">
            USTAAD AI • PERSONAL LEARNING
          </div>

          <h1>
            Your learning dashboard.
          </h1>

          <p>
            Ask, listen, practice, upload, verify and
            track your progress in one place.
          </p>
        </div>

        <div className="student-badge">
          <GraduationCap />
          <span>
            Grade {user.grade || 8}
          </span>
        </div>
      </div>

      <div className="twocol">
        <Card>
          <div className="banner">
            <div>
              <label>AI TUTOR</label>

              <h2>
                Ask anything.
                <br />
                Learn step by step.
              </h2>

              <p>
                Choose your grade, subject and language,
                then ask Ustaad to teach the concept.
              </p>

              <div className="pills">
                <span>English</span>
                <span>اردو</span>
                <span>Roman Urdu</span>
              </div>
            </div>

            <div className="teacher">
              👨‍🏫
            </div>
          </div>
        </Card>

        <Card>
          <h3>Quick Actions</h3>

          {[
            ['Ask a Question', 'Chat with AI', Brain],
            ['Voice Mode', 'Voice Learning', Mic],
            ['Upload Homework', 'Homework Checker', Upload],
            ['Create Assignment', 'Assignments', WandSparkles]
          ].map(([a, b, I]) => (
            <button
              className="quick"
              key={b}
              onClick={() => setPage(b)}
            >
              <I />

              <div>
                <b>{a}</b>
                <small>{b}</small>
              </div>
            </button>
          ))}
        </Card>
      </div>

      <div className="twocol">
        <Card>
          <div className="cardtitle">
            <h3>Explore Subjects</h3>

            <button
              onClick={() => setPage('Subjects')}
            >
              All subjects →
            </button>
          </div>

          <div className="subjects">
            {subjects.map((s, i) => (
              <button
                key={s}
                onClick={() => setPage('Chat with AI')}
              >
                <span>
                  {['∑', 'Aa', '</>'][i]}
                </span>

                <b>{s}</b>

                <small>Grades 1–10</small>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3>Learning goals</h3>

          <div className="goal">
            <b>Practice consistency</b>
            <span>4 days this week</span>
          </div>

          <div className="goal">
            <b>Review weak topics</b>
            <span>Mathematics • Fractions</span>
          </div>

          <div className="goal">
            <b>Next step</b>
            <span>Ask Ustaad a question</span>
          </div>
        </Card>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   CHAT
------------------------------------------------------- */

function Chat({ user, voiceOutput = false }) {
  const chatStorageKey = `ustaadChat:${user.email || 'student'}`;
  const welcomeMessage = {
    r: 'a',
    t:
      'Assalam-o-Alaikum! I am Ustaad AI. Ask me a question in English, Urdu or Roman Urdu.'
  };

  const [msgs, setMsgs] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(chatStorageKey) || 'null'
        ) || [welcomeMessage]
      );
    } catch {
      return [welcomeMessage];
    }
  });

  const [q, setQ] = useState('');

  const [lang, setLang] = useState(
    user.language || 'English'
  );

  const [grade, setGrade] = useState(
    String(user.grade || 8)
  );

  const [subject, setSubject] =
    useState('Mathematics');

  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [translateBusy, setTranslateBusy] =
    useState(false);

  useEffect(() => {
    localStorage.setItem(
      chatStorageKey,
      JSON.stringify(msgs.slice(-50))
    );
  }, [msgs]);

  function speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const u =
        new SpeechSynthesisUtterance(text);

      u.lang =
        lang === 'Urdu'
          ? 'ur-PK'
          : lang === 'Roman Urdu'
            ? 'en-PK'
            : 'en-US';

      window.speechSynthesis.speak(u);
    }
  }

  async function send() {
    if (!q.trim() && !file) return;

    const x = q.trim();

    setQ('');

    setMsgs(m => [
      ...m,
      {
        r: 'u',
        t: x || `📎 ${file.name}`
      }
    ]);

    setBusy(true);

    try {
      let body;

      if (file) {
        body = new FormData();

        body.append('message', x);
        body.append('language', lang);
        body.append('grade', grade);
        body.append('subject', subject);
        body.append('file', file);
      } else {
        body = {
          message: x,
          language: lang,
          grade,
          subject
        };
      }

      const d = await api(
        '/api/ai/chat',
        body
      );

      setMsgs(m => [
        ...m,
        {
          r: 'a',
          t: d.answer,
          sources: d.sources || [],
          grounded: d.grounded
        }
      ]);

      if (voiceOutput) {
        speak(d.answer);
      }
    } catch (e) {
      setMsgs(m => [
        ...m,
        {
          r: 'a',
          t: `AI connection error: ${e.message}`
        }
      ]);
    } finally {
      setFile(null);
      setBusy(false);
    }
  }

  async function translateLast() {
    const last = [...msgs]
      .reverse()
      .find(m => m.r === 'a' && m.t);

    if (!last) return;

    setTranslateBusy(true);

    try {
      const target =
        lang === 'English'
          ? 'Urdu'
          : lang === 'Urdu'
            ? 'Roman Urdu'
            : 'English';

      const d = await api(
        '/api/ai/translate',
        {
          text: last.t,
          targetLanguage: target,
          grade
        }
      );

      setMsgs(m => [
        ...m,
        {
          r: 'a',
          t: `### Translation • ${target}\n\n${d.text}`
        }
      ]);
    } catch (e) {
      setMsgs(m => [
        ...m,
        {
          r: 'a',
          t: `Translation error: ${e.message}`
        }
      ]);
    } finally {
      setTranslateBusy(false);
    }
  }

  function newChat() {
    setMsgs([welcomeMessage]);
    localStorage.setItem(chatStorageKey, JSON.stringify([welcomeMessage]));
    setQ('');
    setFile(null);
  }

  function deleteChat() {
    if (!window.confirm('Delete this chat? This removes the saved chat from this device.')) return;
    localStorage.removeItem(chatStorageKey);
    setMsgs([welcomeMessage]);
    setQ('');
    setFile(null);
  }

  return (
    <Card className="chat-card">
      <div className="chathead">
        <div>
          <div className="eyebrow">
            AI TUTOR
          </div>

          <h2>Chat with Ustaad</h2>

          <small>
            Step-by-step teaching • follow-up questions
            • multilingual learning
          </small>
        </div>

        <div className="selectgroup">
          <select
            value={grade}
            onChange={e =>
              setGrade(e.target.value)
            }
          >
            {grades.map(g => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <select
            value={subject}
            onChange={e =>
              setSubject(e.target.value)
            }
          >
            {subjects.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button className="chat-control" onClick={newChat} title="Start a new chat">
            <ListPlus size={15} />
            New chat
          </button>

          <button className="chat-control danger" onClick={deleteChat} title="Delete this chat">
            <Trash2 size={15} />
            Delete chat
          </button>
        </div>
      </div>

      <div className="messages">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              m.r === 'u'
                ? 'msg user'
                : 'msg'
            }
          >
            <div className="msgtext">
              {m.r === 'a' ? (
                <MarkdownAnswer>
                  {m.t}
                </MarkdownAnswer>
              ) : (
                <div className="user-text">
                  {m.t}
                </div>
              )}
            </div>

            {m.r === 'a' && (
              <div className="msgactions">
                <button
                  onClick={() => speak(m.t)}
                >
                  <Volume2 size={14} />
                  Listen
                </button>

                <button
                  onClick={translateLast}
                >
                  <Languages size={14} />

                  {translateBusy
                    ? 'Translating…'
                    : 'Translate'}
                </button>
              </div>
            )}

            {m.sources?.length > 0 && (
              <div className="sources">
                <b>Sources</b>

                {m.sources.map((s, j) => (
                  <a
                    key={j}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={12} />
                    {s.title || s.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="thinking">
            <RefreshCw size={14} />
            Ustaad is thinking and checking the
            question…
          </div>
        )}
      </div>

      <div className="composer">
        <input
          value={q}
          onChange={e =>
            setQ(e.target.value)
          }
          onKeyDown={e =>
            e.key === 'Enter' && send()
          }
          placeholder="Ask Ustaad anything…"
        />

        <button
          className="sendbutton"
          onClick={send}
        >
          <Send size={18} />
        </button>
      </div>

      <div className="chattools">
        <Languages />

        <select
          value={lang}
          onChange={e =>
            setLang(e.target.value)
          }
        >
          {languages.map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <label className="attach">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={e =>
              setFile(
                e.target.files?.[0] || null
              )
            }
          />

          <Paperclip size={14} />

          {file
            ? file.name
            : 'Attach image'}
        </label>

        {file && (
          <button
            onClick={() => setFile(null)}
            className="tinybutton"
          >
            <XCircle size={14} />
            Remove
          </button>
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------
   VOICE
------------------------------------------------------- */

function Voice({ user }) {
  const [on, setOn] = useState(false);
  const [voice, setVoice] = useState(true);
  const [lang, setLang] = useState(
    user.language || 'English'
  );
  const [transcript, setTranscript] =
    useState('');
  const [answer, setAnswer] = useState('');

  const start = () => {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SR) {
      alert(
        'Speech recognition is not supported in this browser. Chrome/Edge usually support it.'
      );
      return;
    }

    const r = new SR();

    r.lang =
      lang === 'Urdu'
        ? 'ur-PK'
        : 'en-US';

    r.interimResults = false;

    r.onstart = () => setOn(true);
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);

    r.onresult = async e => {
      const text =
        e.results[0][0].transcript;

      setTranscript(text);

      try {
        const d = await api(
          '/api/ai/chat',
          {
            message: text,
            language: lang,
            grade: user.grade || 8,
            subject: 'General Learning'
          }
        );

        setAnswer(d.answer);

        if (
          voice &&
          'speechSynthesis' in window
        ) {
          const u =
            new SpeechSynthesisUtterance(
              d.answer
            );

          u.lang =
            lang === 'Urdu'
              ? 'ur-PK'
              : lang === 'Roman Urdu'
                ? 'en-PK'
                : 'en-US';

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        }
      } catch (err) {
        setAnswer(
          `AI connection error: ${err.message}`
        );
      }
    };

    r.start();
  };

  return (
    <Card>
      <div className="voice">
        <div className="eyebrow">
          VOICE LEARNING
        </div>

        <h2>Talk to your Ustaad</h2>

        <p>
          Enable voice output to hear the
          explanation. Disable it for text-only
          learning.
        </p>

        <div
          className={
            'mic ' + (on ? 'pulse' : '')
          }
        >
          <Mic size={54} />
        </div>

        <div className="voice-controls">
          <select
            value={lang}
            onChange={e =>
              setLang(e.target.value)
            }
          >
            {languages.map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <button
            className="primary"
            onClick={start}
          >
            <Mic />

            {on
              ? 'Listening…'
              : 'Start Speaking'}
          </button>
        </div>

        <label className="check">
          <input
            type="checkbox"
            checked={voice}
            onChange={e =>
              setVoice(e.target.checked)
            }
          />

          AI voice response enabled
        </label>

        {transcript && (
          <div className="voice-result">
            <small>You said</small>

            <p>{transcript}</p>

            {answer && (
              <>
                <small>Ustaad</small>

                <MarkdownAnswer>
                  {answer}
                </MarkdownAnswer>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------
   HOMEWORK
------------------------------------------------------- */

function Homework({ user }) {
  const [f, setF] = useState(null);
  const [r, setR] = useState(null);
  const [busy, setBusy] = useState(false);

  async function analyze() {
    if (!f) return;

    setBusy(true);

    try {
      const fd = new FormData();

      fd.append('file', f);
      fd.append(
        'language',
        user.language || 'English'
      );
      fd.append(
        'grade',
        user.grade || 8
      );

      setR(
        await api(
          '/api/homework/analyze',
          fd
        )
      );
    } catch (e) {
      setR({
        error: e.message
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Card>
        <div className="sectiontitle">
          <ClipboardCheck />

          <div>
            <div className="eyebrow">
              AI VISION
            </div>

            <h2>Homework Checker</h2>

            <small>
              Upload work and learn from every mistake.
            </small>
          </div>
        </div>

        <label className="drop">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={e =>
              setF(
                e.target.files?.[0] ||
                null
              )
            }
          />

          <Upload />

          <b>
            {f
              ? f.name
              : 'Drop homework here or click to browse'}
          </b>

          <small>
            PNG, JPG or WEBP • up to 15 MB
          </small>
        </label>

        <button
          className="primary"
          disabled={!f || busy}
          onClick={analyze}
        >
          {busy
            ? 'Analyzing…'
            : 'Analyze Homework'}
        </button>
      </Card>

      {r && (
        <Card>
          <h3>Analysis</h3>

          {r.error ? (
            <div className="errorbox">
              {r.error}
            </div>
          ) : (
            <>
              <p>{r.summary}</p>

              {(r.results || []).map(
                (x, i) => (
                  <div
                    className="result"
                    key={i}
                  >
                    <div>
                      <b>{x.question}</b>

                      <span
                        className={
                          'status ' +
                          x.status
                        }
                      >
                        {x.status}
                      </span>
                    </div>

                    <p>
                      <b>Your answer:</b>{' '}
                      {x.student_answer}
                    </p>

                    <p>
                      <b>Correct answer:</b>{' '}
                      {x.correct_answer}
                    </p>

                    <p>
                      {x.explanation}
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </Card>
      )}
    </>
  );
}

/* -------------------------------------------------------
   ASSIGNMENTS
------------------------------------------------------- */

function Assignments({ user }) {
  const [topic, setTopic] =
    useState('Fractions');

  const [difficulty, setDifficulty] =
    useState('medium');

  const [count, setCount] =
    useState(10);

  const [result, setResult] =
    useState(null);

  const [busy, setBusy] =
    useState(false);

  async function generate() {
    setBusy(true);

    try {
      setResult(
        await api(
          '/api/assignments/generate',
          {
            subject: 'Mathematics',
            grade: user.grade || 8,
            topic,
            difficulty,
            questions: Number(count),
            language:
              user.language || 'English',
            studentDetails:
              `Student: ${user.name}, Grade ${user.grade}`
          }
        )
      );
    } catch (e) {
      setResult({
        error: e.message
      });
    } finally {
      setBusy(false);
    }
  }

  function download(kind) {
    if (!result || result.error) return;

    const text = `${result.title}

${result.instructions}

${(result.questions || [])
      .map(
        q =>
          `${q.number}. ${q.question} (${q.marks} marks)`
      )
      .join('\n\n')}`;

    const blob = new Blob(
      [
        kind === 'doc'
          ? `<html><body><pre>${text.replaceAll(
              '<',
              '&lt;'
            )}</pre></body></html>`
          : text
      ],
      {
        type:
          kind === 'doc'
            ? 'application/msword'
            : 'text/plain'
      }
    );

    const a =
      document.createElement('a');

    a.href =
      URL.createObjectURL(blob);

    a.download =
      `ustaad-assignment.${
        kind === 'doc' ? 'doc' : 'txt'
      }`;

    a.click();

    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <Card>
        <div className="sectiontitle">
          <WandSparkles />

          <div>
            <div className="eyebrow">
              GENERATIVE PRACTICE
            </div>

            <h2>
              Assignment Builder
            </h2>

            <small>
              Personalized to the student's grade,
              topic and language.
            </small>
          </div>
        </div>

        <div className="formgrid">
          <input
            value={topic}
            onChange={e =>
              setTopic(e.target.value)
            }
            placeholder="Topic"
          />

          <select
            value={difficulty}
            onChange={e =>
              setDifficulty(e.target.value)
            }
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>

          <select
            value={count}
            onChange={e =>
              setCount(e.target.value)
            }
          >
            {[5, 10, 15, 20].map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <button
          className="primary"
          onClick={generate}
          disabled={busy}
        >
          {busy
            ? 'Creating…'
            : 'Generate Assignment'}
        </button>
      </Card>

      {result && (
        <Card>
          {result.error ? (
            <div className="errorbox">
              {result.error}
            </div>
          ) : (
            <>
              <div className="cardtitle">
                <div>
                  <h2>{result.title}</h2>
                  <p>
                    {result.instructions}
                  </p>
                </div>

                <div className="exportbuttons">
                  <button
                    onClick={() =>
                      download('doc')
                    }
                  >
                    <Download size={14} />
                    DOC
                  </button>

                  <button
                    onClick={() =>
                      window.print()
                    }
                  >
                    <Download size={14} />
                    PDF / Print
                  </button>
                </div>
              </div>

              <div className="assignment-list">
                {result.questions?.map(
                  q => (
                    <div key={q.number}>
                      <b>{q.number}.</b>

                      <span>
                        {q.question}
                      </span>

                      <small>
                        {q.marks} marks
                      </small>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}

/* -------------------------------------------------------
   PROGRESS
------------------------------------------------------- */

function Progress() {
  return (
    <>
      <div className="pageheading">
        <div className="eyebrow">
          MY PROGRESS
        </div>

        <h2>
          Keep your learning visible.
        </h2>
      </div>

      <div className="stats">
        {[
          ['Questions', '146'],
          ['Lessons', '32'],
          ['Quizzes', '18'],
          ['Homework', '24']
        ].map(([a, v]) => (
          <Card key={a}>
            <small>{a}</small>
            <strong>{v}</strong>
          </Card>
        ))}
      </div>

      <Card>
        <h3>Subject performance</h3>

        {[
          ['Mathematics', 78],
          ['English', 64],
          ['Computer Science', 88]
        ].map(([a, v]) => (
          <div
            className="progress"
            key={a}
          >
            <div>
              <b>{a}</b>
              <b>{v}%</b>
            </div>

            <i>
              <span
                style={{
                  width: v + '%'
                }}
              />
            </i>
          </div>
        ))}
      </Card>
    </>
  );
}

/* -------------------------------------------------------
   SAVED
------------------------------------------------------- */

function Saved() {
  const [saved, setSaved] =
    useState(() =>
      JSON.parse(
        localStorage.getItem(
          'ustaadSaved'
        ) || '[]'
      )
    );

  const remove = i => {
    const n = saved.filter(
      (_, x) => x !== i
    );

    setSaved(n);

    localStorage.setItem(
      'ustaadSaved',
      JSON.stringify(n)
    );
  };

  return (
    <>
      <div className="pageheading">
        <div className="eyebrow">
          SAVED LESSONS
        </div>

        <h2>
          Your personal revision shelf.
        </h2>
      </div>

      <div className="grid">
        {(saved.length
          ? saved
          : [
              'Fractions explained simply',
              'HTML basics',
              'Parts of speech',
              'Introduction to algorithms'
            ]
        ).map((x, i) => (
          <Card key={i}>
            <Bookmark />

            <h3>{x}</h3>

            <small>
              Review anytime
            </small>

            {saved.length > 0 && (
              <button
                className="tinybutton"
                onClick={() =>
                  remove(i)
                }
              >
                <Trash2 size={13} />
                Remove
              </button>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------------------
   FILES
------------------------------------------------------- */

function Files() {
  const [fs, setFs] =
    useState(() =>
      JSON.parse(
        localStorage.getItem(
          'ustaadFiles'
        ) || '[]'
      )
    );

  function add(e) {
    const list = [
      ...fs,
      ...Array.from(
        e.target.files || []
      ).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      }))
    ];

    setFs(list);

    localStorage.setItem(
      'ustaadFiles',
      JSON.stringify(list)
    );
  }

  return (
    <>
      <div className="pageheading">
        <div className="eyebrow">
          MY FILES
        </div>

        <h2>
          Learning materials.
        </h2>
      </div>

      <Card>
        <label className="addfiles">
          <input
            type="file"
            multiple
            onChange={add}
          />

          <Plus />
          Add files
        </label>

        {fs.map((f, i) => (
          <div
            className="file"
            key={i}
          >
            <FileText />

            <b>{f.name}</b>

            <small>
              {Math.round(
                f.size / 1024
              )}{' '}
              KB
            </small>
          </div>
        ))}
      </Card>
    </>
  );
}

/* -------------------------------------------------------
   SUBJECTS DASHBOARD
------------------------------------------------------- */

function SubjectsDashboard({
  setPage
}) {
  const [grade, setGrade] =
    useState('8');

  return (
    <>
      <div className="pageheading">
        <div className="eyebrow">
          SUBJECTS
        </div>

        <h2>
          Grades 1–10 learning tracks.
        </h2>
      </div>

      <div className="grade-pills">
        {grades.map(g => (
          <button
            key={g}
            className={
              grade === g
                ? 'activepill'
                : ''
            }
            onClick={() =>
              setGrade(g)
            }
          >
            Grade {g}
          </button>
        ))}
      </div>

      <div className="subject-public-grid">
        {subjects.map((s, i) => (
          <Card key={s}>
            <span className="subjecticon">
              {['∑', 'Aa', '</>'][i]}
            </span>

            <h3>{s}</h3>

            <p>
              Grade {grade} concepts,
              examples, exercises and AI
              tutoring.
            </p>

            <button
              className="textbutton"
              onClick={() =>
                setPage('Chat with AI')
              }
            >
              Ask Ustaad
              <ChevronRight size={15} />
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------------------------------------------------------
   SETTINGS
------------------------------------------------------- */

function SettingsPage({
  user,
  onUpdate,
  onSwitch
}) {
  const [name, setName] = useState(user.name || 'Student');
  const [grade, setGrade] = useState(String(user.grade || 8));
  const [language, setLanguage] = useState(user.language || 'English');
  const [voice, setVoice] = useState(
    localStorage.getItem('ustaadVoice') !== 'off'
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [accountGrade, setAccountGrade] = useState('8');
  const [accountLanguage, setAccountLanguage] = useState('English');
  const [accounts, setAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function save() {
    const u = {
      ...user,
      name,
      grade: Number(grade),
      language
    };

    onUpdate(u);
    saveAccountSession(u, localStorage.getItem('ustaadToken') || '');

    localStorage.setItem('ustaadVoice', voice ? 'on' : 'off');
    setAccounts(JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'));
    setMessage('Settings saved.');
    setError('');
  }

  async function changePassword() {
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    try {
      await api('/api/auth/change-password', {
        email: user.email,
        currentPassword,
        newPassword
      });

      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password changed successfully.');
    } catch (e) {
      setError(e.message);
    }
  }

  async function addAccount() {
    setMessage('');
    setError('');

    if (!accountEmail || accountPassword.length < 6) {
      setError('Enter an email and a password of at least 6 characters.');
      return;
    }

    try {
      const data = await api('/api/auth/signup', {
        name: accountName || 'Student',
        email: accountEmail,
        password: accountPassword,
        grade: Number(accountGrade),
        language: accountLanguage
      });

      localStorage.setItem('ustaadToken', data.token);
      localStorage.setItem('ustaadUser', JSON.stringify(data.user));
      saveAccountSession(data.user, data.token);
      setAccounts(JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'));

      setAccountName('');
      setAccountEmail('');
      setAccountPassword('');
      setMessage('New account added. You are now using that account.');
      onSwitch(data.user);
    } catch (e) {
      setError(e.message);
    }
  }

  function switchAccount(account) {
    localStorage.setItem('ustaadToken', account.token);
    localStorage.setItem('ustaadUser', JSON.stringify(account.user));
    onSwitch(account.user);
    setMessage(`Switched to ${account.user.email}.`);
  }

  function removeSavedAccount(email) {
    const next = accounts.filter(a => a.email !== email);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
    setAccounts(next);
  }

  return (
    <>
      <div className="pageheading">
        <div className="eyebrow">SETTINGS</div>
        <h2>Make Ustaad yours.</h2>
        <p className="muted">
          Manage your profile, language, voice, password and accounts.
        </p>
      </div>

      {message && <div className="successbox">{message}</div>}
      {error && <div className="errorbox">{error}</div>}

      <div className="grid">
        <Card>
          <h3>Profile</h3>

          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />

          <select
            value={grade}
            onChange={e => setGrade(e.target.value)}
          >
            {grades.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </Card>

        <Card>
          <h3>Language</h3>
          <p>Choose the default language for new answers.</p>

          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
        </Card>

        <Card>
          <h3>Voice</h3>

          <label className="check">
            <input
              type="checkbox"
              checked={voice}
              onChange={e => setVoice(e.target.checked)}
            />
            Voice output enabled
          </label>

          <p className="muted">
            Turn this off whenever you want text-only answers.
          </p>
        </Card>
      </div>

      <Card>
        <h3>Password</h3>
        <p>Change the password for this account.</p>

        <div className="formgrid settings-password-grid">
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />

          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password (6+ characters)"
          />

          <button className="primary" onClick={changePassword}>
            <KeyRound size={16} />
            Change password
          </button>
        </div>
      </Card>

      <Card>
        <div className="cardtitle">
          <div>
            <h3>Accounts</h3>
            <p>Add another account and switch between accounts on this device.</p>
          </div>
          <UserRoundPlus />
        </div>

        <div className="account-list">
          {accounts.map(account => (
            <div className="account-row" key={account.email}>
              <div>
                <b>{account.user.name || 'Student'}</b>
                <small>{account.email} • Grade {account.user.grade}</small>
              </div>

              <div className="account-actions">
                {account.email === user.email ? (
                  <span className="current-account">Current</span>
                ) : (
                  <button className="tinybutton" onClick={() => switchAccount(account)}>
                    Switch
                  </button>
                )}

                {account.email !== user.email && (
                  <button
                    className="tinybutton danger-button"
                    onClick={() => removeSavedAccount(account.email)}
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="add-account">
          <h4>Add account</h4>

          <div className="formgrid">
            <input
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder="Student name"
            />

            <input
              type="email"
              value={accountEmail}
              onChange={e => setAccountEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              type="password"
              value={accountPassword}
              onChange={e => setAccountPassword(e.target.value)}
              placeholder="Password (6+ characters)"
            />

            <select
              value={accountGrade}
              onChange={e => setAccountGrade(e.target.value)}
            >
              {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>

            <select
              value={accountLanguage}
              onChange={e => setAccountLanguage(e.target.value)}
            >
              {languages.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <button className="primary" onClick={addAccount}>
            <UserRoundPlus size={16} />
            Add & switch account
          </button>
        </div>
      </Card>

      <Card>
        <h3>Privacy & security</h3>
        <p>
          AI credentials remain on the backend. Chat, saved lessons and account
          switching preferences are stored locally in the browser for this MVP.
          Connect MongoDB Atlas for shared, cross-device production persistence.
        </p>

        <button className="primary" onClick={save}>
          Save Settings
        </button>
      </Card>
    </>
  );
}

/* -------------------------------------------------------
   START APP
------------------------------------------------------- */

createRoot(
  document.getElementById('root')
).render(<App />);