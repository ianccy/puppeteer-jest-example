require("dotenv").config()
const devices = require("puppeteer/DeviceDescriptors");

beforeEach(async () => {
  await page.goto(
    "https://www.feversocial.com/promo/join?promoid=134230"
  );
});

describe("Login", () => {
  it("Fever Login Flow", async done => {
    await page.emulate(devices["iPhone 7"]);
    await page.waitForSelector("#e2e-login-button", {
      visible: true,
      timeout: 1500
    });
    try {
      const buttonHref = await page.$eval('#e2e-login-button', el => el.href);
      await expect(buttonHref).not.toBe('');
    } catch (error) {
      await page.screenshot({ path: "./promo_button_href_error.png" });
    }

    await page.click("#e2e-login-button");

    try {
      await page.waitForSelector("#email_input_container", {
        visible: true,
        timeout: 1500
      });
      await page.evaluate((account, password) => {
        document.querySelector("#email_input_container input").value = account;
        document.querySelector("input[type='password']").value = password;
        document.querySelector("button[name='login']").click();
      }, process.env.FBACCOUNT, process.env.FBPASSWORD);

      await page.waitForSelector("button[name='__CONFIRM__']", {
        visible: true,
        timeout: 1500
      });
      await page.evaluate(() => {
        document.querySelector("button[name='__CONFIRM__']").click();
      });
    } catch (error) {
      await page.screenshot({ path: "./facebook_error.png" });
    }
    try {
      await page.waitForSelector("div[type='0']", {
        visible: true,
        timeout: 1500
      });
      const buttonText = await page.$$eval('div[type="0"]', divs => divs[1].textContent);
      await expect(buttonText).toMatch('登出');
    } catch (error) {
      await page.screenshot({ path: "./promo_login_error.png" });
    }

    done();
  });
});
