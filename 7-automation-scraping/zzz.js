const fs = require("fs");
const path = require("path");
const { exec, execFile, spawn } = require("child_process");

// const folderName = new Date().toLocaleDateString("en-CA");
// const fileName = new Date().toISOString().replace(/[:.]/g, "-") + ".txt";
// const messageText = `welcome to new message from date ${fileName}`;

// if (!fs.existsSync(folderName)) {
//   fs.mkdirSync(folderName);
//   console.log("file is cerated");
// }

// const filePath = path.join(folderName, fileName);
// fs.writeFileSync(filePath, messageText);
// console.log(`📝   file create: ${fileName} in to folder ${folderName}`);

//  =====================================================================================================

// const command = process.platform === "win32" ? "dir" : "ls";

// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`❌ خطأ: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`⚠️ تحذير: ${stderr}`);
//     return;
//   }
//   console.log(`📂 الملفات والمجلدات:\n${stdout}`);
// });

//  =====================================================================================================

// let program;
// if (process.platform === "win32") {
//   program = "notepad.exe"; // فتح المفكرة على ويندوز
// } else {
//   program = "gnome-terminal"; // فتح Terminal على لينكس
// }

// execFile(program, (error) => {
//   if (error) {
//     console.error(`❌ خطأ: ${error.message}`);
//   } else {
//     console.log(`✅ تم فتح ${program} بنجاح!`);
//   }
// });

//  =====================================================================================================

// const command = process.platform === "win32" ? "ping" : "ping -c 5";
// const args = process.platform === "win32" ? ["google.com"] : ["google.com"];

// const processSpawn = spawn(command, args);

// processSpawn.stdout.on("data", (data) => {
//   console.log(`📡 ${data}`);
// });

// processSpawn.stderr.on("data", (data) => {
//   console.error(`❌ خطأ: ${data}`);
// });

// processSpawn.on("close", (code) => {
//   console.log(`✅ العملية انتهت برمز خروج: ${code}`);
// });

//  =====================================================================================================

// // 📂 اسم ملف الـ PDF
// const pdfFile = path.join(__dirname, "100DayChallenge.pdf");

// // 🔹 تحديد الأمر بناءً على نظام التشغيل
// let command;
// if (process.platform === "win32") {
//   command = `start "" "${pdfFile}"`; // Windows
// } else if (process.platform === "darwin") {
//   command = `open "${pdfFile}"`; // Mac
// } else {
//   command = `xdg-open "${pdfFile}"`; // Linux
// }

// // ✅ تنفيذ الأمر لفتح ملف الـ PDF
// exec(command, (error) => {
//   if (error) {
//     console.error("❌ حدث خطأ أثناء فتح الملف:", error);
//   } else {
//     console.log("✅ تم فتح ملف PDF بنجاح!");
//   }
// });

//  =====================================================================================================

// // const { exec } = require("child_process");

// // ⏳ مدة التشغيل قبل الإغلاق (بالمللي ثانية)
// const duration = 5000; // 5 ثوانٍ

// // 🔹 تحديد أمر فتح وإغلاق متصفح Edge حسب نظام التشغيل
// let openCommand, closeCommand;
// if (process.platform === "win32") {
//   openCommand = `start msedge`; // يفتح Edge في Windows
//   closeCommand = `taskkill /IM msedge.exe /F`; // يغلق جميع نوافذ Edge
// } else if (process.platform === "darwin") {
//   // لنظام MacOS
//   openCommand = `open -a "Microsoft Edge"`; // يفتح Edge
//   closeCommand = `pkill -f "Microsoft Edge"`; // يغلق Edge
// } else {
//   console.error("❌ متصفح Edge غير مدعوم رسميًا على هذا النظام!");
//   process.exit(1);
// }

// // ✅ تشغيل المتصفح
// exec(openCommand, (error) => {
//   if (error) {
//     console.error("❌ حدث خطأ أثناء فتح Edge:", error);
//   } else {
//     console.log("🌐 تم تشغيل Microsoft Edge!");

//     // ⏳ إغلاق المتصفح بعد مدة معينة
//     setTimeout(() => {
//       exec(closeCommand, (error) => {
//         if (error) {
//           console.error("❌ حدث خطأ أثناء إغلاق Edge:", error);
//         } else {
//           console.log("❌ تم إغلاق Microsoft Edge تلقائيًا!");
//         }
//       });
//     }, duration);
//   }
// });

//  =====================================================================================================
// const { spawn } = require("child_process");

const target = "google.com"; // يمكنك تغييره لأي موقع آخر
const command = process.platform === "win32" ? "ping" : "ping";
const args = process.platform === "win32" ? [target] : ["-c", "5", target]; // 5 مرات فقط في Linux

console.log(`🚀 بدء تنفيذ أمر ping إلى ${target}...`);

// 🕒 تسجيل وقت البدء
const startTime = Date.now();

// 🔹 تشغيل أمر `ping` باستخدام `spawn`
const processSpawn = spawn(command, args);

processSpawn.stdout.on("data", (data) => {
  console.log(`📡 ${data}`);
});

processSpawn.stderr.on("data", (data) => {
  console.error(`❌ خطأ: ${data}`);
});

// ✅ عند انتهاء العملية، احسب الزمن المستغرق
processSpawn.on("close", (code) => {
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000; // تحويل إلى ثوانٍ

  console.log(`✅ العملية انتهت برمز خروج: ${code}`);
  console.log(`⏳ الوقت المستغرق: ${elapsedTime} ثانية`);
});
