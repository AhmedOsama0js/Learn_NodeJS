const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// get all Product
const listRecords = catchAsync(async (req, res) => {
  const AllProduct = await Product.find()
    .populate({ path: "category", select: "name image" })
    .lean();
  res
    .status(200)
    .json({ message: "✅ Products retrieved successfully", data: AllProduct });
});

// find one Product
const findOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const findOneProducts = await Product.findById(id)
    .populate({ path: "category", select: "name image" })
    .lean();

  if (!findOneProducts) {
    return next(new AppError(`Product with id ${id} not found ⚠️`, 404));
  }

  res.status(200).json({
    message: "Product retrieved successfully ✅",
    data: findOneProducts,
  });
});

// add new Product
const addRecord = catchAsync(async (req, res, next) => {
  const { name, category, stock, price } = req.body;

  if (!name || !category || !stock || !price) {
    return next(
      new AppError("name and category and stock and price are required ⚠️", 400)
    );
  }

  const productExists = await Product.findOne({ name });

  if (productExists) {
    return next(new AppError(`name (${name}) already exists ⚠️`, 400));
  }

  const newProduct = await Product.create({ name, category, stock, price });

  res
    .status(201)
    .json({ message: "Product added successfully ✅", data: newProduct });
});

// delete Product
const deleteRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);

  if (!deleteProduct) {
    return next(new AppError(`Product with id ${id} not found ⚠️`, 404));
  }

  res.status(200).json({ message: "🗑️ Product deleted successfully" });
});

// upDate Product data
const updateRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedProduct) {
    return next(new AppError(`Product with id ${id} not found ⚠️`, 404));
  }

  res.status(200).json({
    message: "Product updated successfully ✅",
    data: updatedProduct,
  });
});

module.exports = {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
};
