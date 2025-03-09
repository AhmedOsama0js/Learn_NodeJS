// const cron = require("node-cron");
require("dotenv").config();

const { youtubeFunction } = require("./youtube.js");
const { changePassword } = require("./ChangePassword.js");
const { getData } = require("./getDataMatch.js");
const { sendMessageInTelegram } = require("./ApiBot2.js");

// changePassword();

// youtubeFunction();

// getData();

sendMessageInTelegram();

// cron.schedule("*/1 * * * *", async () => {
//   console.log(`[${new Date().toLocaleTimeString()}] 🔄 data start coming ....`);
//   await getData();
//   console.log(
//     `[${new Date().toLocaleTimeString()}] ✅ data extraction completed`
//   );
// });
