const User = require("../models/User");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getUserProducts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const getUser = await User.findById(userId).populate("products");
  if (!getUser) {
    return next(new AppError(`User with id ${userId} not found ⚠️`, 404));
  }

  res.status(200).json({
    message: "Get Products user successfully ✅",
    data: getUser.products,
  });
});

const addProductFromUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;

  const getUser = await User.findById(userId);
  const getProduct = await Product.findById(productId);

  if (!getUser) {
    return next(new AppError(`User with id ${userId} not found ⚠️`, 404));
  }

  if (!getProduct) {
    return next(new AppError(`Product with id ${productId} not found ⚠️`, 404));
  }

  if (!getUser.products.includes(productId)) {
    getUser.products.push(productId);
    await getUser.save();
  } else {
    return next(
      new AppError(
        `Product with id ${productId} already included in this user ⚠️`,
        404
      )
    );
  }

  res.status(200).json({
    message: "Product added to user successfully ✅",
    data: getUser,
  });
});

const deleteProductFromUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;

  const getUser = await User.findById(userId);

  if (!getUser) {
    return next(new AppError(`User with id ${userId} not found ⚠️`, 404));
  }

  if (!getUser.products.includes(productId)) {
    return next(
      new AppError(`Product with id ${productId} is not in user's list ⚠️`, 400)
    );
  }

  getUser.products = getUser.products.filter(
    (id) => id.toString() !== productId
  );
  await getUser.save();

  res.status(200).json({
    message: "Product removed from user successfully ✅",
    data: getUser,
  });
});

module.exports = {
  addProductFromUser,
  deleteProductFromUser,
  getUserProducts,
};
