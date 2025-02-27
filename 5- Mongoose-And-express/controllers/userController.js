const User = require("../models/User");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// get all user
const listRecords = catchAsync(async (req, res) => {
  const users = await User.find()
    .populate({
      path: "products",
      select: "name price",
    })
    .lean();
  res
    .status(200)
    .json({ message: "Users retrieved successfully ✅", data: users });
});

// find one user
const findOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const findOneUser = await User.findById(id)
    .populate({
      path: "products",
      select: "name price",
    })
    .lean();

  if (!findOneUser) {
    return next(new AppError(`⚠️ User with id ${id} not found`, 404));
  }

  res
    .status(200)
    .json({ message: "✅ User retrieved successfully", data: findOneUser });
});

// add new user
const addRecord = catchAsync(async (req, res, next) => {
  const { name, email, age, password } = req.body;

  if (!name || !email) {
    return next(new AppError("⚠️ Name and email are required", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError(`⚠️ Email (${email}) already exists`, 400));
  }

  const newUser = await User.create({ name, email, age, password });
  res
    .status(201)
    .json({ message: "✅ User added successfully", data: newUser });
});

// delete user
const deleteRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteUser = await User.findByIdAndDelete(id);

  if (!deleteUser) {
    return next(new AppError(`⚠️ User with id ${id} not found`, 404));
  }

  res.status(200).json({ message: "🗑️ User deleted successfully" });
});

// upDate user data
const updateRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedUser) {
    return next(new AppError(`⚠️ User with id ${id} not found`, 404));
  }

  res
    .status(200)
    .json({ message: "✅ User updated successfully", data: updatedUser });
});

module.exports = {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
};
