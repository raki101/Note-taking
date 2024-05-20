const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    reqired: true,
  },
  email: {
    type: String,
    reqired: true,
    unique: true,
  },
  password: {
    type: String,
    reqired: true,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;
