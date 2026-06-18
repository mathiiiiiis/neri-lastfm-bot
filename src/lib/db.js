// ==== db ====
// node:sqlite storage mapping nerimiy user id to lastfm username
//
// > users.user_id: primary key (aka nerimiy id)
// > users.lastfm_username: lastfm username
// > users.updated_at: unix ms of last update

const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "neri-lastfm.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL;");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    lastfm_username TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`)

// ==== prepared statements ====

const upsertStmt = db.prepare(`
  INSERT INTO users (user_id, lastfm_username, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET
    lastfm_username = excluded.lastfm_username,
    updated_at = excluded.updated_at;
`);

const selectStmt = db.prepare(
  "SELECT lastfm_username FROM users WHERE user_id = ?;"
);

// ==== api ====
// setUsername stores or replaces a mapping
// getUsername returns stored username or null

function setUsername(userId, username) {
  upsertStmt.run(userId, username, Date.now());
}

function getUsername(userId) {
  const row = selectStmt.get(userId);
  return row ? row.lastfm_username : null;
}

module.exports = { setUsername, getUsername };
