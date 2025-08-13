const express = require("express");
const router = express.Router();
const List = require("../models/List");
const Board = require("../models/Board");

// CREATE - yangi list yaratish
router.post("/", async (req, res) => {
  try {
    const { name, boardId } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({ message: "List nomi va boardId majburiy" });
    }

    // Board mavjudligini tekshirish
    const boardExists = await Board.exists({ _id: boardId });
    if (!boardExists) {
      return res.status(404).json({ message: "Board topilmadi" });
    }

    const newList = new List({ name, boardId });
    const savedList = await newList.save();

    res.status(201).json({
      message: "List muvaffaqiyatli yaratildi",
      list: savedList,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "List qo'shishda xatolik", error: error.message });
  }
});

// READ - barcha listlarni olish
router.get("/", async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Listlarni olishda xatolik", error: error.message });
  }
});

// READ - bitta listni id bo'yicha olish
router.get("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "List topilmadi" });
    }
    res.json(list);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Listni olishda xatolik", error: error.message });
  }
});

// UPDATE - listni yangilash
router.put("/:id", async (req, res) => {
  try {
    const { name, boardId } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({ message: "List nomi va boardId majburiy" });
    }

    // Board mavjudligini tekshirish
    const boardExists = await Board.exists({ _id: boardId });
    if (!boardExists) {
      return res.status(404).json({ message: "Board topilmadi" });
    }

    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      { name, boardId },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List topilmadi" });
    }

    res.json({
      message: "List muvaffaqiyatli yangilandi",
      list: updatedList,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "List yangilashda xatolik", error: error.message });
  }
});

// DELETE - listni o'chirish
router.delete("/:id", async (req, res) => {
  try {
    const deletedList = await List.findByIdAndDelete(req.params.id);
    if (!deletedList) {
      return res.status(404).json({ message: "List topilmadi" });
    }
    res.json({ message: "List muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "List o‘chirishda xatolik", error: error.message });
  }
});

// GET lists by board name
router.get("/:name", async (req, res) => {
  console.log("Fetching lists for board:", req.params.name);

  try {
    // 1. Board ni nomi bo‘yicha topamiz
    const board = await Board.findOne({ name: req.params.name });
    console.log("Board:", board);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // 2. Board ID orqali listlarni topamiz
    const lists = await List.find({ boardId: board._id });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
