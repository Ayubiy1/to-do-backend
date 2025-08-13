const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const List = require("../models/List"); // List mavjudligini tekshirish uchun

// 1️⃣ GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("listId");
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Tasksni olishda xatolik", error: error.message });
  }
});

// 2️⃣ GET task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("listId");
    if (!task) {
      return res.status(404).json({ message: "Task topilmadi" });
    }
    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Taskni olishda xatolik", error: error.message });
  }
});

// 3️⃣ POST (create) task
router.post("/", async (req, res) => {
  try {
    const { name, description, listId } = req.body;

    if (!name || !listId) {
      return res.status(400).json({ message: "Task nomi va listId majburiy" });
    }

    // List mavjudligini tekshirish
    const listExists = await List.exists({ _id: listId });
    if (!listExists) {
      return res.status(404).json({ message: "List topilmadi" });
    }

    const newTask = new Task({
      name,
      description,
      listId,
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      message: "Task muvaffaqiyatli yaratildi",
      task: savedTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Task yaratishda xatolik", error: error.message });
  }
});

// 4️⃣ PUT (update) task
router.put("/:id", async (req, res) => {
  try {
    const { name, description, listId } = req.body;

    // Agar listId bo‘lsa, uni tekshirish
    if (listId) {
      const listExists = await List.exists({ _id: listId });
      if (!listExists) {
        return res.status(404).json({ message: "List topilmadi" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, listId },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task topilmadi" });
    }

    res.json({
      message: "Task muvaffaqiyatli yangilandi",
      task: updatedTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Task yangilashda xatolik", error: error.message });
  }
});

// 5️⃣ DELETE task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task topilmadi" });
    }

    res.json({ message: "Task muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Task o‘chirishda xatolik", error: error.message });
  }
});

module.exports = router;
