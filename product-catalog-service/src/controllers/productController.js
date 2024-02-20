const Product = require("../models/Product");
const esClient = require("../config/elaticsearch");
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
    res.json(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send("Produit non trouvé");
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
