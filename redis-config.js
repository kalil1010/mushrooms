const { createClient } = require('redis');
const url = process.env.REDIS_URL || 'redis://default:ibUgjVqIjtaOULMVcjcpFMYQHWzChaFo@redis.railway.internal:6379';
const client = createClient({ url });

client.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = client;
