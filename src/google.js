const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.emulate(devices["iPhone 7"]);
  await page.goto("https://google.com");
  await page.screenshot({ path: "./screenshot_google.png" });
  await page.evaluate(() => {
    document.querySelector("input[type='search']").value = "corona virus";
    document.querySelector("button[jsaction='click:.CLIENT']").click();
  });

  await page.waitForNavigation();
  await page.evaluate(() => {
    document.querySelector('#rso div[role="heading"]').click();
  });
  await page.waitForNavigation();
  await page.screenshot({ path: "./screenshot_google_search.png" });
  await browser.close();
})();
