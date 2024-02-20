const mongoose = require("mongoose");
const Product = require("../models/Product");
const esClient = require("../config/elaticsearch");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const indexProducts = async () => {
  try {
    const products = await Product.find();
    const body = products.flatMap((doc) => [{ index: { _index: "products", _id: doc._id.toString() } }, doc.toObject()]);
    const { body: bulkResponse } = await esClient.bulk({ refresh: true, operations: body });

    if (bulkResponse.errors) {
      console.log(bulkResponse);
      return;
    }

    console.log(`${products.length} productsindexed in ElasticSearch`);
  } catch (err) {
    console.log("Indexation failed" + err.message);
  } finally {
    mongoose.connection.close();
  }
};

indexProducts();
