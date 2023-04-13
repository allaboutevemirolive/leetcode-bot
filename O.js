const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

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

    const mapping = {};

    for (const match of matches) {
        const string1 = match;
        const string2 = `a[href="${new URL(string1).pathname}"]`;
        const element = await page.$(string2);
        const text = await element.innerText();
        const formattedTitle = text.trim().replace(/\n/g, '. ');
        const title = formattedTitle ? formattedTitle.split('.')[1].trim().replace(/^-+|-+$/g, '').replace(/ /g, '-') : 'unknown';
        const number = formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';
        const formattedTitleWithDash = `${number}.${title}`;
        mapping[match] = formattedTitle;
        // mapping[match] = 4. Median of Two Sorted Arrays
        // formattedTitleWithDash = 0004.Median-of-Two-Sorted-Arrays
        // console.log(formattedTitleWithDash);
        // console.log(mapping[match]);
        const folderName = formattedTitleWithDash;
        const dataText = '`${number}.${title}`' + '`${number}.${title}`';

        fs.mkdir(folderName, (err) => {
            if (err && err.code !== 'EEXIST') {
                throw err;
            }

            fs.writeFile(`${folderName}/${mapping[match]}.txt`, dataText, (err) => {
                if (err) {
                    throw err;
                }

                console.log(`File ${mapping[match]}} saved inside ${folderName} folder.`);
            });
        });
    }


    // Keep the browser open
    await browser.close();
})();
