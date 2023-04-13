const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://leetcode.com/problemset/all/');
  const element = await page.$('a[href="/problems/median-of-two-sorted-arrays/"]');
  const text = await element.innerText();
  console.log(text);
  await browser.close();
})();
