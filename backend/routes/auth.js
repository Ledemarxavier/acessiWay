const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, get } = require('../db');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'accessiway_secret';

// Registrar
router.post('/register', async (req, res) => {
    const {
        email,
        password,
        name,
        disability_type,
        contrast_mode,
        font_family,
        font_size,
        line_spacing,
        reading_guide,
        screen_reader_optimized
    } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await run(`
            INSERT INTO users (
                email, password, name,
                disability_type, contrast_mode, font_family,
                font_size, line_spacing, reading_guide, screen_reader_optimized
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            email,
            hashedPassword,
            name,
            disability_type || null,
            contrast_mode || 'normal',
            font_family || 'default',
            font_size || 'normal',
            line_spacing || 'normal',
            reading_guide ? 1 : 0,
            screen_reader_optimized ? 1 : 0
        ]);

        const user = await get(
            'SELECT * FROM users WHERE id = ?',
            [result.lastID]
        );

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.json({ token, user });

    } catch (err) {
        if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        res.status(500).json({ error: err.message });
    }
});
// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const user = await get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Verificar token
router.get('/verify', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await get('SELECT id, email, name FROM users WHERE id = ?', [decoded.userId]);

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
});

module.exports = router;