const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketAuth = async (socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) {
      return next(new Error("❌ المستخدم غير موجود في قاعدة البيانات"));
    }
    socket.user = user;
    socket.emit("userId", { userId });
    next();
  } catch (error) {
    return next(new Error("❌ توكن غير صالح أو حدث خطأ في المصادقة"));
  }
};

module.exports = socketAuth;
