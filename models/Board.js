const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
