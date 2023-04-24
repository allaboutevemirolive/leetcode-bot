const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Numeral of pages starts from 1
    for (let i = 1; i <= 12; i++) {

        const targetUrl = `https://leetcode.com/problemset/all/?difficulty=HARD&page=${i}`;

        await page.goto(targetUrl);

        await page.waitForTimeout(5000);

        const matches = await page.$$eval('a[href*="/problems/"]', (links) =>
            links
                .filter((link) => {
                    const row = link.closest('div[role="row"]');
                    return (
                        row &&
                        row.querySelector('a[href*="/problems/"][class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]') === link
                    );
                })
                .map((link) => link.href)
        );

        const file_name = 'LeetCode-Hard-Page-' + i ;

        fs.writeFile(`${file_name}.txt`, matches.join('\n'), (err) => {
            if (err) {
                throw err;
            }
            console.log(`File ${file_name} saved.`);
        });
    }

    await new Promise(() => { });
})();
