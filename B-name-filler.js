const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 

    await page.goto('https://leetcode.com/problems/super-egg-drop/solutions/?orderBy=newest_to_oldest');
    await page.waitForTimeout(5000);

    const searchInput = await page.$('input[type="text"][placeholder="Search"]');

    await searchInput.fill('rust');
    await page.waitForTimeout(5000);

    // 

    
    const links = await page.$$eval('a[href*="/problems/"]', links =>
        links.filter(link => {
            const row = link.closest('div[class="relative flex w-full gap-4 px-5 py-3 transition-[background] duration-500"]');
            return row && row.querySelector('a[href*="/problems/"]') === link;
        })
            .map(link => link.href)
    );

    console.log('Links scraped');

    for (const link of links) {
        // link
        console.log(link);
    }


    await new Promise(() => { });
})();
