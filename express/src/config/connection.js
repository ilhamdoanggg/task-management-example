const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('src/database/database.db', (err) => {
  if (err) {
    console.error('Error while opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER NOT NULL DEFAULT 0
)`);

module.exports = db;
