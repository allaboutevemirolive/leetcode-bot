const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');

    await page.waitForTimeout(5000);

    const matches = await page.$$eval('a[href*="/problems/"]', (links) =>
        links
            .filter((link) => {
                const row = link.closest('div[role="row"]');
                return (
                    row &&
                    row.querySelector('a[href*="/problems/"][class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s"]') === link
                );
            })
            .map((link) => link.href)
    );

    const mapping = {};

    for (const match of matches) {
        // we need to roll back to the original page, to load  "element" and "text"
        await page.goto('https://leetcode.com/problemset/all/?difficulty=HARD&page=1');
        await page.waitForTimeout(5000);

        console.log(match);
        const string1 = match;
        const string2 = `a[href="${new URL(string1).pathname}"]`;
        const element = await page.$(string2);
        const text = await element.innerText();
        const formattedTitle = text.trim().replace(/\n/g, '. ');
        const title = formattedTitle ? formattedTitle.split('.')[1].trim().replace(/^-+|-+$/g, '').replace(/ /g, '-') : 'unknown';
        const number = formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';
        const formattedTitleWithDash = `${number}.${title}`;
        mapping[match] = formattedTitle;
        // mapping[match] = 4. Median of Two Sorted Arrays
        // formattedTitleWithDash = 0004.Median-of-Two-Sorted-Arrays
        // console.log(formattedTitleWithDash);
        // console.log(mapping[match]);
        const folderName = formattedTitleWithDash;
        const dataText = '`${number}.${title}`' + '`${number}.${title}`';

        // fs.mkdir(folderName, (err) => {
        //     if (err && err.code !== 'EEXIST') {
        //         throw err;
        //     }

        //     fs.writeFile(`${folderName}/${mapping[match]}.txt`, dataText, (err) => {
        //         if (err) {
        //             throw err;
        //         }

        //         console.log(`File ${mapping[match]}} saved inside ${folderName} folder.`);
        //     });
        // });

        const targetUrl = match + "solutions/?orderBy=newest_to_oldest";;
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

        for (const link of links) {
            // link
            await page.goto(link);
            await page.waitForTimeout(3000);

            const pathSegments = link.split('/').filter(str => str !== "");
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


                fs.mkdir(folderName, (err) => {
                    if (err && err.code !== 'EEXIST') {
                        throw err;
                    }

                    fs.writeFile(`${formattedTitleWithDash}/${reconstructedString}.txt`, `// ${link}\n${dataText}`, (err) => {
                        if (err) {
                            throw err;
                        }

                        console.log(`File ${reconstructedString} saved inside ${formattedTitleWithDash} folder.`);
                    });
                });

            } catch (error) {
                console.log('Error occurred while saving data ${reconstructedString}\nLink: ${link}');
            }

        }


    }

    await new Promise(() => { });
})();
