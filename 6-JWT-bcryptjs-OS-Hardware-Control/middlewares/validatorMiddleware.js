const { validationResult } = require("express-validator");

const validatorMiddlewareHI = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(404).json({ errors: error.array() });
  }
  next();
};

module.exports = validatorMiddlewareHI;
