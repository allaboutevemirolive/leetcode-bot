const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1'); // replace with your webpage URL

    // locate all elements with the specified class
    const elements = await page.$$('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s');

    console.log(elements.length);
    // click on each element
    for (const element of elements) {
      await element.click();
      await new Promise(() => { });
    }

    // Keep the browser open
    await new Promise(() => { });
})();