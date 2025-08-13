const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    listId: {
      type: String,
      required: true,
    },
    // list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
