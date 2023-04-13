const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    await page.waitForTimeout(5000);

    const links = await page.$$eval('a[href*="/problems/"]', links =>
        links.find(link => {
            const row = link.closest('div[role="row"]');
            return row && row.querySelector('a[href*="/problems/"]') === link && /^\d+\.\s+Median of Two Sorted Arrays/.test(link.textContent.trim());
        })?.href
    );

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
