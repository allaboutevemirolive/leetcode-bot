const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    // Wait for the page to fully load before clicking on elements
    await page.waitForTimeout(10000);

    const fs = require('fs');

    const links = await page.$$eval('div[role="row"]', rows =>
        rows.filter(row => row.querySelector('a[href*="/problems/"]')?.getAttribute('href')?.endsWith('/solution'))
            .map(row => row.querySelector('a[href*="/problems/"]'))
            .filter(link => link && link.textContent.trim() === '4. Median of Two Sorted Arrays')
            .map(link => link.href)
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
