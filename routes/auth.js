const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");

//POST /register
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email is already exists!");
          }
        });
      })
      .withMessage("Please enter a valid email!")
      .normalizeEmail(),
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username is too short!")
      .isLength({ max: 30 })
      .withMessage("Username is too long!")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Username is already exists!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password must have at least 4 characters!"),
  ],
  authController.register
);

// POST - /login
router.post(
  "/login",
  [
    body("email")
      .isEmail()

      .withMessage("Please enter a valid email!")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password must have at least 4 characters!"),
  ],
  authController.login
);

module.exports = router;
