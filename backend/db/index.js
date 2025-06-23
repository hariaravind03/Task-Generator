const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { pgTable, uuid, text, boolean, timestamp } = require("drizzle-orm/pg-core");
require('dotenv/config');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Optional: max: 10, idleTimeoutMillis: 30000
});

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

const db = drizzle(pool);

module.exports = { pool, db, tasksTable }; 