const { connectRabbitMQ, publishToQueue } = require("../services/Rabbit");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "2h" });
      res.status(200).json({ accessToken });
    } else {
      res.status(401).send("Nom d'utilisateur ou mot de passe incorrect");
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({ username: username });
    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send(`Utilisateur enregistré avec succès: $user`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifValidator = (req, res) => {
  body("username").isString();
  next();
};
