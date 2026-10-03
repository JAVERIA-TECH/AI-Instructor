# Ustaad AI — Deployment

## Architecture

```text
Vercel React app ──REST──> Node/Express backend ──> Groq API
                                      └───────────> MongoDB (optional)
```

## GitHub

Do not commit `backend/.env`. The repository should contain only
`backend/.env.example` with placeholder values.

## Vercel

Set project root to `frontend`.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  `VITE_API_URL=https://YOUR-BACKEND.example.com`

## Backend

Deploy the `backend` folder to a Node-compatible service.

Set:
- `PORT`
- `CLIENT_URL`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `GROQ_VISION_MODEL`
- `JWT_SECRET`
- optional `MONGODB_URI`

## Streamlit

The `streamlit/` folder is an optional showcase wrapper. Streamlit itself uses
Python, while the core Ustaad AI application is JavaScript-only.

## Production checklist

- Keep AI keys server-side.
- Enable HTTPS.
- Use a strong JWT secret.
- Configure MongoDB for persistent accounts and chats.
- Add rate limiting and production authentication before public SaaS launch.
