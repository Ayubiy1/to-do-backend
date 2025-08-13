// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "Token mavjud emas" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // foydalanuvchi ma’lumotlarini saqlash
    next();
  } catch (err) {
    res.status(401).json({ message: "Token yaroqsiz" });
  }
};
