const { validationResult } = require("express-validator");
const Note = require("../models/note");

// Get all notes
exports.getNotes = (req, res, next) => {
  Note.find()
    .sort({ createdAt: -1 })
    .then((notes) => {
      res.status(200).json(notes);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    });
};

// Create a new note
exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed.",
      errorMessage: errors.array(),
    });
  }

  Note.create({
    title,
    content,
  })
    .then((note) => {
      res.status(201).json({
        message: "Note created!",
        data: note,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    });
};

// Get a specific note by ID
exports.getNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(note);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    });
};

exports.deleteNote = (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then((_) => {
      return res.status(204).json({
        message: "Note Deleted!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong!",
      });
    });
};

exports.getOldNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(note);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    });
};

exports.updateNote = (req, res, next) => {
  const { note_id, title, content } = req.body;
  Note.findById(note_id)
    .then((note) => {
      note.title = title;
      note.content = content;
      return note.save();
    })
    .then((_) => {
      return res.status(200).json({
        message: "Note updated!!!",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong!" });
    });
};
