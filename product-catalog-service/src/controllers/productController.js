const Product = require("../models/Product");
const esClient = require("../config/elaticsearch");
const { publishToQueue, connectRabbitMQ } = require("../services/Rabbit");

exports.getAllProducts = async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await publishToQueue("productQueue", product);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Produit non trouvé");
    res.json(product);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).send("Produit non trouvé");
    await publishToQueue("productQueue", product);
    res.json(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send("Produit non trouvé");
    await publishToQueue("deleteProductQueue", { _id: product._id.toString() });
    res.status(204).send("Produit supprimé");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await esClient.search({
      index: "products",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["name", "description", "category"],
          },
        },
      },
    });

    res.json(results.body.hits.hits.map((hit) => hit._source));
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

async function updateProductStock() {
  const { channel } = await connectRabbitMQ();
  const queue = "orderQueue";

  channel.assertQueue(queue, {
    durable: true,
  });

  console.log(`En attente de messages dans ${queue}.`);

  channel.consume(queue, async (msg) => {
    if (msg.content) {
      const messageContent = JSON.parse(msg.content.toString());
      console.log(" [x] Reçu :", msg.content.toString());

      messageContent.items.forEach(async (item) => {
        console.log(item);
        const productId = item.product._id;
        const quantityPurchased = item.quantity;

        await updateStock(productId, -quantityPurchased);
      });
      channel.ack(msg);
    }
  });
}

async function updateStock(productId, quantityChange) {
  const product = await Product.findById(productId);
  if (product) {
    product.stock += quantityChange;
    await product.save();
    console.log(`Stock mis à jour pour le produit ${productId}. Nouveau stock: ${product.stock}`);
  } else {
    console.log(`Produit ${productId} non trouvé`);
  }
}

updateProductStock();
