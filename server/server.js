import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

/* =====================================================
   ✅ 1. AI INTERVIEW CHAT ROUTE (Structured + Scored) node server.js
===================================================== */
app.post("/api/chat", async (req, res) => {
  const { messages, role, company, mode } = req.body;

  try {
    // Build conversation text
    let conversationText = "";

    if (!messages || messages.length === 0) {
      conversationText = `
You are an **AI Interview Coach** conducting a professional interview simulation.
Your task is to interview a candidate for the role of "${role}" ${company ? `at ${company}` : ""}.

### 🎯 INTERVIEW RULES
1️⃣ Divide interview into **3 sections**:
   - Technical: 5 questions  
   - Behavioral (HR): 3 questions  
   - Situational: 2 questions  

2️⃣ **Ask only one question at a time.**  
   - Wait for candidate’s answer before continuing.  
   - If candidate says "I don’t know", give a brief correction (2–3 lines max).  

3️⃣ **Feedback Mode** (based on "${mode || "immediate"}"):
   - "immediate" → give short feedback after each answer, then move on.
   - "later" → skip feedback until the final evaluation.

4️⃣ **Response format (MUST be JSON):**
{
  "type": "question" | "feedback" | "final",
  "section": "Technical" | "Behavioral" | "Situational",
  "question": "string (next question or final feedback)",
  "feedback": "string (if mode=immediate)",
  "score": number (0–10),
  "progress": number (0–100),
  "nextAction": "ask_next" | "next_section" | "finish"
}

5️⃣ **Style constraints:**
- Keep answers short (max 3–4 lines).
- No paragraphs, no markdown, no essays.
- Maintain a formal and conversational tone.
- End interview *only* after 10 questions.
`;
    } else {
      conversationText = messages
        .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
        .join("\n");
    }

    // Send to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: conversationText }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Gemini API error" });
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Try parsing valid JSON
    let parsed;
    try {
      parsed = JSON.parse(replyText);
    } catch {
      parsed = { type: "question", question: replyText };
    }

    // Force concise structure fallback
    if (!parsed.question) parsed.question = "Could you clarify your answer?";
    if (!parsed.type) parsed.type = "question";

    res.json(parsed);
  } catch (error) {
    console.error("❌ Interview AI Error:", error);
    res.status(500).json({ error: "Interview server error" });
  }
});



/* =====================================================
   ✅ 2. AI STUDY PLANNER ROUTE (New Feature)
===================================================== */
// ✅ Study Planner Route
// ✅ Study Planner Route (Improved)
app.post("/api/study-plan", async (req, res) => {
  const { skill, hoursPerDay } = req.body;

  console.log(`📘 Generating study plan for ${skill} (${hoursPerDay} hours/day)`);

  try {
    const prompt = `
You are an expert AI study planner.
Create a realistic and detailed ${skill} learning plan for a beginner.
The user can dedicate ${hoursPerDay || 2} hours per day.
The plan should be in JSON format ONLY — no explanations outside JSON.
Each day must include:
  - "day"
  - "topic"
  - "duration"
  - "youtube"
  - "website"

Example JSON output:
[
  {
    "day": "Day 1",
    "topic": "Introduction to ${skill}",
    "duration": "1 hour",
    "youtube": "freeCodeCamp.org ${skill} basics",
    "website": "https://www.w3schools.com/${skill.toLowerCase()}/"
  }
]
Generate around 10 days of structured plan.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📗 Gemini Study Plan Raw:", text);

    // ✅ Try to extract JSON safely
    let studyPlan = [];
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      studyPlan = JSON.parse(jsonMatch[0]);
    } else {
      // If Gemini didn’t give valid JSON, fallback to table-like format
      studyPlan = [
        { day: "Day 1", topic: "Introduction", duration: "1 hour", youtube: "N/A", website: "N/A" },
      ];
    }

    res.json({ studyPlan });
  } catch (error) {
    console.error("❌ Study Plan API Error:", error);
    res.status(500).json({ error: "Failed to generate study plan" });
  }
});

/* =====================================================
   ✅ 3. AI MCQ GENERATOR ROUTE (Improved & Stable)
===================================================== */
app.post("/api/generate-mcq", async (req, res) => {
  const { topic, count } = req.body;

  console.log(`🧩 Generating ${count} MCQs for topic: ${topic}`);

  try {
    const prompt = `
You are an expert MCQ question generator.

Generate exactly ${count || 5} multiple choice questions about "${topic}".

⚙️ Output Requirements:
- Format: Valid JSON array only, no markdown or explanations.
- Each question must strictly follow this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B"  // must match EXACT text from the options array
  }
]

⚠️ Important:
- The "answer" must be one of the values from the "options" array exactly.
- Do NOT use "A", "B", "1", etc. Only the full text (e.g. "Option B").
- Do NOT include any explanations or extra text outside JSON.
- Keep difficulty beginner to intermediate.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📗 Gemini MCQ Raw Output:", text);

    // Extract valid JSON safely
    let mcqs = [];
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      mcqs = JSON.parse(jsonMatch[0]);
    } else {
      mcqs = [
        {
          question: "Example question (Gemini failed to format).",
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: "Option A",
        },
      ];
    }

    res.json({ mcqs });
  } catch (error) {
    console.error("❌ MCQ Generator API Error:", error);
    res.status(500).json({ error: "Failed to generate MCQs" });
  }
});



/* =====================================================
   ✅ HEALTH CHECK
===================================================== */
app.get("/", (req, res) =>
  res.send("AI Tools Hub Backend (Interview + Study Planner) ✅")
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
