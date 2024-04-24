const mongodb = require("mongodb");
const { ObjectId } = mongodb;

const { getConnectedClient } = require("../db");
const { isRedisWorking, getRedisClient } = require("../redis");

const restaurantController = {
  getAllRestaurants: async (req, res, next) => {
    const db = getConnectedClient();
    const redisClient = getRedisClient();

    try {
      const cacheResults = await redisClient.get("all");

      if (cacheResults) {
        res.status(200).send({
          fromCache: true,
          data: JSON.parse(cacheResults),
        });
      } else {
        const allRestaurants = await db.aggregate([{ $limit: 3 }]).toArray();
        await redisClient.set("all", JSON.stringify(allRestaurants));
        res.status(200).send({
          fromCache: false,
          data: allRestaurants,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getRestaurantById: async (req, res) => {
    const db = getConnectedClient();
    const redisClient = getRedisClient();
    const id = req.params.id;

    const restaurant = await db
      .aggregate([{ $match: { _id: new ObjectId(id) } }])
      .toArray();

    if (isRedisWorking) {
      console.log("isRedisWorking");

      await redisClient.set(id, JSON.stringify(restaurant));
    }

    res.status(200).json(restaurant);
  },
};

module.exports = { restaurantController };
