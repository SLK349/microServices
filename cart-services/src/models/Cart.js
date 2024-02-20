const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  imageUrl: { type: String },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
});

const CartItemSchema = new mongoose.Schema({
  product: ProductSchema,
  quantity: { type: Number },
  price: { type: Number },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const CartSchema = new mongoose.Schema({
  totalCost: Number,
  items: [CartItemSchema],
  user: UserSchema,
});

module.exports = {
  Product: mongoose.model("Product", ProductSchema),
  CartItem: mongoose.model("CartItem", CartItemSchema),
  User: mongoose.model("User", UserSchema),
  Cart: mongoose.model("Cart", CartSchema),
};
