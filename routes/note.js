const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const noteController = require("../controllers/note");

const authMiddleware = require("../middlewares/is-auth");

//GET - /notes
router.get("/notes", noteController.getNotes);

//POST - /create
router.post(
  "/create",
  authMiddleware,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title is too short baby!")
      .isLength({ max: 30 })
      .withMessage("Title is too long!"),
    body("content")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Content is too short!"),
  ],
  noteController.createNote
);

//GET - /notes/:id
router.get("/notes/:id", noteController.getNote);

//Delete - /delete/:id
router.delete("/delete/:id", authMiddleware, noteController.deleteNote);

// GET - /edit/:id
router.get("/edit/:id", authMiddleware, noteController.getOldNote);

// POST - /edit
router.post("/edit", authMiddleware, noteController.updateNote);

module.exports = router;
