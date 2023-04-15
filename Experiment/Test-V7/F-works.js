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

        for (let j = 0; j < links.length; j++) {
            await page.goto(links[j]);
            await page.waitForTimeout(3000);

            const pathSegments = links[j].split('/').filter(str => str !== "");
            const problemName = pathSegments[pathSegments.indexOf("problems") + 1];
            const solutionId = pathSegments[pathSegments.indexOf("solutions") + 1];

            const reconstructedString = `${problemName}${solutionId}`;

            // If there is more than one language, click the Rust button
            const rustButton = await page.$('div.relative.cursor-pointer.px-3.py-3.text-label-4.dark\\:text-dark-label-4.hover\\:text-label-1.dark\\:hover\\:text-dark-label-1.GMIHh:has-text("Rust")');
            if (rustButton) {
                await rustButton.click();
                console.log('Clicked Rust hidden button / there is more than one language');
            } else {
                console.log('Rust button is visible or there is only one language');
            }

            try {
                const dataElement = await page.$('.language-rust');
                await page.waitForTimeout(3000);
                const dataText = await dataElement.innerText();
                await page.waitForTimeout(3000);

                const folderName = 'myFolder';

                fs.mkdir(folderName, (err) => {
                    if (err && err.code !== 'EEXIST') {
                        throw err;
                    }

                    fs.writeFile(`${folderName}/${reconstructedString}.txt`, `// ${links[j]}\n${dataText}`, (err) => {
                        if (err) {
                            throw err;
                        }

                        console.log(`File ${reconstructedString} saved inside ${folderName} folder.`);
                    });
                });

            } catch (error) {
                console.log('Error occurred while saving data ${reconstructedString}\nLink: ${links[j]}');
            }

        }
    }

    await new Promise(() => { });
})();
