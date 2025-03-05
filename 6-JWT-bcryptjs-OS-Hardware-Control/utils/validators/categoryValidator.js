const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/Category");
const AppError = require("../../utils/AppError");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format ⚠️"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format ⚠️"),
  validatorMiddleware,
];

exports.addCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required ⚠️")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters ⚠️")
    .trim()
    .custom(async (value) => {
      const existingCategory = await Category.findOne({ name: value });
      if (existingCategory) {
        throw new AppError("Category name already exists ⚠️", 400);
      }
    }),

  check("image")
    .optional()
    .isString()
    .withMessage("Image URL must be a string ⚠️"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters ⚠️")
    .trim()
    .custom(async (value, { req }) => {
      const existingCategory = await Category.findOne({ name: value });
      if (
        existingCategory &&
        existingCategory._id.toString() !== req.params.id
      ) {
        throw new AppError("Category name already exists ⚠️", 400);
      }
    }),

  check("image")
    .optional()
    .isString()
    .withMessage("Image URL must be a string ⚠️"),

  validatorMiddleware,
];
