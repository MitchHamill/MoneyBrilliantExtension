// @ts-nocheck
const puppeteer = require('puppeteer');

const MB_SITE = 'https://api.moneybrilliant.com.au';

export async function getNewToken({ username, password }, opts) {
  const showBrowser = opts?.showBrowser;
  const browser = await puppeteer.launch({
    headless: !showBrowser,
  });
  const page = await browser.newPage();
  await page.goto(MB_SITE);
  await page.type('#user_email', username);
  await page.type('#user_password', password);
  await page.click('button');
  await page.waitForSelector('.userinfo');
  console.log('Getting token...');
  const token = await page.evaluate(() =>
    window.sessionStorage.getItem('auth_token')
  );
  console.log('Got token');
  await browser.close();

  return token;
}
