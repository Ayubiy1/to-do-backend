const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

module.exports = router;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();

// // JWT token yaratish
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

// // 📌 Register
// router.post("/register", async (req, res) => {
//   console.log("Register request received:", req.body);

//   try {
//     const { username, password } = req.body;
//     console.log(username, password); // Debugging uchun

//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Barcha maydonlar to‘ldirilishi kerak" });
//     }

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res
//         .status(400)
//         .json({ message: "Bunday foydalanuvchi allaqachon mavjud" });
//     }

//     const user = await User.create({ username, password });
//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // 📌 Login
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Login yoki parol xato" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
