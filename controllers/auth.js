const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed.",
      errorMessages: errors.array(),
    });
  }

  const { email, password, username } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashPassword) => {
      return User.create({
        email,
        password: hashPassword,
        username,
      });
    })
    .then((_) => {
      res.status(201).json({ message: "user created!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "something went wrong!" });
    });
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        errorMessages: errors.array(),
      });
    }

    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return res.status(401).json({ message: "Email is not exists!" });
    }

    const isMatch = bcrypt.compareSync(password, userDoc.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong user credentials!" });
    }

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ token, userId: userDoc._id, user_mail: userDoc.email });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.checkStatus = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const token = authHeader.split("")[1];
  try {
    const tokenMatch = jwt.verify(token, process.env.JWT_KEY);

    if (!tokenMatch) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    req.userId = tokenMatch.userId;
    res.json("ok");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated!" });
  }
};
