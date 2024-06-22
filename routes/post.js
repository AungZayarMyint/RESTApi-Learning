const express = require("express");

const router = express.Router();

const postController = require("../controllers/post");

// GET METHOD - /posts
router.get("/posts", postController.getPosts);

// POST METHOD - /posts
router.post("/posts", postController.createPost);

module.exports = router;
