const mongoose = require("../Database/mongoDatabase");

const messageSchema = new mongoose.Schema({
  name: { type: String },
  msg: { type: String },
});

module.exports = mongoose.model("Message", messageSchema);
