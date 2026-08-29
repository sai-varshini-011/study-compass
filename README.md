# StudyCompass — Student Performance Insight Agent

🏆 *This project (originally built as "Vignan EduTrack AI Agent") won 3rd Prize in Vignan's Agentic AI Day 2026 — Build an AI Agent competition.*

## Problem Statement
Students often struggle to make sense of their CA1, CA2, and Semester-End assessment scores — they see numbers, but not what those numbers mean for how they should study next. This project analyzes a student's score pattern (MCQ vs. Descriptive performance) and turns it into a clear, personalized, and encouraging study plan.

## Features
- **Score Input** — Student enters CA1, CA2, and Semester-End (MCQ + Descriptive) scores
- **Deterministic Classification Logic** — Real code (not AI) calculates MCQ vs. Descriptive averages and classifies the student into one of four performance patterns
- **Knowledge Base Lookup** — Matches the classification to pre-written guidance (focus area + recommended resource)
- **AI-Generated Explanation** — An LLM (via Groq API) turns the raw classification into a warm, encouraging written explanation
- **Human Verification Step** — Student reviews and confirms the analysis before the final report is generated
- **Downloadable Study Plan** — Generates a real, downloadable `.txt` study plan
- **Human-Approved Faculty Alert** — For students flagged as needing extra support, a simulated faculty alert can be sent, but only after the student explicitly approves it

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript (vanilla, no framework)
- **Backend:** Vercel Serverless Function (`api/chat.js`)
- **AI Model:** Groq API (`openai/gpt-oss-120b`)
- **Deployment:** Vercel

## Screenshots
*(Add screenshots of the 4 app steps here: Score Input, Agent Reasoning, Verify, Result & Action)*

## Live Demo
[https://vignan-edutrack-agent.vercel.app/](https://vignan-edutrack-agent.vercel.app/)

## Backend
Backend logic runs as a Vercel Serverless Function within the same deployment above (`/api/chat.js`) — no separate backend URL.

## Setup Instructions
1. Clone this repository:
   ```
   git clone <your-repo-url>
   cd <repo-folder>
   ```
2. Install the Vercel CLI (if not already installed):
   ```
   npm install -g vercel
   ```
3. Create a `.env` file in the project root and add your Groq API key (see Environment Variables below).
4. Run locally:
   ```
   vercel dev
   ```
5. Open the local URL shown in your terminal (usually `http://localhost:3000`).

## Environment Variables
| Variable | Description |
|----------|--------------|
| `GROQ_API_KEY` | API key for Groq's LLM API, used to generate the AI explanation text |

*(Never commit actual key values — only variable names are listed here.)*

---

Made by Sai Varshini — for the Build Your AI Automation Platform Workshop
