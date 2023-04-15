const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // https://leetcode.com/problems/median-of-two-sorted-arrays/
    const urls = fs.readFileSync('links.txt', 'utf8').trim().split('\n');

    for (let i = 0; i < urls.length; i++) {
        // https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/?orderBy=newest_to_oldest
        const targetUrl = urls[i] + "solutions/?orderBy=newest_to_oldest";;
        await page.goto(targetUrl);
        await page.waitForTimeout(3000);

        // tag button
        const button_tag = await page.$('#headlessui-popover-button-\\:R6aa9j9l5t6\\:');
        await button_tag.click();

        // expand button
        const button_expand = await page.$('.text-blue-s.dark\\:text-dark-blue-s.cursor-pointer.text-md.font-medium.hover\\:underline');
        await button_expand.click();


        // rust button
        const button_rust = await page.$('span.inline-flex.items-center.px-2.whitespace-nowrap.text-xs.leading-6.rounded-full.text-label-3.dark\\:text-dark-label-3.bg-fill-3.dark\\:bg-dark-fill-3.cursor-pointer.transition-all.hover\\:bg-fill-2.dark\\:hover\\:bg-dark-fill-2:has-text("Rust")');
        await button_rust.click();

        // sort button
        const button_sort = await page.$('#headlessui-menu-button-\\:Rqaa9j9l5t6\\:');
        await button_sort.click();

        // most recent button
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

        console.log('Links scraped');

        const mapping = {};

        const fs = require('fs');

        for (const link of links) {
            const string1 = link;
            const string2 = `a[href="${new URL(string1).pathname}"]`;
            const element = await page.$(string2);
            let text = '';

            try {
                text = await element.innerText();
            } catch (error) {
                console.log(error);
                continue;
            }

            const formattedTitle = text.trim().replace(/\n/g, '. ');
            const title = formattedTitle ? formattedTitle.split('.')[1]?.trim().replace(/^-+|-+$/g, '').replace(/ /g, '-') : 'unknown';
            const number = formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';

            // Create the folder if it doesn't exist
            const formattedTitleWithDash = `${number}.${title}`;
            if (!fs.existsSync(formattedTitleWithDash)) {
                fs.mkdirSync(formattedTitleWithDash);
            }

            mapping[link] = formattedTitle;

            await page.goto(link);
            await page.waitForTimeout(3000);

            const pathSegments = link.split('/').filter(str => str !== "");
            const problemName = pathSegments[pathSegments.indexOf("problems") + 1];
            const solutionId = pathSegments[pathSegments.indexOf("solutions") + 1];

            // Check if the element with `language-rust` class exists
            const dataElement = await page.$('.language-rust');
            if (dataElement === null) {
                console.log(`${formattedTitleWithDash}: Rust solution not available`);
                continue;
            }

            const dataText = await dataElement.innerText();
            fs.writeFile(`${formattedTitleWithDash}/${problemName}${solutionId}.txt`, `// ${link}\n${dataText}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Data saved to dataText.txt');
            });
        }

    }

    await new Promise(() => { });
})();
