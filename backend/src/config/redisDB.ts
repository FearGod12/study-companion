import { RedisClientType, createClient } from 'redis';

async function initializeRedis(redisUrl: string): Promise<RedisClientType> {
  // const client = createClient({ url: redisUrl });
  const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: 12611,
    },
  });

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

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisPromise = await initializeRedis(redisUrl);

export default redisPromise;
