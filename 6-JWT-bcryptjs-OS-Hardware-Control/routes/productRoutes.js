const express = require("express");
const router = express.Router();
const { uploadSignalImage, resizeImg } = require("../middlewares/uploadFile");
const { AuthUser, allowedTO } = require("../controllers/authController");

const {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
} = require("../controllers/productController");

const {
  DeleteProductValidator,
  getProductValidator,
  addProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidator");

router.get("/", listRecords);
router.get("/:id", getProductValidator, findOne);
router.post(
  "/",
  AuthUser,
  allowedTO("admin"),
  uploadSignalImage("image"),
  addProductValidator,
  resizeImg("Products"),
  addRecord
);
router.delete(
  "/:id",
  AuthUser,
  allowedTO("admin"),
  DeleteProductValidator,
  deleteRecord
);
router.put(
  "/:id",
  AuthUser,
  allowedTO("admin"),
  uploadSignalImage("image"),
  updateProductValidator,
  resizeImg("Products"),
  updateRecord
);

module.exports = router;
