require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use((err, _req, res, _next) => {
  console.log(err.stack);
  res.status(500).json({ message: err.message });
});

const userRoutes = require("./routes/User");
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Service d'authentification en fonctionnement");
});

app.listen(PORT, () => {
  console.log("Serveur en cour d'éxécution sur le port :  " + PORT);
});
