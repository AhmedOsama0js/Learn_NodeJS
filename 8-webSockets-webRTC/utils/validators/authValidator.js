const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/User");
const AppError = require("../../utils/AppError");

exports.registerValidator = [
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
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new AppError("Email already exists ⚠️");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required ⚠️")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters ⚠️"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required ⚠️")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new AppError("Passwords do not match ⚠️");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required ⚠️")
    .isEmail()
    .withMessage("Invalid email format ⚠️")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Email format is incorrect ⚠️"),

  check("password")
    .notEmpty()
    .withMessage("Password is required ⚠️")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters ⚠️")
    .matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage("Password contains invalid characters ⚠️"),

  validatorMiddleware,
];
