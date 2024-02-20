require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");

// Route du crud simple du panier
const cartRoutes = require("./routes/cartRoutes");

app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
    res.send('cart services (panier) en fonctionnement');
});

app.listen(PORT, ()=> {
    console.log(`Serveur en cours d'execution sur le port ${PORT}`);
})