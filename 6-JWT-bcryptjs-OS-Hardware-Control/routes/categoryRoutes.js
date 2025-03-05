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
} = require("../controllers/categoryController");

const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  addCategoryValidator,
} = require("../utils/validators/categoryValidator");

router.get("/", listRecords);
router.post(
  "/",
  AuthUser,
  allowedTO("admin"),
  uploadSignalImage("image"),
  addCategoryValidator,
  resizeImg("categories"),
  addRecord
);
router.get("/:id", getCategoryValidator, findOne);
router.delete(
  "/:id",
  AuthUser,
  allowedTO("admin"),
  deleteCategoryValidator,
  deleteRecord
);
router.put(
  "/:id",
  AuthUser,
  allowedTO("admin"),
  uploadSignalImage("image"),
  updateCategoryValidator,
  resizeImg("categories"),
  updateRecord
);

module.exports = router;
