const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://nodejs.org/en/download/current');
    const title = await page.title();
    console.log(title);
    await browser.close();
})();
