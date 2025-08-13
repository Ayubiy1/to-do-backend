// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // MongoDB User modeli

// 📌 Register (Yangi foydalanuvchi ro‘yxatdan o‘tishi)
exports.register = async (req, res) => {
  console.log("Register request received:", req.body);

  try {
    const { name, email, password } = req.body;

    // 1. Email allaqachon ishlatilganmi?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu email allaqachon ishlatilgan" });
    }

    // 2. Parolni hash qilish (shifrlash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Yangi foydalanuvchini yaratish
    const newUser = new User({
      name,
      // fullName,
      // username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Ro‘yxatdan o‘tish muvaffaqiyatli" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

// 📌 Login (Tizimga kirish)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // 1. Foydalanuvchi mavjudligini tekshirish
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email yoki parol xato" });
    }

    // 2. Parol to‘g‘riligini tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email yoki parol xato" });
    }

    // 3. JWT token yaratish
    const token = jwt.sign(
      { id: user._id }, // token ichidagi ma'lumot
      process.env.JWT_SECRET, // maxfiy kalit
      { expiresIn: "1d" } // 1 kun amal qiladi
    );

    res.json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};
