const mongoose = require("../Database/mongoDatabase");

const userSchema = new mongoose.Schema({
  email: { type: String },
  userName: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("User", userSchema);
