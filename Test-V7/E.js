const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1'); // Replace with the URL of the page you want to scrape

  const data = await page.$$eval('a[href="/problems/median-of-two-sorted-arrays/"]', links => {
    return links.map(link => {
      return {
        data1: link.getAttribute('href'),
        data2: link.innerText
      };
    });
  });

  console.log(data);

  await browser.close();
})();
