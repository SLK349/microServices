require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");

// Route du crud simple du panier
const cartRoutes = require("./routes/cartRoutes");

app.use(express.json());

const PORT = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à mongo"))
  .catch((err) => console.log(err));

app.use("/cart", cartRoutes);


app.listen(PORT, ()=> {
    console.log(`Serveur en cours d'execution sur le port ${PORT}`);
})