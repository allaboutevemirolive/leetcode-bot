const { chromium } = require('playwright');


async function languageFiller(page, search_lang) {
    const searchInput = await page.$('input[type="text"][placeholder="Search..."]');
    await searchInput.fill(search_lang);
    await page.waitForTimeout(5000);
}

async function scrapEachSolutionLink(page) {

    const links = await page.$$eval('a[href*="/problems/"]', links =>
        links.filter(link => {
            const row = link.closest('div[class="hover:bg-fill-4 dark:hover:bg-dark-fill-4 relative flex w-full cursor-pointer gap-4 px-4 py-4"]');
            return row && row.querySelector('a[href*="/problems/"]') === link;
        })
            .map(link => link.href)
    );

    console.log(`Scraped ${links.length} links`);

    return links;
}



(async () => {
    
    const browser = await chromium.launch( { headless: false });
    const page = await browser.newPage();

    const target_link = 'https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/';
    const search_lang = "rust";

    await page.goto(target_link);

    try {
        await languageFiller(page, search_lang);
    } catch (err) {
        console.log('Page not found. Not premium user or there is no solution');
    }

    const links = await scrapEachSolutionLink(page);
        
    console.log("links: ", links);

    await new Promise(() => { });
})();