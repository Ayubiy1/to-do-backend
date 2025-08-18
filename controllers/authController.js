const User = require("../models/User");

// 📌 Register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlar kerak" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Bu email allaqachon mavjud" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Ro‘yxatdan o‘tish muvaffaqiyatli", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// 📌 Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Email yoki parol noto‘g‘ri" });
    }

    // Oddiy login (token yo‘q)
    res.json({ message: "Login muvaffaqiyatli", user });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

module.exports = { registerUser, loginUser };

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// // REGISTER
// exports.register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Bo‘sh maydonlar tekshiruvi
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
//     }

//     // Oldin mavjudligini tekshirish
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Bunday foydalanuvchi allaqachon mavjud" });
//     }

//     const newUser = new User({ username, email, password });
//     await newUser.save();

//     res
//       .status(201)
//       .json({ message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Userni topish
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
//     }

//     // Parolni tekshirish
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Email yoki parol noto'g'ri" });
//     }

//     // Token yaratish
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     res.json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // // controllers/authController.js
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User"); // MongoDB User modeli

// // // 📌 Register (Yangi foydalanuvchi ro‘yxatdan o‘tishi)
// // exports.register = async (req, res) => {
// //   console.log("Register request received:", req.body);

// //   try {
// //     const { name, email, password } = req.body;

// //     // 1. Email allaqachon ishlatilganmi?
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res
// //         .status(400)
// //         .json({ message: "Bu email allaqachon ishlatilgan" });
// //     }

// //     // 2. Parolni hash qilish (shifrlash)
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // 3. Yangi foydalanuvchini yaratish
// //     const newUser = new User({
// //       name,
// //       // fullName,
// //       // username,
// //       email,
// //       password: hashedPassword,
// //     });

// //     await newUser.save();

// //     res.status(201).json({ message: "Ro‘yxatdan o‘tish muvaffaqiyatli" });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server xatosi", error: err.message });
// //   }
// // };

// // // 📌 Login (Tizimga kirish)
// // exports.login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     console.log(req.body);

// //     // 1. Foydalanuvchi mavjudligini tekshirish
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: "Email yoki parol xato" });
// //     }

// //     // 2. Parol to‘g‘riligini tekshirish
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Email yoki parol xato" });
// //     }

// //     // 3. JWT token yaratish
// //     const token = jwt.sign(
// //       { id: user._id }, // token ichidagi ma'lumot
// //       process.env.JWT_SECRET, // maxfiy kalit
// //       { expiresIn: "1d" } // 1 kun amal qiladi
// //     );

// //     res.json({
// //       message: "Tizimga muvaffaqiyatli kirdingiz",
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //       },
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server xatosi", error: err.message });
// //   }
// // };
