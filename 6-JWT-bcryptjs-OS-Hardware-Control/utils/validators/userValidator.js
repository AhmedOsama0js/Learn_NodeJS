const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const AppError = require("../../utils/AppError");
const User = require("../../models/User");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format ⚠️"),
  validatorMiddleware,
];

exports.DeleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format ⚠️"),
  validatorMiddleware,
];

exports.addUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required ⚠️")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters ⚠️")
    .trim(),

  check("email")
    .notEmpty()
    .withMessage("Email is required ⚠️")
    .isEmail()
    .withMessage("Invalid email format ⚠️")
    .trim()
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required ⚠️")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters ⚠️"),

  check("age")
    .optional()
    .isNumeric()
    .withMessage("Age must be a number ⚠️")
    .isInt({ min: 18 })
    .withMessage("Age must be at least 18 ⚠️"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters ⚠️")
    .trim(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format ⚠️")
    .trim()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        throw new AppError("Email already in use ⚠️", 400);
      }
    }),

  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters ⚠️"),

  check("age")
    .optional()
    .isNumeric()
    .withMessage("Age must be a number ⚠️")
    .isInt({ min: 18 })
    .withMessage("Age must be at least 18 ⚠️"),

  validatorMiddleware,
];
