const fs = require("fs");
const path = require("path");
const AppError = require("./AppError");

// path files
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "records.json");

// file is exist ?
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// loading data records
const loadRecords = () => {
  try {
    if (!fs.existsSync(dataFile)) return [];
    const dataBuffer = fs.readFileSync(dataFile);
    return JSON.parse(dataBuffer.toString());
  } catch {
    return [];
  }
};

// save data records
const saveRecords = (records) => {
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
};

// get all user
const listRecords = (req, res) => {
  const records = loadRecords();
  res
    .status(200)
    .json({ message: "✅ Users retrieved successfully", data: records });
};

// find one user
const findOne = (req, res, next) => {
  const records = loadRecords();
  const { id } = req.params;
  const record = records.find((r) => r.id === +id);

  if (!record)
    return next(new AppError(`⚠️ User with id ${id} not found`, 404));

  res
    .status(200)
    .json({ message: "✅ User retrieved successfully", data: record });
};

// add new user
const addRecord = (req, res, next) => {
  const records = loadRecords();
  const { name } = req.body;

  if (!name) return next(new AppError("⚠️ Name is required", 400));

  if (records.some((record) => record.name === name)) {
    return next(new AppError(`⚠️ Name (${name}) already exists`, 400));
  }

  const newRecord = { id: Date.now(), ...req.body };
  records.push(newRecord);

  try {
    saveRecords(records);
    res
      .status(201)
      .json({ message: "✅ User added successfully", data: newRecord });
  } catch (error) {
    next(new AppError("❌ Failed to save record", 500));
  }
};

// delete user
const deleteRecord = (req, res, next) => {
  let records = loadRecords();
  const { id } = req.params;

  const recordIndex = records.findIndex((r) => r.id === +id);
  if (recordIndex === -1)
    return next(new AppError(`⚠️ User with id ${id} not found`, 404));

  records.splice(recordIndex, 1);

  try {
    saveRecords(records);
    res.status(200).json({ message: "🗑️ User deleted successfully" });
  } catch (error) {
    next(new AppError("❌ Failed to delete user", 500));
  }
};

// upDate user data
const updateRecord = (req, res, next) => {
  const records = loadRecords();
  const { id } = req.params;

  const recordIndex = records.findIndex((r) => r.id === +id);
  if (recordIndex === -1)
    return next(new AppError(`⚠️ User with id ${id} not found`, 404));

  records[recordIndex] = { ...records[recordIndex], ...req.body };

  try {
    saveRecords(records);
    res.status(200).json({
      message: "✅ User updated successfully",
      data: records[recordIndex],
    });
  } catch (error) {
    next(new AppError("❌ Failed to update user", 500));
  }
};

module.exports = {
  listRecords,
  findOne,
  addRecord,
  deleteRecord,
  updateRecord,
};
