# Vignan EduTrack AI Agent 🎓

**An AI Agent that turns disconnected assessment scores into a specific, actionable next step — for the student and, when needed, for their faculty.**

Vignan EduTrack AI Agent takes a student's CA1, CA2, and Semester-End scores, reasons through them using real, transparent code logic, decides what kind of support they actually need, and then takes genuine action — a personalized study plan, and where warranted, a human-approved faculty alert. It doesn't just chat about performance; it works through a full agent pipeline, visibly, step by step.

Built for **Vignan's Build an AI Agent Competition 2026**.

---

## The Problem It Solves

Vignan Online's assessment structure has three distinct components each semester — CA1 (descriptive, 30 marks), CA2 (MCQ, 30 marks), and the Semester-End Exam (MCQ + descriptive, 70 marks). These scores currently exist as separate, disconnected numbers. No system identifies *why* a student is scoring the way they are — whether the real gap is recall (MCQs) or explanation and construction (descriptive answers). Students and faculty only see the final outcome, never the pattern behind it, until it's too late to act.

## What It Does

- **Reads real assessment data** — CA1, CA2, and Semester-End scores, entered directly by the student
- **Reasons transparently** — a visible, step-by-step log shows exactly what the agent is doing: Understand → Reason/Plan → Use Data → Decide, live on screen, not hidden behind a spinner
- **Classifies the performance pattern** using deterministic code logic (not AI) — MCQ-strong/descriptive-weak, descriptive-strong/MCQ-weak, needs overall support, or balanced/consistently strong
- **Looks up matching guidance** from a structured knowledge base (`data.json`) before deciding anything
- **Decides whether a pattern needs human attention** — and only then, conditionally, prepares a faculty-alert path
- **Calls AI for exactly one job** — turning the already-made decision into a warm, plain-language explanation and a 3-step action plan
- **Asks the student to verify** the analysis before anything is finalized
- **Takes real action** — generates an actual downloadable `.txt` study plan, and requires an explicit human approval checkbox before logging a simulated faculty alert with a timestamp
- **Produces a clear final result** — a visual MCQ vs. Descriptive bar-chart breakdown alongside the AI's explanation

## Why This Is a True Agent, Not a Chatbot

The competition rules are explicit: *"A simple prompt sent to an AI model followed by displaying its response will not qualify as a complete AI Agent."* This project is built specifically around that line.

Every decision here — the classification, the faculty-alert trigger — happens in transparent, testable JavaScript **before** AI is ever called. AI is used only for one well-scoped task: writing warm, clear language around a decision that's already been made deterministically. This is the same reason the reasoning log is shown live on screen rather than hidden — so anyone reviewing the agent can see *exactly* how it got from raw scores to a final result, not just trust that it did.

## Tech Stack

- **HTML, CSS, JavaScript** — no frontend framework
- **Groq API** (Llama-based model, `openai/gpt-oss-120b`) — used only for the explanation-generation step
- **Vercel Serverless Function** (`/api/chat.js`) — keeps the API key secure server-side, never exposed in browser-visible code, in line with the competition's ethical guidelines
- **`data.json`** — a small structured knowledge base the agent references before making its decision

## Repository Structure

| File | Purpose |
|---|---|
| `index.html` | Main application page — the 4-step agent interface |
| `style.css` | Styling for all steps, including the result bar chart |
| `script.js` | Core agent logic — reasoning, classification, decision-making, verification, and action steps |
| `data.json` | Structured knowledge base referenced during the "Use Tools/Data" step |
| `api/chat.js` | Vercel serverless function — securely calls the Groq API without exposing the key |

## Running It

### Option A — View the Live Deployed Application (Recommended)
Visit **https://vignan-edutrack-agent.vercel.app/** — no installation needed. Enter sample assessment scores and click "Analyze My Performance" to run the full agent pipeline end to end.

### Option B — Run Locally / Redeploy Your Own Copy
1. Clone this repository
2. Get a free API key at **console.groq.com**
3. Deploy the project on Vercel, adding an environment variable named `GROQ_API_KEY` with that key
4. Open the deployed URL — the `/api/chat` serverless function will now securely handle all AI calls

**Note:** This project needs a Vercel-style serverless environment to run the AI explanation step, since the key is intentionally kept server-side. Opening `index.html` directly from a local folder (without deployment) will still run Steps 1–4 of the reasoning and decision logic correctly, but the AI-generated explanation call won't resolve.

## Test Cases

See `Test_Cases.md` for four sample score combinations and their expected classifications, including one that correctly triggers the faculty-alert flow.

---

*Built by M Sai Varshini, BBA Semester 4, USN: 251CK01003, for Vignan's Build an AI Agent Competition 2026.*
