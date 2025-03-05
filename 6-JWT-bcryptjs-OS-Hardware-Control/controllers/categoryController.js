const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteFile } = require("../middlewares/deleteFile");

// get all Category
exports.listRecords = catchAsync(async (req, res) => {
  const allCategory = await Category.find().lean();
  res.status(200).json({
    message: " Category retrieved successfully ✅",
    data: allCategory,
  });
});

// find one Category
exports.findOne = catchAsync(async (req, res, next) => {
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
exports.addRecord = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError("Name  are required ⚠️", 400));
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return next(new AppError(` name (${name}) already exists ⚠️`, 400));
  }

  const imagePath = `/uploads/categories/${req.body.image}`;

  const newCategory = await Category.create({ name, image: imagePath });
  res
    .status(201)
    .json({ message: "Category added successfully ✅", data: newCategory });
});

// delete Category
exports.deleteRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteCategory = await Category.findById(id);

  if (!deleteCategory) {
    return next(new AppError(`Category with id ${id} not found ⚠️`, 404));
  }

  if (deleteCategory.image) {
    const imagePath = deleteCategory.image;
    deleteFile(imagePath);
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({ message: "Category deleted successfully 🗑️" });
});

// update Category data
exports.updateRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.image) {
    req.body.image = `/uploads/categories/${req.body.image}`;
  }

  const updatedCategory = await Category.findById(id);

  if (!updatedCategory) {
    return next(new AppError(` Category with id ${id} not found ⚠️`, 404));
  }

  if (req.file && updatedCategory.image) {
    const oldImagePath = updatedCategory.image;
    deleteFile(oldImagePath);
  }

  await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: "Category updated successfully ✅",
    data: updatedCategory,
  });
});
