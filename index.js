const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const boardRoutes = require("./routes/BoardRoute");
const listRoutes = require("./routes/ListRoute");
const taskRoutes = require("./routes/TaskRoute");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/Auth");

const { register, login } = require("./controllers/authController");
const User = require("./models/User");
const List = require("./models/List");
const Board = require("./models/Board"); // ✅ IMPORT QILINDI

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// API routes
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
// app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);

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

// ✅ Listlarni olish (board name bo‘yicha)
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// MongoDB ulash va serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.error("❌ MongoDB ulanishida xato:", err));

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB ulandi"))
//   .catch((err) => console.error("❌ MongoDB ulanishida xato:", err));

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB ulandi");
//     app.listen(process.env.PORT, () => {
//       console.log(`🚀 Server ${process.env.PORT}-portda ishlayapti`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB ulanishida xato:", err);
//   });
