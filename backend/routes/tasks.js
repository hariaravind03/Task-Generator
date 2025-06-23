const express = require('express');
const { db, tasksTable } = require('../db');
const { desc, eq, and } = require("drizzle-orm");
const verifyFirebaseToken = require("../middleware/auth");

const router = express.Router();

// Protect all /api/tasks routes
router.use(verifyFirebaseToken);

// Get all tasks for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;
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
router.post('/', async (req, res) => {
  try {
    const { title, category, topic } = req.body;
    const userId = req.user.uid;
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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.uid;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    // Only update if the task belongs to the user
    const [updatedTask] = await db.update(tasksTable)
      .set({ 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    // Only delete if the task belongs to the user
    const [existingTask] = await db
      .select()
      .from(tasksTable)
      .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)));
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    await db.delete(tasksTable).where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)));
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router; 