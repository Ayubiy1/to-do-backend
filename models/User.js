const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ❌ Hozircha hash qilinmagan
});

module.exports = mongoose.model("User", userSchema);
