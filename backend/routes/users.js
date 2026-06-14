const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');

// Listar usuários
router.get('/', async (req, res) => {
    try {
        const users = await all(
            'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buscar por ID
router.get('/:id', async (req, res) => {
    try {
        const user = await get(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar
router.put('/atualizar/:id', async (req, res) => {
    try {
        const existing = await get(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        if (!existing) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const {
            name, email, disability_type,
            contrast_mode, font_family, font_size, line_spacing,
            reading_guide, screen_reader_optimized,
        } = req.body;

        await run(`
            UPDATE users SET
                name = $1,
                email = $2,
                disability_type = $3,
                contrast_mode = $4,
                font_family = $5,
                font_size = $6,
                line_spacing = $7,
                reading_guide = $8,
                screen_reader_optimized = $9,
                updated_at = NOW()
            WHERE id = $10
        `, [
            name ?? existing.name,
            email ?? existing.email,
            disability_type ?? existing.disability_type,
            contrast_mode ?? existing.contrast_mode,
            font_family ?? existing.font_family,
            font_size ?? existing.font_size,
            line_spacing ?? existing.line_spacing,
            reading_guide !== undefined ? reading_guide : existing.reading_guide,
            screen_reader_optimized !== undefined ? screen_reader_optimized : existing.screen_reader_optimized,
            req.params.id,
        ]);

        const updated = await get(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;