const express = require("express");
const cors = require("cors");
const http = require("http");
require('dotenv/config');

const { client, db } = require("./db");
const tasksRouter = require("./routes/tasks");
const generateTasksRouter = require("./routes/generate-tasks");
const healthRouter = require("./routes/health");

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to Postgres database!");
  } catch (err) {
    console.error("❌ Failed to connect to Postgres database:", err.message);
    process.exit(1);
  }

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/generate-tasks", generateTasksRouter);
  app.use("/api/tasks", tasksRouter);

  const PORT = process.env.PORT || 4000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer(); 