const express = require("express");
const router = express.Router();
const { getAllCarts, createCart, getCart, updateCart, deleteCart } = require("../controllers/cartController");

router.get("/", getAllCarts);
router.post("/", createCart);
router.get("/:id", getCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

module.exports = router;