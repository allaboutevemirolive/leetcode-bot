const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    // Wait for the page to fully load before clicking on elements
    await page.waitForLoadState();

    const links = await page.$$eval('a[href*="/problems/"]', links => links.map(link => link.href));

    // Iterate through the list of links and do something with them
    for (const link of links) {
        console.log(link);
        // Or do something else with the link element
        await page.goto(link);
        await page.waitForLoadState();
    }

    // Keep the browser open
    await new Promise(() => { });
})();
