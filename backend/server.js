require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const conversionsRoutes = require('./routes/conversions');

app.use('/api/converter', conversionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/conversions', conversionsRoutes);

app.get('/debug/tables', async (req, res) => {
    const { all } = require('./db');
    try {
        res.json({
            profiles: await all('SELECT * FROM users'),
            conversions: await all('SELECT * FROM conversions LIMIT 10'),
            analyses: await all('SELECT * FROM analyses LIMIT 10'),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'AcessiWay Backend rodando!' });
});

app.listen(3001, () => console.log('Backend rodando em https://acessiway-backend.onrender.com'));