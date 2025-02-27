const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/uploadFile");

const uploadImageMiddleware = upload.single("image");

// get all Category
const listRecords = catchAsync(async (req, res) => {
  const allCategory = await Category.find().lean();
  res.status(200).json({
    message: " Category retrieved successfully ✅",
    data: allCategory,
  });
});

// find one Category
const findOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const findOneCategory = await Category.findById(id).lean();

  if (!findOneCategory) {
    return next(new AppError(`Category with id ${id} not found ⚠️`, 404));
  }

  res.status(200).json({
    message: "Category retrieved successfully ✅ ",
    data: findOneCategory,
  });
});

// add new Category
const addRecord = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError("⚠️ Name  are required", 400));
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return next(new AppError(`⚠️ name (${name}) already exists`, 400));
  }

  const imagePath = `/uploads/${req.file.filename}`;

  const newCategory = await Category.create({ name, image: imagePath });
  res
    .status(201)
    .json({ message: "Category added successfully ✅", data: newCategory });
});

// delete Category
const deleteRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteCategory = await Category.findByIdAndDelete(id);

  if (!deleteCategory) {
    return next(new AppError(`⚠️ Category with id ${id} not found`, 404));
  }

  res.status(200).json({ message: "🗑️ Category deleted successfully" });
});

// update Category data
const updateRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedCategory) {
    return next(new AppError(`⚠️ Category with id ${id} not found`, 404));
  }

  res.status(200).json({
    message: "✅ Category updated successfully",
    data: updatedCategory,
  });
});

module.exports = {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
  uploadImageMiddleware,
};
