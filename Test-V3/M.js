const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3374001/mergesort-iterator-approach/');

    await page.waitForTimeout(3000);

    if (page.$('div.text-label-1:has-text("Rust")') || page.$('div.text-label-4:has-text("Rust")')) {
        try {
            // Visible button
            await page.click('div.text-label-1:has-text("C++")');
        } catch (e) {
            try {
                // Hidden button
                await page.click('div.text-label-4:has-text("C++")');
            } catch (e) {
                console.log(`An error occurred: ${e}\n`);
                console.log("There is no C++ button\n");
            }
        }
    }


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
