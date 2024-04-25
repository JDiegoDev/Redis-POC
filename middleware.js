const { isRedisWorking, getRedisClient } = require("./redis");

const cachedData = async (req, res, next) => {
  const redisClient = getRedisClient();
  const query = req.params.id || "all";

  try {
    const cacheResults = await redisClient.get(query);

    if (isRedisWorking) {
      if (cacheResults) {
        res.status(200).send({
          fromCache: true,
          data: JSON.parse(cacheResults),
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    console.error(error);
    res.status(404);
  }
};

module.exports = cachedData;
