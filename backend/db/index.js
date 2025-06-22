const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
const { pgTable, uuid, text, boolean, timestamp } = require("drizzle-orm/pg-core");
require('dotenv/config');

const client = new Client({
  connectionString: process.env.DATABASE_URL
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

const db = drizzle(client);

module.exports = { client, db, tasksTable }; 