const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3374001/mergesort-iterator-approach/');

    await page.waitForTimeout(3000);
    
    const dataElement = await page.$('.language-rust');
    const dataText = await dataElement.innerText();

    fs.writeFile('dataText.txt', dataText, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data saved to dataText.txt');
    });

    await browser.close();
})();
