const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv/config");

const router = express.Router();

// ✅ Initialize Gemini API client with your key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // ✅ FIX 1: Use correct and currently supported model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt stays the same
    const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting. Each task should be on a new line and be specific and actionable.`;

    // ✅ FIX 2: Use latest SDK's generateContent call pattern
    const result = await model.generateContent(prompt);

    // ✅ FIX 3: Get text output directly (no need for `await result.response`)
    const text = result.response.text();

    // Process tasks
    const tasks = text
      .split("\n")
      .map((task) => task.trim())
      .filter((task) => task.length > 0)
      .slice(0, 5);

    res.json({ tasks });
  } catch (error) {
    console.error("Error generating tasks:", error);
    res.status(500).json({ error: "Failed to generate tasks" });
  }
});

module.exports = router;
