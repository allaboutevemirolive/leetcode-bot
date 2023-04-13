const { chromium } = require('playwright');
const fs = require('fs');
const cheerio = require('cheerio');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3397130/rust-branchless/');

    // Get the innerHTML of the element with class "language-cpp"
    const rustCode = await page.innerHTML('.language-rust');

    // Extract the text content from the HTML using cheerio
    const $ = cheerio.load(rustCode);
    const targetRust = $('code').text();

    // Write the text content to a file
    fs.writeFileSync('rustCode.txt', targetRust);

    await browser.close();
})();
