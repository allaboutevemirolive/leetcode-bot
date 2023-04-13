const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    // Wait for the page to fully load before clicking on elements
    await page.waitForTimeout(10000);

    const fs = require('fs');

    const links = await page.$$eval('a[href*="/problems/"]', links =>
        [...new Set(links.map(link => link.href))]
            .filter(href => !href.endsWith('/solution'))
    );

    // Write the links to a file
    fs.writeFile('links.txt', links.join('\n'), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Links saved to links.txt');
    });

    // Keep the browser open
    await new Promise(() => { });
})();
