const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, age } = req.body;

  if (!name || !email) {
    return next(new AppError("Name and email are required ⚠️", 400));
  }

  if (!password) {
    return next(new AppError("Password is required ⚠️", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError(`Email (${email}) already exists ⚠️`, 400));
  }

  const user = await User.create({ name, email, password, age });

  const token = generateToken(user._id);

  res.status(201).json({ user, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required ⚠️", 400));
  }

  const foundUser = await User.findOne({ email });

  if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = generateToken(foundUser._id);

  res.status(200).json({ user: foundUser, token });
});

exports.AuthUser = catchAsync(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new AppError("You are not logged in. Please log in first.", 401)
    );
  }

  const token = authHeader.replace("Bearer ", "");
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(
      new AppError("Invalid or expired token. Please login again.", 401)
    );
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  if (user.passwordChangedAt) {
    const passwordChangedTime = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTime > decoded.iat) {
      return next(new AppError("Token expired. Please login again.", 401));
    }
  }

  req.user = user;
  next();
});

exports.allowedTO = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError(
          `Access Denied! Role '${req.user.role}' is not allowed 🚷.`,
          403
        )
      );
    }
    next();
  });
