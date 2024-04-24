const { createClient } = require("redis");

let redisClient;

const initializeRedisClient = async () => {
  // read the Redis connection URL from the envs
  redisClient = createClient({
    password: "VyVtfXbgEr7zLrP5yBrBgOlKj4n7ASJE",
    socket: {
      host: "redis-12190.c62.us-east-1-4.ec2.redns.redis-cloud.com",
      port: 12190,
    },
  });

  try {
    // connect to the Redis server
    await redisClient.connect();
    console.log(`Connected to Redis successfully!`);
    return redisClient;
  } catch (e) {
    console.error(`Connection to Redis failed with error:`);
    console.error(e);
  }
};

const getRedisClient = () => redisClient;

const isRedisWorking = () => {
  // verify whether there is an active connection
  // to a Redis server or not
  return !!redisClient?.isOpen;
};

const writeData = async (key, data, options) => {
  if (isRedisWorking()) {
    try {
      await redisClient.set(key, data, options);
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e);
    }
  }
};

const readData = async (key) => {
  let cachedValue = undefined;

  if (isRedisWorking()) {
    cachedValue = await redisClient.get(key);
    if (cachedValue) {
      return cachedValue;
    }
  }
};

module.exports = {
  initializeRedisClient,
  isRedisWorking,
  readData,
  writeData,
  getRedisClient,
};
