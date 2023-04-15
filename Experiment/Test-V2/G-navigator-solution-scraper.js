const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/?orderBy=newest_to_oldest');

    await page.waitForTimeout(10000);

    // tag button
    const button_tag = await page.$('#headlessui-popover-button-\\:R6aa9j9l5t6\\:');
    await button_tag.click();

    // expand button
    const button_expand = await page.$('.text-blue-s.dark\\:text-dark-blue-s.cursor-pointer.text-md.font-medium.hover\\:underline');
    await button_expand.click();

    // rust button
    const button_rust = await page.$('span.inline-flex.items-center.px-2.whitespace-nowrap.text-xs.leading-6.rounded-full.text-label-3.dark\\:text-dark-label-3.bg-fill-3.dark\\:bg-dark-fill-3.cursor-pointer.transition-all.hover\\:bg-fill-2.dark\\:hover\\:bg-dark-fill-2:has-text("Rust")');
    await button_rust.click();


    const button_sort = await page.$('#headlessui-menu-button-\\:Rqaa9j9l5t6\\:');
    await button_sort.click();

    const button_recent = await page.$('div.truncate:has-text("Most Recent")');
    await button_recent.click();

    await page.waitForTimeout(3000);

    const links = await page.$$eval('a[href*="/problems/"]', links =>
        links.filter(link => {
            const row = link.closest('div[class="relative flex w-full gap-4 px-5 py-3 transition-[background] duration-500"]');
            return row && row.querySelector('a[href*="/problems/"]') === link;
        })
            .map(link => link.href)
    );

    fs.writeFile('links.txt', links.join('\n'), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Links saved to links.txt');
    });

    await new Promise(() => { });
})();
