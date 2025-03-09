const puppeteer = require("puppeteer");

const youtubeFunction = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  console.log(" الذهاب إلى YouTube...");
  await page.goto("https://www.youtube.com/", { waitUntil: "networkidle2" });

  await page.waitForSelector(".ytSearchboxComponentInput", { visible: true });

  const searchQuery = "تعلم Node.js من الصفر";
  await page.type(".ytSearchboxComponentInput", searchQuery);

  await page.keyboard.press("Enter");

  await page.waitForSelector("ytd-video-renderer", { visible: true });

  const firstVideo = await page.$("ytd-video-renderer a#thumbnail");
  if (firstVideo) {
    await firstVideo.click();
  } else {
    console.log(" لم يتم العثور على فيديو!");
    await browser.close();
    return;
  }

  await page.waitForSelector("video", { visible: true });

  try {
    await page.waitForSelector(".ytp-skip-ad-button", { timeout: 10000 });
    const skipButton = await page.$(".ytp-skip-ad-button");
    if (skipButton) {
      console.log(" تخطي الإعلان...");
      await skipButton.click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.log(" لا يوجد إعلان لتخطيه.");
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await page.screenshot({ path: "youtube_screenshot.png" });

  console.log(" تم التقاط لقطة شاشة!");

  await browser.close();
};

module.exports = { youtubeFunction };
