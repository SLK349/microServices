const Cart = require("../models/Cart");
const { publishToQueue } = require("../services/Rabbit");

exports.getAllCarts = async (req, res) => {
  try {
    res.json(await Cart.find());
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    console.log(cart);
    await cart.save();

    await publishToQueue("orderQueue", cart);

    res.status(201).json(cart);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).send("Produit non trouvé");
    res.json(cart);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) return res.status(404).send("Produit non trouvé");
    res.json(cart);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).send("Produit non trouvé");
    res.status(204).send("Produit supprimé");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
