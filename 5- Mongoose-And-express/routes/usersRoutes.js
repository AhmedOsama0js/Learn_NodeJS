const express = require("express");
const router = express.Router();

const {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
} = require("../controllers/userController");

const {
  addProductFromUser,
  getUserProducts,
  deleteProductFromUser,
} = require("../controllers/userProductController");

const {
  getUserValidator,
  DeleteUserValidator,
  updateUserValidator,
  addUserValidator,
} = require("../utils/validators/userValidator");

router.get("/", listRecords);
router.post("/", addUserValidator, addRecord);
router.get("/:id", getUserValidator, findOne);
router.delete("/:id", DeleteUserValidator, deleteRecord);
router.put("/:id", updateUserValidator, updateRecord);

// user & product
router.get("/:userId/product", getUserProducts);
router.post("/:userId/product", addProductFromUser);
router.delete("/:userId/product", deleteProductFromUser);

module.exports = router;
