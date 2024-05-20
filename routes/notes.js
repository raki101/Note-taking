const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchnotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description must have minimum of 5 characters "
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send("error occured");
    }
  }
);

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  let note = await Notes.findById(req.params.id);

  if (!note) {
    return res.status(404).send("Not found");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(note);
});

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  let note = await Notes.findById(req.params.id);

  if (!note) {
    return res.status(404).send("Not found");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }

  note = await Notes.findByIdAndDelete(req.params.id);
  res.send({ Success: "file has been successfully deleted ", note: note });
});

module.exports = router;
