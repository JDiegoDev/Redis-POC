const { MongoClient } = require("mongodb");

const MONGO_URL =
  "mongodb+srv://juandiegogimenez:Sigego_040991@restaurant.fa4rp6f.mongodb.net/?retryWrites=true&w=majority&appName=Restaurant";

let client;

const connect = async () => {
  const clientInst = new MongoClient(MONGO_URL);
  try {
    client = await clientInst.connect();
    console.log("Connected to Db successfully!");

    return client;
  } catch (err) {
    console.log(err);
  }
};

const getConnectedClient = () => client.db("Restaurants").collection("all");

module.exports = { connect, getConnectedClient };
