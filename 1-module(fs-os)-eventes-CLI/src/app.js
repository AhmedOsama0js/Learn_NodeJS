const chalk = require("chalk");
const readline = require("readline");
const {
  listRecords,
  addRecord,
  deleteRecord,
  updateRecord,
  searchRecord,
} = require("./records");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const showMenu = () => {
  console.log("\n🔹 chose");
  console.log("1️⃣  Get all");
  console.log("2️⃣  Add");
  console.log("3️⃣  Delete");
  console.log("4️⃣  Updata");
  console.log("5️⃣  search");
  console.log("0️⃣  Exit");

  
  rl.question("➡️  inter your chose: ", (choice) => {
    if (choice === "1") {
      listRecords();
      showMenu();
    } else if (choice === "2") {
      askForAddRecord();
    } else if (choice === "3") {
      askForDelete();
    } else if (choice === "4") {
      askForUpdateRecord();
    } else if (choice === "5") {
      askForSearch();
    } else if (choice === "0") {
      console.log(chalk.green("👋 good by"));
      rl.close();
    } else {
      console.log(chalk.red(" error in your chose try again ⚠️"));
      showMenu();
    }
  });
};

//  add data from asking
const askForAddRecord = () => {
  rl.question("name 📝: ", (name) => {
    rl.question("age 🎂 : ", (age) => {
      addRecord(name, parseInt(age));
      showMenu();
    });
  });
};

//update record
const askForUpdateRecord = () => {
  rl.question("name need update is 📝: ", (name) => {
    rl.question("name need update is  🎂 : ", (age) => {
      updateRecord(name, parseInt(age));
      showMenu();
    });
  });
};

// delete record
const askForDelete = () => {
  rl.question("name was deleted ❌ : ", (name) => {
    deleteRecord(name);
    showMenu();
  });
};

// delete record
const askForSearch = () => {
  rl.question("name need search 🔎 : ", (name) => {
    searchRecord(name);
    showMenu();
  });
};

showMenu();
