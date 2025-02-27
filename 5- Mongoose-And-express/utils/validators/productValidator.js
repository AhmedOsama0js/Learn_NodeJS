const { check } = require("express-validator");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format ⚠️"),
  validatorMiddleware,
];

exports.DeleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format ⚠️"),
  validatorMiddleware,
];

exports.addProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required ⚠️")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters ⚠️")
    .trim(),

  check("price")
    .notEmpty()
    .withMessage("Price is required ⚠️")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative ⚠️"),

  check("category")
    .notEmpty()
    .withMessage("Category is required ⚠️")
    .isMongoId()
    .withMessage("Invalid category ID ⚠️")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Category not found ⚠️");
      }
    }),

  check("stock")
    .notEmpty()
    .withMessage("Stock is required ⚠️")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative ⚠️"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters ⚠️")
    .trim()
    .custom(async (value, { req }) => {
      if (!value) return true;
      const existingProduct = await Product.findOne({ name: value });
      if (existingProduct && existingProduct._id.toString() !== req.params.id) {
        throw new Error("Product name already exists ⚠️");
      }
    }),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative ⚠️"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID ⚠️")
    .custom(async (value) => {
      if (!value) return true;
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Category not found ⚠️");
      }
    }),

  check("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative ⚠️"),

  validatorMiddleware,
];
