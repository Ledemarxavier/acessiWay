const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// =========================
// INICIALIZAR TABELAS
// =========================
async function initTables() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                disability_type TEXT,
                contrast_mode TEXT DEFAULT 'normal',
                font_family TEXT DEFAULT 'default',
                font_size TEXT DEFAULT 'normal',
                line_spacing TEXT DEFAULT 'normal',
                reading_guide BOOLEAN DEFAULT FALSE,
                screen_reader_optimized BOOLEAN DEFAULT FALSE,
                reading_assistant BOOLEAN DEFAULT FALSE,
                automatic_video_captions BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS conversions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                format TEXT NOT NULL,
                original TEXT NOT NULL,
                result TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS analyses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                text_analyzed TEXT NOT NULL,
                readability_score INTEGER,
                wcag_level TEXT,
                issues TEXT,
                suggestions TEXT,
                summary TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Tabelas criadas/verificadas');
    } finally {
        client.release();
    }
}

pool.connect()
    .then(client => {
        console.log('Conectado ao banco PostgreSQL');
        client.release();
        return initTables();
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco:', err.message);
    });

// =========================
// HELPERS
// Usa $1, $2... em vez de ?
// =========================

async function run(sql, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return {
            lastID: result.rows[0]?.id ?? null,
            changes: result.rowCount,
            rows: result.rows,
        };
    } finally {
        client.release();
    }
}

async function get(sql, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return result.rows[0] || null;
    } finally {
        client.release();
    }
}

async function all(sql, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return result.rows;
    } finally {
        client.release();
    }
}

module.exports = { pool, run, get, all };