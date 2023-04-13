const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    await page.waitForSelector('a[href*="/problems/"][class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]');

    const matches = await page.$$eval('a[href*="/problems/"][class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]', (links) =>
        links.map((link) => {
            let title = link.textContent.trim();
            // remove symbols from title
            title = title.replace(/[/:*?"<>|]/g, '');
            return `${title}\n`;
        })
    );

    console.log(matches.join(''));

    await browser.close();
})();
