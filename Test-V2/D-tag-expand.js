const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/?orderBy=newest_to_oldest');

    await page.waitForTimeout(10000);

    const button_tag = await page.$('#headlessui-popover-button-\\:R6aa9j9l5t6\\:');

    // Click the button
    await button_tag.click();

    // Find the button
    const button_expand = await page.$('.text-blue-s.dark\\:text-dark-blue-s.cursor-pointer.text-md.font-medium.hover\\:underline');

    // Click the button
    await button_expand.click();

    

    await new Promise(() => { });
})();
