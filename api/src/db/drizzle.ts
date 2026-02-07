import {drizzle} from "drizzle-orm/bun-sqlite";
import Database from "bun:sqlite";
import {todos} from "./schema";

const db = new Database("../data/todos.db");
export const database = drizzle(db);

database.run(
    `CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )`
);

export { todos };
