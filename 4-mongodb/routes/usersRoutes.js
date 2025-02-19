const express = require("express");
const router = express.Router();

const {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
} = require("../controllers/userController");

router.get("/", listRecords);
router.post("/", addRecord);
router.get("/:id", findOne);
router.delete("/:id", deleteRecord);
router.put("/:id", updateRecord);

module.exports = router;
