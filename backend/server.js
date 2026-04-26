const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

// Uso das rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Debug
app.get('/debug/tables', async (req, res) => {
    const { all } = require('./db');
    res.json({
        profiles: await all('SELECT * FROM users'),
        conversions: await all('SELECT * FROM conversions LIMIT 10'),
        analyses: await all('SELECT * FROM analyses LIMIT 10'),
    });
});

// Rota base
app.get('/', (req, res) => {
    res.json({ status: 'AcessiWay Backend rodando!' });
});

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'));