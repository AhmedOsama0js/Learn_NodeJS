const EventEmitter = require("events");
const chalk = require("chalk");

const eventEmitter = new EventEmitter();

eventEmitter.on("recordAdded", (record) => {
  console.log(
    chalk.green(`📢 New record added: name: ${record.name}, age: ${record.age}`)
  );
});

eventEmitter.on("recordDeleted", (name) => {
  console.log(chalk.yellow(`Record deleted: ${name} 🗑️`));
});

eventEmitter.on("recordsListed", (records) => {
  console.log(
    chalk.green(`The record was displayed ${records.length} successfully 📜`)
  );
});

eventEmitter.on("recordUpdated", (records) => {
  console.log(
    chalk.green(`The record was update ${records.name} successfully 📜`)
  );
});


eventEmitter.on("recordSearch", (records) => {
  console.log(chalk.green(`fined name: ${records[0].name} successfully 📜`));
});

module.exports = eventEmitter;
