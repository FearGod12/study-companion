import { RedisClientType, createClient } from 'redis';

async function initializeRedis(): Promise<RedisClientType> {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const client = createClient({ url: redisUrl });

  return new Promise((resolve, reject) => {
    client.on('connect', () => {
      console.log('Redis client connected');
      resolve(client as RedisClientType);
    });

    client.on('error', (err: any) => {
      console.log('Something went wrong while connecting to Redis: ' + err);
      reject(err);
    });

    client.connect();
  });
}

const redisPromise = await initializeRedis();

export default redisPromise;
