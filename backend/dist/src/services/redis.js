import redisPromise from '../config/redisDB.js';
const redis = await redisPromise;
export class redisService {
    static saveData = async (key, value) => {
        await redis.set(key, JSON.stringify(value), { EX: 60 * 10 });
    };
    static getData = async (key) => {
        const data = await redis.get(key);
        return data;
    };
    static deleteData = async (key) => {
        await redis.del(key);
    };
}
