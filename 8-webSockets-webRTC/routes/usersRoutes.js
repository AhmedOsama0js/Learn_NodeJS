const express = require("express");
const router = express.Router();

const { AuthUser, allowedTO } = require("../controllers/authController");
const {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
} = require("../controllers/userController");

const {
  getUserValidator,
  DeleteUserValidator,
  updateUserValidator,
  addUserValidator,
} = require("../utils/validators/userValidator");

// User Routes
router.post("/", AuthUser, allowedTO("admin"), addUserValidator, addRecord);
router.get("/", AuthUser, allowedTO("admin"), listRecords);
router.get("/:id", getUserValidator, findOne);
router.put("/:id", AuthUser, updateUserValidator, updateRecord);
router.delete(
  "/:id",
  AuthUser,
  allowedTO("admin"),
  DeleteUserValidator,
  deleteRecord
);

module.exports = router;
