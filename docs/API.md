# Ustaad AI API

## GET /api/health
Returns backend, model, AI configuration and database status.

## POST /api/auth/signup
Creates an MVP account in local memory and returns a JWT.

## POST /api/auth/login
Logs into an MVP account stored by the running backend.

## POST /api/auth/change-password
Changes the password for a local MVP account.

JSON:
```json
{
  "email": "student@example.com",
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

## POST /api/auth/demo-login
Creates a demo session.

## POST /api/ai/chat
Accepts JSON or multipart form data.

JSON fields:
- `message`
- `language`
- `grade`
- `subject`

Multipart form data may additionally include `file`.

Text chat uses the configured Groq chat model. Image attachments can be
processed through the configured Groq vision model.

## POST /api/ai/translate

```json
{
  "text": "Fractions represent equal parts of a whole.",
  "targetLanguage": "Urdu",
  "grade": 8
}
```

## POST /api/homework/analyze
Multipart field:
- `file`

The endpoint returns a structured homework summary and per-question feedback.

## POST /api/assignments/generate
Generates personalized assignment JSON from subject, grade, topic, difficulty,
question count, language and student details.

## POST /api/quizzes/generate
Generates quiz content for the selected student context.
