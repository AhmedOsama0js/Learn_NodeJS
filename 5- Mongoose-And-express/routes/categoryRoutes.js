const express = require("express");
const router = express.Router();

const {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
  uploadImageMiddleware,
} = require("../controllers/categoryController");

const {
  getCategoryValidator,
  DeleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

router.get("/", listRecords);
router.post("/", uploadImageMiddleware, addRecord);
router.get("/:id", getCategoryValidator, findOne);
router.delete("/:id", DeleteCategoryValidator, deleteRecord);
router.put("/:id", uploadImageMiddleware, updateRecord);

module.exports = router;
