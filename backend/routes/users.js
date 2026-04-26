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
            'SELECT * FROM users WHERE id = ?',
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
//Atualizar

router.put('/atualizar/:id', async (req, res) => {
    try {
        const existing = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);

        if (!existing) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const {
            name,
            email,
            disability_type,
            contrast_mode,
            font_family,
            font_size,
            line_spacing,
            reading_guide,
            screen_reader_optimized
        } = req.body;

        await run(`
            UPDATE users SET
                name = ?, email = ?, disability_type = ?,
                contrast_mode = ?, font_family = ?, font_size = ?,
                line_spacing = ?, reading_guide = ?, screen_reader_optimized = ?,
                updated_at = datetime('now')
            WHERE id = ?
        `, [
            name ?? existing.name,
            email ?? existing.email,
            disability_type ?? existing.disability_type,
            contrast_mode ?? existing.contrast_mode,
            font_family ?? existing.font_family,
            font_size ?? existing.font_size,
            line_spacing ?? existing.line_spacing,
            reading_guide !== undefined ? (reading_guide ? 1 : 0) : existing.reading_guide,
            screen_reader_optimized !== undefined ? (screen_reader_optimized ? 1 : 0) : existing.screen_reader_optimized,
            req.params.id
        ]);

        const updated = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);

        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;