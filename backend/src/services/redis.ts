import redisPromise from '../config/redisDB.js';

const redis = await redisPromise;

export class redisService {
  static saveData = async (key: string, value: any): Promise<void> => {
    await redis.set(key, JSON.stringify(value), { EX: 60 * 10 });
  };

  static getData = async (key: string) => {
    const data = await redis.get(key);
    return data;
  };

  static deleteData = async (key: string) => {
    await redis.del(key);
  };
}
