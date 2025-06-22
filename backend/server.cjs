const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
const { pgTable, uuid, text, boolean, timestamp } = require("drizzle-orm/pg-core");
const http = require("http");
const { desc, eq } = require("drizzle-orm");
require('dotenv/config');

// Drizzle ORM setup
const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/taskmanager"
});

// Define tasks table to match SQL schema
const tasksTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false),
  category: text("category").default("General"),
  topic: text("topic").default("").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to Postgres database!");
  } catch (err) {
    console.error("❌ Failed to connect to Postgres database:", err.message);
    process.exit(1);
  }
  const db = drizzle(client);

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "Backend is running!" });
  });

  // Gemini Task Generation Endpoint
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  app.post("/api/generate-tasks", async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) return res.status(400).json({ error: "Topic is required" });
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
      const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting. Each task should be on a new line and be specific and actionable.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
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

  // Get all tasks
  // Get all tasks for a user
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = req.query.userId;
      
      // Validate required fields
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const allTasks = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.userId, userId))
        .orderBy(desc(tasksTable.createdAt));
      
      res.json({ tasks: allTasks, success: true });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Add a new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const { title, category, topic, userId } = req.body;
      
      // Validate required fields
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Task title is required" });
      }
      
      const [task] = await db.insert(tasksTable).values({
        title: title.trim(),
        category: category || "General",
        topic: topic || "",
        completed: false,
        userId,
      }).returning();
      
      res.json({ task, success: true });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // Update a task
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Validate required fields
      if (!id) {
        return res.status(400).json({ error: "Task ID is required" });
      }
      
      // Update the task and return the updated data
      const [updatedTask] = await db.update(tasksTable)
        .set({ 
          ...updates, 
          updatedAt: new Date() 
        })
        .where(eq(tasksTable.id, id))
        .returning();
      
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json({ task: updatedTask, success: true });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // Delete a task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate required fields
      if (!id) {
        return res.status(400).json({ error: "Task ID is required" });
      }
      
      // Check if task exists before deleting
      const [existingTask] = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, id));
      
      if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      await db.delete(tasksTable).where(eq(tasksTable.id, id));
      res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  const PORT = process.env.PORT || 4000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer(); 