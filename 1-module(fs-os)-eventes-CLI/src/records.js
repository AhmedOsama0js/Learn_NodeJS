const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const eventEmitter = require("./events");

// get path
const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "records.json");

// the file is exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// read file
const loadRecords = () => {
  try {
    if (!fs.existsSync(dataFile)) return [];
    const dataBuffer = fs.readFileSync(dataFile);
    return JSON.parse(dataBuffer.toString());
  } catch (error) {
    return [];
  }
};

// save records
const saveRecords = (records) => {
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
};

//  add new records
const addRecord = (name, age) => {
  const records = loadRecords();
  const duplicate = records.find((record) => record.name === name);

  if (duplicate) {
    console.log(chalk.yellow(`name is (${name}) already exists ⚠️`));
    return;
  }
  const newRecord = { name, age };
  records.push(newRecord);
  saveRecords(records);
  eventEmitter.emit("recordAdded", newRecord);
};

// get all records
const listRecords = () => {
  const records = loadRecords();
  console.log(chalk.blue("all Records📜"));
  records.forEach((record, index) => {
    console.log(
      chalk.gray(`${index + 1}. name: ${record.name} - age: ${record.age}`)
    );
  });
  eventEmitter.emit("recordsListed", records);
};

//  delete record
const deleteRecord = (name) => {
  let records = loadRecords();
  const newRecords = records.filter((record) => record.name !== name);

  if (records.length === newRecords.length) {
    console.log(chalk.yellow("no record for this name ⚠️"));
    return;
  }

  saveRecords(newRecords);
  eventEmitter.emit("recordDeleted", name);
};

// update record
const updateRecord = (name, age) => {
  const records = loadRecords();
  const recordIndex = records.findIndex((record) => record.name === name);
  if (recordIndex === -1) {
    console.log(chalk.yellow(`name (${name}) is not exist ⚠️`));
    return;
  }

  records[recordIndex].name = name;
  records[recordIndex].age = age;

  saveRecords(records);

  eventEmitter.emit("recordUpdated", records[recordIndex]);
};

const searchRecord = (name) => {
  const records = loadRecords();
  const recordName = records.find((record) => record.name === name);

  if (recordName === undefined) {
    console.log(chalk.yellow(`name (${name}) is not exist ⚠️`));
    return;
  }
  eventEmitter.emit("recordSearch", recordName);
};

module.exports = {
  listRecords,
  addRecord,
  deleteRecord,
  updateRecord,
  searchRecord,
};
