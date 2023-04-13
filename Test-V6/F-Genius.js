const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    await page.waitForTimeout(5000);

    const links = await page.$$eval('a[href*="/problems/"]', links =>
        links
            .filter(link => {
                const row = link.closest('div[role="row"]');
                return row && row.querySelector('a[href*="/problems/"]') === link;
            })
            .map(link => link.href)
    );

    const mapping = {};
    for (const link of links) {
        const string1 = link;
        const string2 = `a[href="${new URL(string1).pathname}"]`;
        const element = await page.$(string2);
        const text = await element.innerText();
        mapping[link] = text;
    }

    console.log(mapping);

    const medianOfTwoSortedArrays = mapping['https://leetcode.com/problems/median-of-two-sorted-arrays/'];
    console.log(medianOfTwoSortedArrays);

    // Keep the browser open
    // await new Promise(() => { });
    await browser.close();
})();
