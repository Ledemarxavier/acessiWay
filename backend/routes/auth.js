const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, get } = require('../db');

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'accessiway_secret';

// =========================
// REGISTRAR
// =========================
router.post('/register', async (req, res) => {

    const {
        email, password, confirmPassword, name,
        disability_type,
        contrast_mode, font_family, font_size, line_spacing,
        reading_guide, screen_reader_optimized,
        reading_assistant, automatic_video_captions,
    } = req.body;

    if (!email || !password || !confirmPassword || !name) {
        return res.status(400).json({
            error: 'Email, senha, confirmação de senha e nome são obrigatórios'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    try {

        const existingUser = await get(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await run(`
            INSERT INTO users (
                email, password, name, disability_type,
                contrast_mode, font_family, font_size, line_spacing,
                reading_guide, screen_reader_optimized,
                reading_assistant, automatic_video_captions
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
        `, [
            email,
            hashedPassword,
            name,
            disability_type || null,
            contrast_mode || 'normal',
            font_family || 'default',
            font_size || 'normal',
            line_spacing || 'normal',
            reading_guide ? true : false,
            screen_reader_optimized ? true : false,
            reading_assistant ? true : false,
            automatic_video_captions ? true : false,
        ]);

        const newId = result.rows[0].id;

        const user = await get(`
            SELECT
                id, email, name, disability_type,
                contrast_mode, font_family, font_size, line_spacing,
                reading_guide, screen_reader_optimized,
                reading_assistant, automatic_video_captions
            FROM users WHERE id = $1
        `, [newId]);

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.json({ token, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =========================
// LOGIN
// =========================
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {

        const user = await get(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                disability_type: user.disability_type,
                contrast_mode: user.contrast_mode,
                font_family: user.font_family,
                font_size: user.font_size,
                line_spacing: user.line_spacing,
                reading_guide: user.reading_guide,
                screen_reader_optimized: user.screen_reader_optimized,
                reading_assistant: user.reading_assistant,
                automatic_video_captions: user.automatic_video_captions,
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =========================
// VERIFY TOKEN
// =========================
router.get('/verify', async (req, res) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {

        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await get(`
            SELECT
                id, email, name, disability_type,
                contrast_mode, font_family, font_size, line_spacing,
                reading_guide, screen_reader_optimized,
                reading_assistant, automatic_video_captions
            FROM users WHERE id = $1
        `, [decoded.userId]);

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        res.json({ user });

    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Token inválido' });
    }
});

module.exports = router;