const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    reqired: true,
  },
  description: {
    type: String,
    reqired: true,
  },
  tag: {
    type: String,
    reqired: true,
  },
  Date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("notes", NotesSchema);
