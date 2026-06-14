const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { run, all } = require('../db');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Histórico
router.get('/history', async (req, res) => {
    try {
        const history = await all(
            'SELECT * FROM conversions ORDER BY created_at DESC LIMIT 50'
        );
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Converter
router.post('/', async (req, res) => {
    try {
        const { text, format } = req.body;

        console.log('Recebido:', { format, textLength: text?.length });

        if (!text) {
            return res.status(400).json({ error: 'Texto obrigatório' });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: 'GROQ_API_KEY não configurada' });
        }

        const prompts = {
            simplified: `Você é um especialista em acessibilidade. Simplifique o texto abaixo para fácil compreensão, usando frases curtas, palavras simples e linguagem direta. Mantenha todas as informações importantes. Responda APENAS com o texto simplificado, sem explicações ou comentários.\n\nTexto:\n${text}`,
            resumo: `Resuma o texto abaixo em português de forma clara e concisa, mantendo os pontos principais. Responda APENAS com o resumo, sem explicações.\n\nTexto:\n${text}`,
            formal: `Reescreva o texto abaixo em linguagem formal e profissional em português. Responda APENAS com o texto reescrito, sem explicações.\n\nTexto:\n${text}`,
        };

        const prompt = prompts[format] || prompts.resumo;

        console.log(`Formato: ${format}`);
        console.log('Chamando Groq...');

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
            temperature: 0.7,
        });

        const output = completion.choices[0]?.message?.content?.trim() || '';

        console.log('Output:', output.slice(0, 100));

        await run(
            'INSERT INTO conversions (format, original, result) VALUES ($1, $2, $3)',
            [format || 'resumo', text, output]
        );

        res.json({
            success: true,
            original: text,
            resultado: output,
            formato: format || 'resumo',
        });

    } catch (err) {
        console.error('ERRO:', err.message);
        res.status(500).json({
            error: 'Erro ao processar texto',
            detalhe: err.message,
        });
    }
});

module.exports = router;