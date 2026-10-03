# AI Instructor — Your Personal Multilingual AI Teacher

## Introduction

Ustaad AI is an AI-powered multilingual learning platform designed to work as a personal digital teacher for students from Grades 1–10.

It provides an interactive learning environment where students can ask questions, learn concepts, practice subjects, check homework, generate assignments, track learning progress, and interact with AI using text and voice.

Ustaad AI is designed to make learning more personalized, accessible, interactive, and student-friendly by supporting English, Urdu, and Roman Urdu.

---

## Overview

Ustaad AI combines modern web technologies and generative AI to create a complete digital learning experience for students.

The platform provides:

- AI-powered educational conversations
- Multilingual learning support
- Grade-based learning for Grades 1–10
- Subject-based learning
- Text-based AI tutoring
- Voice learning and interaction
- Homework checking
- Assignment generation
- Quiz and practice support
- Progress tracking
- Saved lessons and learning content
- Student settings and personalization
- File and image-based learning support

The system is designed with a modern web architecture where the frontend provides the user experience, the backend handles application logic and AI communication, and the AI service is securely accessed through backend environment variables.

---

## Purpose

The main purpose of Ustaad AI is to provide students with an accessible personal AI teacher that can support their learning anytime.

The project aims to:

- Make AI-assisted education easier to access
- Provide personalized explanations according to student needs
- Support students from Grades 1–10
- Make difficult concepts easier to understand
- Support multiple languages for better accessibility
- Help students with homework and assignments
- Provide interactive learning through text and voice
- Encourage independent learning and practice
- Keep useful learning content organized for students

Ustaad AI is intended to act as a learning assistant that supports students alongside their regular educational studies.

---

## Features

### AI Personal Teacher

Students can interact with an AI teacher to ask questions, understand concepts, request explanations, and receive educational guidance.

### Multilingual Learning

The platform supports:

- English
- Urdu
- Roman Urdu

Students can communicate with the AI according to their preferred language.

### Grades 1–10

The platform supports educational learning for students from Grade 1 through Grade 10.

### Subjects

Ustaad AI provides subject-based learning support, including:

- Mathematics
- English
- Computer Science

The platform is designed so additional subjects can be added in the future.

### AI Chat

Students can have interactive conversations with the AI teacher and ask follow-up questions to understand topics more deeply.

### Voice Learning

The platform supports voice-based learning interaction.

Students can use voice input and can enable or disable AI voice responses according to their preference.

### Homework Checker

Students can provide homework or questions for AI-assisted checking and explanation.

The system can help identify mistakes and explain concepts so students can learn from them.

### Assignments

Students can generate educational assignments based on selected topics and learning requirements.

Assignments can also be prepared in downloadable document formats.

### Quizzes and Practice

The platform supports educational practice and quiz-style learning to help students reinforce concepts.

### Progress Tracking

Students can monitor their learning activity and progress through the dashboard.

### Saved Lessons

Useful lessons and learning content can be saved so students can return to them later.

### Student Personalization

Students can manage their account settings, preferred language, learning preferences, and other personal settings.

### File and Image Learning Support

The platform can work with supported student-provided files and images for educational tasks such as homework assistance and question understanding.

---

## Tools & Technologies

### Frontend

- JavaScript
- React
- Vite
- HTML5
- CSS3
- Tailwind CSS

### Backend

- Node.js
- Express.js
- REST APIs

### Artificial Intelligence

- Generative AI
- Groq API
- AI-powered conversational tutoring
- Multilingual AI interaction
- AI-assisted homework and assignment support
- Voice-based AI interaction

### Database & Data

- MongoDB
- Persistent application data
- Learning and user-related data management

### Voice & File Processing

- Browser-based voice interaction
- Speech-to-text support
- Text-to-speech support
- Image and file-based learning workflows

### Development & Deployment

- Git
- GitHub
- Vercel
- Streamlit
- Docker
- GitHub Actions

---

## Project Architecture

Ustaad AI follows a modular full-stack architecture consisting of the frontend, backend, AI integration, data layer, and deployment components.

```text
                         ┌─────────────────────┐
                         │       Student       │
                         │   Web / Browser     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │ React + Vite +      │
                         │ Tailwind CSS        │
                         └──────────┬──────────┘
                                    │
                              REST API Requests
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Backend       │
                         │ Node.js + Express   │
                         │ REST API Layer      │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └─────────────┐
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │    Groq AI API   │             │     MongoDB      │
          │ Generative AI    │             │ Application Data │
          │ AI Conversations │             │ User/Learning    │
          └──────────────────┘             └──────────────────┘
                                 │
                                 ▼
                       ┌─────────────────────┐
                       │   Learning Services │
                       │ Homework            │
                       │ Assignments         │
                       │ Quizzes             │
                       │ Progress            │
                       │ Saved Lessons       │
                       └─────────────────────┘
