const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    imageUrl: { type: String },
    stock: { type: String, required: true },
    price: { type: String, required: true },
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
    user: UserSchema
});


module.exports = mongoose.model('product', ProductSchema)
module.exports = mongoose.model('cartItem', CartItemSchema)
module.exports = mongoose.model('user', UserSchema)
module.exports = mongoose.model('cart', CartSchema)
