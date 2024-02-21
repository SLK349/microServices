const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");

router.get('/all', userController.getAllUsers);
router.get("/login", userController.login);
router.get("/register", userController.register);
router.put('/update/:id', userController.updateUser);

module.exports = router;
