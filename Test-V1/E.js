const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    const elements = await page.$$('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s');
    console.log(elements.length);

    // Wait for the page to fully load before clicking on elements
    await page.waitForLoadState();

    for (const element of elements) {
        await element.click();
        await page.waitForURL();
    }

    // Keep the browser open
    await new Promise(() => { });
})();
