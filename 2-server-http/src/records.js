const fs = require("fs");
const path = require("path");
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
  } catch {
    return [];
  }
};

// save records
const saveRecords = (record) => {
  fs.writeFileSync(dataFile, JSON.stringify(record, null, 2));
};

// get all records
const listRecords = (res) => {
  const records = loadRecords();
  eventEmitter.emit("recordsListed", records);
  res.statusCode = 200;
  res.end(
    JSON.stringify({ message: "get all users successful ✅", data: records })
  );
};

// find one record
const findOne = (id, res) => {
  const records = loadRecords();
  const findRecord = records.find((record) => record.id === id);

  if (findRecord === undefined) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: ` id ${id} is not exists ⚠️` }));
    return;
  }
  eventEmitter.emit("recordSearch", findRecord);
  res.statusCode = 200;
  res.end(
    JSON.stringify({ message: "get user successful ✅", data: findRecord })
  );
};

// add record
const addRecord = (data, res) => {
  const records = loadRecords();
  const id = Date.now();
  const duplicate = records.find((record) => record.name === data.name);
  if (duplicate) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({ message: ` name (${data.name}) is already exists ⚠️` })
    );
    return;
  }
  records.push({ id, ...data });
  saveRecords(records);
  eventEmitter.emit("recordAdded", data);
  res.statusCode = 200;
  res.end(
    JSON.stringify({ message: " New user created ✅", data: { id, ...data } })
  );
};

//  delete record
const deleteRecord = (id, res) => {
  let records = loadRecords();
  const newRecords = records.filter((record) => record.id !== id);
  if (records.length === newRecords.length) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: ` id: ${id} is not exists ⚠️` }));
    return;
  }
  saveRecords(newRecords);
  eventEmitter.emit("recordDeleted");
  res.statusCode = 200;
  res.end(JSON.stringify({ message: `user is deleted successful 🗑️` }));
};

// update record
const updateRecord = (id, data, res) => {
  const records = loadRecords();
  const recordIndex = records.findIndex((record) => record.id === id);
  if (recordIndex === -1) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: `id: (${id}) is not exist ⚠️` }));
    return;
  }

  records[recordIndex] = { id, ...data };
  saveRecords(records);
  eventEmitter.emit("recordUpdated", records[recordIndex]);
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      message: "user update successful ✅",
      data: { id, ...data },
    })
  );
};

module.exports = {
  addRecord,
  listRecords,
  deleteRecord,
  updateRecord,
  findOne,
};
