const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    await page.waitForTimeout(5000);

    const links = await page.$$eval('a[href*="/problems/"]', (links) =>
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

    const mapping = {};

    for (const link of links) {
        const string1 = link;
        const string2 = `a[href="${new URL(string1).pathname}"]`;
        const element = await page.$(string2);
        const text = await element.innerText();
        const formattedTitle = text.trim().replace(/\n/g, '. ');
        const title = formattedTitle ? formattedTitle.split('.')[1].trim().replace(/^-+|-+$/g, '').replace(/ /g, '-') : 'unknown';
        const number = formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';
        const formattedTitleWithDash = `${number}.${title}`;
        mapping[link] = formattedTitle;
        console.log(formattedTitleWithDash);
    }


    // Keep the browser open
    await new Promise(() => { });
})();
