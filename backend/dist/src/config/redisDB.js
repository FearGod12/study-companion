import { createClient } from "redis";
async function initializeRedis(redisUrl) {
    const client = createClient({ url: redisUrl });
    return new Promise((resolve, reject) => {
        client.on("connect", () => {
            console.log("Redis client connected");
            resolve(client);
        });
        client.on("error", (err) => {
            console.log("Something went wrong while connecting to Redis: " + err);
            reject(err);
        });
        client.connect();
    });
}
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisPromise = await initializeRedis(redisUrl);
export default redisPromise;
