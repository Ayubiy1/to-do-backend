const express = require("express");
const Board = require("../models/Board");
const router = express.Router();

// Barcha boardlarni olish
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Boardlarni olishda xatolik", details: err.message });
  }
});

// ID orqli boardni olish
router.get("/:id", async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board topilmadi" });
    }
    res.json(board);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Boardni olishda xatolik", error: error.message });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const board = await Board.findById(req.params.id).populate({
//       path: "lists",
//       populate: { path: "tasks" },
//     });

//     res.json(board);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Taskni olishda xatolik", error: error.message });
//   }
// });

// Board qo'shish
router.post("/", async (req, res) => {
  console.log("Keldi:", req.body);

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Board nomi majburiy!" });
    }

    const newBoard = new Board({ name });
    await newBoard.save();

    res.status(201).json({
      message: "Board muvaffaqiyatli qo'shildi!",
      board: newBoard,
    });
  } catch (error) {
    console.error("Xato:", error);
    res
      .status(500)
      .json({ message: "Boardni qo'shishda xatolik!", error: error.message });
  }
});

// Boardni ID orqali o'zgartirish
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board topilmadi!" });
    }

    res.json({
      message: "Board muvaffaqiyatli yangilandi!",
      board: updatedBoard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Boardni yangilashda xatolik!",
      error: error.message,
    });
  }
});

// Boardni ID orqali o'chirish
router.delete("/:id", async (req, res) => {
  try {
    const deletedBoard = await Board.findByIdAndDelete(req.params.id);

    if (!deletedBoard)
      return res.status(404).json({ error: "Board topilmadi" });

    res.json({ message: "Board o‘chirildi" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Board o‘chirishda xatolik", details: err.message });
  }
});

// // Yangi board yaratish
// router.post("/", async (req, res) => {
//   const board = new Board(req.body);
//   await board.save();
//   res.status(201).json(board);
// });

module.exports = router;
