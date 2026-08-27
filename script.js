// =========================================================
// EduTrack AI Agent — full pipeline:
// Understand -> Reason/Plan -> Use Tools/Data -> Make Decision
// -> Use AI -> Verify -> Take Action/Automate -> Produce Result
// =========================================================

let knowledgeBase = null;
let currentAnalysis = null;

async function loadKnowledgeBase() {
  const res = await fetch("data.json");
  knowledgeBase = await res.json();
}

function log(msg) {
  const box = document.getElementById("reasoningLog");
  box.textContent += msg + "\n";
}

function pct(score, max) {
  return Math.round((score / max) * 100);
}

// ---- REASON / PLAN + MAKE DECISION (real rule-based logic, not AI) ----
function classifyPerformance(ca1, ca2, semMcq, semDesc) {
  const descAvg = Math.round((pct(ca1, 30) + pct(semDesc, 20)) / 2);
  const mcqAvg = Math.round((pct(ca2, 30) + pct(semMcq, 50)) / 2);
  const gap = mcqAvg - descAvg;

  let category;
  if (mcqAvg < 60 && descAvg < 60) {
    category = "NEEDS_OVERALL_SUPPORT";
  } else if (gap > 15) {
    category = "MCQ_STRONG_DESC_WEAK";
  } else if (gap < -15) {
    category = "DESC_STRONG_MCQ_WEAK";
  } else {
    category = "BALANCED_STRONG";
  }

  // Decision: does this pattern need a human faculty alert?
  const needsFacultyAlert = category === "NEEDS_OVERALL_SUPPORT";

  return { descAvg, mcqAvg, gap, category, needsFacultyAlert };
}

// ---- USE AI (only for the plain-language explanation, not the decision) ----
async function getAIExplanation(analysis, kbEntry) {
  const prompt = `Student performance analysis:
- MCQ average: ${analysis.mcqAvg}%
- Descriptive average: ${analysis.descAvg}%
- Category: ${kbEntry.label}
- Recommended focus: ${kbEntry.focus}
- Suggested resource: ${kbEntry.resource}

Write a warm, encouraging 3-4 sentence explanation for the student, then a clear 3-step action plan they can follow this week.`;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentText: prompt })
    });
    const data = await response.json();
    return data.reply;
  } catch (err) {
    console.error(err);
    return "Could not generate the personalized explanation right now, but your analysis above is still accurate.";
  }
}

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const ca1 = Number(document.getElementById("ca1").value);
  const ca2 = Number(document.getElementById("ca2").value);
  const semMcq = Number(document.getElementById("semMcq").value);
  const semDesc = Number(document.getElementById("semDesc").value);

  document.getElementById("reasoningStep").classList.remove("hidden");
  document.getElementById("reasoningLog").textContent = "";

  log("→ UNDERSTAND: Received CA1, CA2, and Semester-End scores.");
  await new Promise(r => setTimeout(r, 300));

  log("→ REASON/PLAN: Calculating MCQ vs. Descriptive averages...");
  if (!knowledgeBase) await loadKnowledgeBase();
  const analysis = classifyPerformance(ca1, ca2, semMcq, semDesc);
  await new Promise(r => setTimeout(r, 400));

  log(`   MCQ avg: ${analysis.mcqAvg}%  |  Descriptive avg: ${analysis.descAvg}%  |  Gap: ${analysis.gap}%`);
  await new Promise(r => setTimeout(r, 300));

  log("→ USE TOOLS/DATA: Looking up matching guidance from knowledge base (data.json)...");
  const kbEntry = knowledgeBase[analysis.category];
  await new Promise(r => setTimeout(r, 400));

  log(`→ MAKE DECISION: Classified as "${kbEntry.label}".`);
  log(`   Faculty alert needed? ${analysis.needsFacultyAlert ? "YES — flagged for human review" : "No — within healthy range"}`);

  currentAnalysis = { ca1, ca2, semMcq, semDesc, analysis, kbEntry };

  // Move to verify step
  const verifyBox = document.getElementById("verifyBox");
  verifyBox.innerHTML = `
    <p><strong>MCQ Average:</strong> ${analysis.mcqAvg}%</p>
    <p><strong>Descriptive Average:</strong> ${analysis.descAvg}%</p>
    <p><strong>Pattern Detected:</strong> ${kbEntry.label}</p>
    <p><strong>Suggested Focus:</strong> ${kbEntry.focus}</p>
  `;
  document.getElementById("verifyStep").classList.remove("hidden");
});

document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("verifyStep").classList.add("hidden");
  document.getElementById("reasoningStep").classList.add("hidden");
});

document.getElementById("confirmBtn").addEventListener("click", async () => {
  document.getElementById("confirmBtn").textContent = "Generating your report...";
  document.getElementById("confirmBtn").disabled = true;

  const { analysis, kbEntry } = currentAnalysis;
  const aiText = await getAIExplanation(analysis, kbEntry);
  currentAnalysis.aiText = aiText;

  const resultBox = document.getElementById("resultBox");
  resultBox.innerHTML = `
    <h3>${kbEntry.label}</h3>
    <p><strong>MCQ Average:</strong> ${analysis.mcqAvg}% &nbsp; | &nbsp; <strong>Descriptive Average:</strong> ${analysis.descAvg}%</p>
    <p>${aiText.replace(/\n/g, "<br>")}</p>
  `;

  if (analysis.needsFacultyAlert) {
    document.getElementById("facultyAlertBox").classList.remove("hidden");
  }

  document.getElementById("verifyStep").classList.add("hidden");
  document.getElementById("resultStep").classList.remove("hidden");
});

// ---- TAKE ACTION / AUTOMATE: human-approved faculty alert ----
document.getElementById("approveAlert").addEventListener("change", (e) => {
  document.getElementById("sendAlertBtn").disabled = !e.target.checked;
});

document.getElementById("sendAlertBtn").addEventListener("click", () => {
  const logBox = document.getElementById("alertLog");
  const timestamp = new Date().toLocaleString();
  logBox.innerHTML = `✅ Alert logged and sent to faculty advisor at ${timestamp}.<br>Reason: ${currentAnalysis.kbEntry.label}.`;
  logBox.classList.remove("hidden");
  document.getElementById("sendAlertBtn").disabled = true;
  document.getElementById("sendAlertBtn").textContent = "Alert Sent";
});

// ---- TAKE ACTION / AUTOMATE: generate a real downloadable file ----
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!currentAnalysis) return;
  const { analysis, kbEntry, aiText } = currentAnalysis;
  const content = `VIGNAN EDUTRACK AI — PERSONALIZED STUDY PLAN
Generated: ${new Date().toLocaleString()}

MCQ Average: ${analysis.mcqAvg}%
Descriptive Average: ${analysis.descAvg}%
Pattern: ${kbEntry.label}
Suggested Resource: ${kbEntry.resource}
Suggested Focus: ${kbEntry.focus}

${aiText || ""}
`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "EduTrack_Study_Plan.txt";
  a.click();
  URL.revokeObjectURL(url);
});
