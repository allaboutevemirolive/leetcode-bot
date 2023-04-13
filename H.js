const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3397130/rust-branchless/');

    // Get the innerHTML of the element with class "language-cpp"
    const rustCode = await page.innerHTML('.language-rust');

    // Extract the text content from the HTML
    const tree = new DOMParser().parseFromString(rustCode, 'text/html');
    const targetRust = tree.documentElement.textContent;

    // Write the text content to a file
    fs.writeFileSync('rustCode.rs', targetRust);

    await browser.close();
})();
