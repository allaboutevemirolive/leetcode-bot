const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1'); // replace with your webpage URL

    // wait for the element to be visible and stable, then click it
    await page.waitForSelector('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s');
    await page.click('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s');

    
    await browser.close();
})();
