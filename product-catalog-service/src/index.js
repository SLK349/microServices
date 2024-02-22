require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/ProductRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à mongo"))
  .catch((err) => console.log(err));

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log("Service product catalog run on port " + PORT);
});
