const express = require("express");
const db = require("./db");
const app = express();
const { restaurantController } = require("./controllers/restaurant-controller");
const { initializeRedisClient } = require("./redis");
const cachedData = require("./middleware");

const connectRedis = async () => {
  await initializeRedisClient();
};

const connectDb = async () => {
  await db.connect();
  connectRedis();

  app.get(
    "/api/v1/restaurants",
    cachedData,
    restaurantController.getAllRestaurants
  );
  app.get(
    "/api/v1/restaurants/:id",
    cachedData,
    restaurantController.getRestaurantById
  );
};

connectDb();

const port = 3000;
app.listen(port, () => {
  console.log(`App listen in port ${port}`);
});
