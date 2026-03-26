const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todos
router.get('/', (req, res) => {
  const profiles = db.prepare('SELECT * FROM profiles ORDER BY created_at DESC').all();
  res.json(profiles);
});

// Buscar por ID
router.get('/:id', (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Perfil não encontrado.' });
  res.json(profile);
});

// Criar
router.post('/', (req, res) => {
  const { name, email, disability_type, contrast_mode, font_family, font_size, line_spacing, reading_guide, screen_reader_optimized } = req.body;

  if (!name) return res.status(400).json({ error: 'Nome obrigatório.' });

  const result = db.prepare(`
    INSERT INTO profiles (name, email, disability_type, contrast_mode, font_family, font_size, line_spacing, reading_guide, screen_reader_optimized)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, email, disability_type,
    contrast_mode || 'normal',
    font_family || 'default',
    font_size || 'normal',
    line_spacing || 'normal',
    reading_guide ? 1 : 0,
    screen_reader_optimized ? 1 : 0
  );

  const created = db.prepare('SELECT * FROM profiles WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// Atualizar
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Perfil não encontrado.' });

  const { name, email, disability_type, contrast_mode, font_family, font_size, line_spacing, reading_guide, screen_reader_optimized } = req.body;

  db.prepare(`
    UPDATE profiles SET
      name = ?, email = ?, disability_type = ?,
      contrast_mode = ?, font_family = ?, font_size = ?,
      line_spacing = ?, reading_guide = ?, screen_reader_optimized = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
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
  );

  res.json(db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.params.id));
});

// Deletar
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Perfil não encontrado.' });
  db.prepare('DELETE FROM profiles WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;