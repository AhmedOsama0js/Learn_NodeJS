const puppeteer = require("puppeteer");
const cron = require("node-cron");

const changePassword = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  await page.goto("https://www.engli-z.com", { waitUntil: "load" });

  await page.waitForSelector(".navbar-toggler");

  await page.click(".navbar-toggler");

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.click('a.nav-link[href="/login"]');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.type("#email", process.env.EMAIL);
  await page.type("#password", process.env.PASSWORD);

  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.click(".navbar-toggler");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.click('a.nav-link[href="/me"]');

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.evaluate(() => {
    document.querySelectorAll("button").forEach((btn) => {
      if (btn.innerText.trim() === "تغير كلمة المرور المرور") {
        btn.click();
      }
    });
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.waitForSelector('input[name="currentPasword"]');
  await page.type('input[name="currentPasword"]', "123456789");
  await page.type('input[name="password"]', "123456789");
  await page.type('input[name="passwordConfirm"]', "123456789");

  await page.click('button[type="submit"]');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.evaluate(() => {
    document.querySelectorAll("button").forEach((btn) => {
      if (btn.innerText.trim() === "تسجيل الخروج") {
        btn.click();
      }
    });
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.evaluate(() => {
    document.querySelectorAll("button").forEach((btn) => {
      if (btn.innerText.trim() === "نعم") {
        btn.click();
      }
    });
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("✅ التفاعل مع الصفحة ناجح!");

  await browser.close();
};

module.exports = { changePassword };
