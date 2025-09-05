import { createClient} from 'redis';
import dotenv from 'dotenv';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
        reconnectStrategy: (retires) => {
            if (retires >= 10) {
                return new Error('Too many retires. Redis connection failed.');
            }
            return Math.min(retires * 50, 2000);
        }
    }
})

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connecting to Redis...'));
redisClient.on('ready', () => console.log('✅ Redis client is ready.'));
redisClient.on('reconnecting', () => console.log('Reconnecting to Redis...'));
redisClient.on('end', () => console.log('Redis connection closed.'));

const redisConnect = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

// Gracefull shutdown logic
const gracefullShutdown = async () => {
    console.log('Shuttin down redis client...');
    await redisClient.quit();
    process.exit(0);
};

// Listen for shutdown signals
process.on('SIGINT', gracefullShutdown);
process.on('SIGTERM', gracefullShutdown);

export { redisClient, redisConnect };