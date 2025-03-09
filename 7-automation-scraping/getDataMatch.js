// دالة رئيسية تعمل بشكل صحيح
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());
const fs = require("fs");
// const cron = require("node-cron");

const getData = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(process.env.DATA_LINK, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".single_match")).map(
      (match) => {
        const homeTeam =
          match.querySelector(".hometeam .the_team")?.innerText.trim() || "N/A";
        const awayTeam =
          match.querySelector(".awayteam .the_team")?.innerText.trim() || "N/A";
        const matchTime =
          match.querySelector(".match_time .the_time")?.innerText.trim() ||
          "N/A";
        const matchScore =
          match.querySelector(".match_score")?.innerText.trim() || "لم تبدأ";

        return {
          homeTeam,
          awayTeam,
          matchTime,
          matchScore,
        };
      }
    );
  });
  console.log("✅ البيانات المستخرجة:", data);

  const folderPath = "./match";
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const filePath = `${folderPath}/matches.json`;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`📂 تم حفظ البيانات في: ${filePath}`);

  await browser.close();
};

// cron.schedule("*/1 * * * *", async () => {
//   console.log(`[${new Date().toLocaleTimeString()}] 🔄 data start coming ....`);
//   await getData();
//   console.log(
//     `[${new Date().toLocaleTimeString()}] ✅ data extraction completed`
//   );
// });

module.exports = { getData };
