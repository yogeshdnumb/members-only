const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  hash: String,
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("Users", userSchema);
