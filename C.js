const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    await page.waitForTimeout(5000);

    const pattern = /\d+\. (.+)/; // regex pattern to match links with a number followed by a dot and a space

    // Scrape all links with the specified pattern in text content
    const linksWithPattern = await page.$$eval('a[href*="/problems/"]', links =>
        links.filter(link => {
            const row = link.closest('div[role="row"]');
            const textContent = link.textContent.trim();
            return (
                row &&
                row.querySelector(
                    'a[href*="/problems/"][class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]'
                ) === link &&
                pattern.test(textContent) // check if the text content matches the regex pattern
            );
        }).map(link => link.href)
    );

    console.log("Links with pattern:", linksWithPattern);

    // Scrape link with specific text content
    const specificLink = await page.$$eval('a[href*="/problems/"]', links =>
        links.find(link => {
            const row = link.closest('div[role="row"]');
            const textContent = link.textContent.trim();
            return (
                row &&
                row.querySelector(
                    'a[href*="/problems/"][class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]'
                ) === link &&
                textContent.includes("4. Median of Two Sorted Arrays") // check if the text content includes the specified string
            );
        }).href
    );

    console.log("Specific link:", specificLink);



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
