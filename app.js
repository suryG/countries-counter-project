const express = require('express');
const path = require('path');
const { client, connectRedis } = require('./src/redisClient');

const app = express();
app.use(express.json());

// 🔹 Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Connect to Redis
connectRedis();

// 🔹 Update statistics
app.post('/stats/:country', async (req, res) => {
    const country = req.params.country.toLowerCase();

    if (country.length !== 2) {
        return res.status(400).json({ error: 'Country code must be 2 letters' });
    }

    try {
        await client.incr(country);
        res.json({ message: 'Visit counted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Redis error' });
    }
});

// 🔹 Retrieve statistics
app.get('/stats', async (req, res) => {
    try {
        const keys = await client.keys('*');
        const values = await Promise.all(keys.map(k => client.get(k)));
        const result = {};
        keys.forEach((k, i) => result[k] = Number(values[i]));
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Redis error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
