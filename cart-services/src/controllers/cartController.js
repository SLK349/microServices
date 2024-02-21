const { Product, Cart } = require("../models/Cart");
const { connectRabbitMQ, publishToQueue } = require("../services/Rabbit");

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
    console.log("cart :", cart);
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

exports.getAllProducts = async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).send(err.message);
  }
};

async function consumeProduct() {
  const { channel } = await connectRabbitMQ();
  const queue = "productQueue";

  await channel.assertQueue(queue, { durable: true });
  console.log(`En attente de messages dans ${queue}.`);

  channel.consume(queue, async (msg) => {
    console.log(msg.content.toString());
    if (msg.content) {
      const { _id, stock, price, imageUrl } = JSON.parse(msg.content.toString());
      console.log("Nouvel article reçu :", _id);

      await createOrUpdateProductInCartService(_id, { stock, price, imageUrl });
      channel.ack(msg);
    }
  });
}

async function createOrUpdateProductInCartService(_id, productDetails) {
  let product = await Product.findById(_id);

  if (product) {
    Object.assign(product, productDetails);
  } else {
    product = new Product({ ...productDetails, _id });
  }

  await product.save();
  console.log(`Article mis à jour/créé dans le service panier : ${_id}`);
}

consumeProduct();

async function consumeDeleteProduct() {
  const { channel } = await connectRabbitMQ();
  const queue = "deleteProductQueue";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg.content) {
      const { _id } = JSON.parse(msg.content.toString());
      console.log(`Demande de suppression reçue pour le produit : ${_id}`);

      await deleteProductFromAllCarts(_id);
      channel.ack(msg);
    }
  });
}

async function deleteProductFromAllCarts(_id) {
  try {
    await Product.findByIdAndDelete(_id);
    console.log(`Produit ${_id} supprimé avec succès.`);
  } catch (err) {
    console.error(`Erreur lors de la suppression du produit ${_id} : ${err.message}`);
  }
}

consumeDeleteProduct();



const { connectToQueue, consumeMessage } = require("../services/Rabbit");
const { User } = require("../models/Cart");

async function consumeUser() {
  const { channel } = await connectRabbitMQ();
  const queue = "userCreatedQueue";

  channel.assertQueue(queue, {
    durable: true,
  });

  console.log(`En attente de messages dans ${queue}.`);

  channel.consume(queue, async (message) => {
    const { username } = JSON.parse(message.content.toString());

    const userExists = await User.findOne({ username });
    if (!userExists) {
      await User.create({ username });
      console.log(`Nouvel utilisateur créé dans le service panier: ${username}`);
    }
  })
}

consumeUser();
