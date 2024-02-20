const mongoose = require("mongoose");
const esClient = require("../config/elaticsearch");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: Number,
    category: String,
    imageUrl: String,
  },
  { timestamps: true }
);

productSchema.post("save", function (doc, next) {
  esClient
    .index({
      index: "products",
      id: doc._id.toString(),
      body: doc.toObject(),
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  next();
});

productSchema.post("findOneAndUpdate", async function (doc, next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  esClient
    .index({
      index: "products",
      id: docToUpdate._id.toString(),
      body: docToUpdate.toObject(),
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

productSchema.post("findOneAndDelete", async function (doc, next) {
  esClient
    .delete({
      index: "products",
      id: doc._id.toString(),
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

module.exports = mongoose.model("Product", productSchema);
