const express = require("express");
const cors = require("cors");
const http = require("http");
require('dotenv/config');

const { pool, db } = require("./db");
const tasksRouter = require("./routes/tasks");
const generateTasksRouter = require("./routes/generate-tasks");
const healthRouter = require("./routes/health");
const docsRouter = require("./routes/docs");

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function startServer() {
  try {
    console.log("✅ Ready to connect to Postgres database!");
  } catch (err) {
    console.error("❌ Failed to connect to Postgres database:", err.message);
    process.exit(1);
  }

  pool.on('error', (err) => {
    console.error('Unexpected error on idle Postgres client', err);
    // Optionally: process.exit(-1);
  });

  const app = express();

  // Allow only the deployed frontend origin for CORS
  const corsOptions = {
    origin: ["https://task-generator-rho.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/generate-tasks", generateTasksRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/docs", docsRouter);

  // Express error-handling middleware (should be after all routes)
  app.use((err, req, res, next) => {
    console.error('Express error handler:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 4000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer(); 