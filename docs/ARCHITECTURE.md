# Ustaad AI — Architecture

## Overview

Ustaad AI is a JavaScript-first multilingual student-learning MVP.

```text
Browser
  ↓
React + Vite + Tailwind/CSS
  ↓ REST / multipart uploads
Node.js + Express
  ├── Groq chat completion API
  ├── Groq multimodal homework analysis
  └── MongoDB Atlas (optional persistence)
```

## AI flow

1. Student selects grade, subject and language.
2. React sends the question to the Node backend.
3. The backend builds a grade-aware teaching prompt.
4. Groq generates the answer.
5. React renders the response with Markdown.
6. Optional browser speech synthesis reads the answer aloud.

The submission build does not claim live web search or custom vector RAG.

## Student data flow

The MVP stores chat, saved lessons, file metadata, theme and account-switching
preferences locally in the browser. MongoDB is provided as the production
persistence extension point.

## Voice flow

```text
Student microphone
   ↓
Browser SpeechRecognition
   ↓ transcript
Node/Express → Groq
   ↓ text answer
Browser SpeechSynthesis
```

## Deployment

```text
GitHub
 ├── frontend → Vercel
 ├── backend  → Node-compatible host
 └── streamlit → Streamlit Community Cloud (optional showcase)
```
