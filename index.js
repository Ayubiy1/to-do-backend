const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const boardRoutes = require("./routes/BoardRoute");
const listRoutes = require("./routes/ListRoute");
const taskRoutes = require("./routes/TaskRoute");
const { register, login } = require("./controllers/authController");
const User = require("./models/User");
const List = require("./models/List");

dotenv.config();

const app = express();

// ✅ CORS sozlamalari (frontend manzili bilan)
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// ✅ JSON parser
app.use(express.json());

// Auth routes
app.post("/api/register", register);
app.post("/api/login", login);

// API routes
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Users API (barcha foydalanuvchilarni olish)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatosi" });
  }
});

// ✅ Test route
app.get("/api/boards", (req, res) => {
  res.json([{ id: 1, name: "Board 1" }]);
});

// backend (Node.js + Mongoose misol)
app.get("/api/lists", async (req, res) => {
  const { board } = req.query;
  const lists = await List.find(board ? { board } : {});
  res.json(lists);
});

app.get("/api/lists", async (req, res) => {
  try {
    const { boardName } = req.query;

    if (!boardName) {
      return res
        .status(400)
        .json({ message: "boardName queryda berilishi kerak" });
    }

    // 1. Board nomidan _id olish
    const board = await Board.findOne({ name: boardName });
    if (!board) {
      return res.status(404).json({ message: "Bunday nomli board topilmadi" });
    }

    // 2. Shu _id bo‘yicha listlarni olish
    const lists = await List.find({ boardId: board._id });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MongoDB ulash va serverni ishga tushirish
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB ulandi");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server ${process.env.PORT}-portda ishlayapti`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB ulanishida xato:", err);
  });
