const mongodb = require("mongodb");
const { ObjectId } = mongodb;

const { getConnectedClient } = require("../db");
const { getRedisClient } = require("../redis");

const restaurantController = {
  getAllRestaurants: async (req, res, next) => {
    const db = getConnectedClient();
    const redisClient = getRedisClient();

    try {
      //const allRestaurants = await db.aggregate([{}]).toArray();
      const allRestaurants = await db.find({}).toArray();
      await redisClient.set("all", JSON.stringify(allRestaurants));

      res.status(200).send({
        fromCache: false,
        data: allRestaurants,
      });
    } catch (err) {
      console.log(err);
      res.status(404);
    }
  },

  getRestaurantById: async (req, res) => {
    const db = getConnectedClient();
    const redisClient = getRedisClient();
    const id = req.params.id;

    try {
      const restaurant = await db
        .aggregate([{ $match: { _id: new ObjectId(id) } }])
        .toArray();

      await redisClient.set(`${id}`, JSON.stringify(restaurant));

      res.status(200).send({
        fromCache: false,
        data: restaurant,
      });
    } catch (err) {
      console.log(err);
      res.status(404);
    }
  },
};

module.exports = { restaurantController };
