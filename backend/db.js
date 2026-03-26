const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'accessiway.db');

let db;

async function getDb() {
    if (db) return db;

    const SQL = await initSqlJs();

    // Carrega banco existente ou cria novo
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Cria tabelas
    db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT,
      disability_type         TEXT,
      contrast_mode           TEXT DEFAULT 'normal',
      font_family             TEXT DEFAULT 'default',
      font_size               TEXT DEFAULT 'normal',
      line_spacing            TEXT DEFAULT 'normal',
      reading_guide           INTEGER DEFAULT 0,
      screen_reader_optimized INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (datetime('now')),
      updated_at  TEXT DEFAULT (datetime('now'))
    );

      }