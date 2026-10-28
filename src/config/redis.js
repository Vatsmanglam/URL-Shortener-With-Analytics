
const { createClient } = require("redis");

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                return new Error("Redis reconnection limit reached");
            }

            return Math.min(retries * 500, 3000);
        },
    },
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error.message);
});

const connectRedis = async () => {
    if (redisClient.isOpen) {
        return;
    }

    await redisClient.connect();
    console.log("✅ Redis Connected");
};

module.exports = {
    redisClient,
    connectRedis,
};
