const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problems/n-queens/solutions/2398922/golang-rust-java-python-bitmask-solution/');

    await page.waitForTimeout(3000);

    try {
        // hidden tag button
        const rustButton = await page.$('div.relative.cursor-pointer.px-3.py-3.text-label-4.dark\\:text-dark-label-4.hover\\:text-label-1.dark\\:hover\\:text-dark-label-1.GMIHh:has-text("Rust")');
        await rustButton.click();
        console.log('Rust hidden button clicked');
    } catch (err) {
        try {
            // visible tag button
            const rustButton = await page.$('div.relative.cursor-pointer.px-3.py-3.text-label-1.dark\\:text-dark-label-1.font-medium.GMIHh');
            await rustButton.click();
            console.log('Rust visible button clicked');
        } catch (err) {
            console.log('No Rust button found, skipping...');
        }

    }


    try {
        const dataElement = await page.$('.language-rust');
        await page.waitForTimeout(3000);
        const dataText = await dataElement.innerText();
        await page.waitForTimeout(3000);

        fs.writeFile(`${reconstructedString}.txt`, `// ${link}\n${dataText}`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Data saved to dataText.txt');
        });
    } catch (error) {
        console.log('Error occurred while retrieving data, skipping...');
    }


    await browser.close();
})();
