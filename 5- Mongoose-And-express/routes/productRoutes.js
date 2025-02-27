const express = require("express");
const router = express.Router();

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
router.post("/", addProductValidator, addRecord);
router.get("/:id", getProductValidator, findOne);
router.delete("/:id", DeleteProductValidator, deleteRecord);
router.put("/:id", updateProductValidator, updateRecord);

module.exports = router;
