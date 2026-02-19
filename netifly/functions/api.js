const express = require('express');
const serverless = require('serverless-http');
const { createClient } = require('redis');

const app = express();
const router = express.Router();

app.use(express.json());

const client = createClient({
    url: process.env.REDIS_URL 
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
}

router.post('/stats/:country', async (req, res) => {
    const country = req.params.country.toLowerCase();
    if (country.length !== 2) return res.status(400).json({ error: 'Country code must 2 letters' });

    try {
        await connectRedis();
        await client.incr(country);
        res.json({ message: 'Visit counted' });
    } catch (err) {
        res.status(500).json({ error: 'Redis error' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        await connectRedis();
        const keys = await client.keys('*');
        const result = {};
        for (const key of keys) {
            result[key] = Number(await client.get(key));
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Redis error' });
    }
});

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports.handler = serverless(app);