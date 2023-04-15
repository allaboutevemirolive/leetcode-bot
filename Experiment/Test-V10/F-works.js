const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://leetcode.com/problems/super-egg-drop/solutions/?orderBy=newest_to_oldest');
    await page.waitForTimeout(5000);

    // find the search input by CSS selector
    const searchInput = await page.$('input[type="text"][placeholder="Search"]');

    // fill the input with the word "rust"
    await searchInput.fill('rust');
    await page.waitForTimeout(5000);

    // await browser.close();
    await new Promise(() => { });
})();
