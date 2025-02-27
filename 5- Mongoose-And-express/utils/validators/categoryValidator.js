const { check, body } = require("express-validator");
const Category = require("../../models/Category");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const AppError = require("../../utils/AppError");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format ⚠️"),
  validatorMiddleware,
];

exports.DeleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format ⚠️"),
  validatorMiddleware,
];
