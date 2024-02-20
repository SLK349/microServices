const express = require("express");
const router = express.Router();
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct } = require("../controllers/productController");

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;


