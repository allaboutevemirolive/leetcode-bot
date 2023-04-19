const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const text_file = 'LeetCode-Hard-Page-1.txt'

    const target_link = 'https://leetcode.com/problemset/all/?difficulty=HARD&page=1';

    // waitForSelector method with multiple selectors separated by commas will wait until at least one of the selectors is found on the page
    const target_language_class = '.language-rust, .language-python, .language-java, .language-cpp';

    // language-cpp
    // language-java
    // language-python
    // language-rust

    // for some reason, python3 was label as language-java. Need to check again
    // python3 was label as language-java???
    // language-cpp
    // sometimes cpp also label as language-java

    // at this point, maybe we can just check the title's solution instead of the label.


    const matches = fs.readFileSync(text_file, 'utf8').trim().split('\n');

    const mapping = {};

    for (const match of matches) {
        // mapping our links with the title form leetcode page and rebuild the title with the number
        // So we only create folder that match with our list of links
        await page.goto(target_link);
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
        const folderName = formattedTitleWithDash;

        // Base case:
        // Not all solution tag with rust. 
        // Instead of clicking button, we can just seacrh for rust in the search bar
        try {
            const targetUrl = match + "solutions/?orderBy=newest_to_oldest";;
            await page.goto(targetUrl);

            await page.waitForTimeout(3000);

            const searchInput = await page.$('input[type="text"][placeholder="Search"]');
            await searchInput.fill('rust');

            await page.waitForTimeout(5000);

        } catch (err) {
            console.log(err);
            console.log('Page not found. Not premium user');
            continue;
        }

        try {
            // sort button
            const button_sort = await page.$('#headlessui-menu-button-\\:Rqaa9j9l5t6\\:');
            await button_sort.click();

            // most recent button
            const button_recent = await page.$('div.truncate:has-text("Most Recent")');
            await button_recent.click();
        } catch (err) {
            console.log(err);
            console.log('No sort button');
        }


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
                const dataElement = await page.waitForSelector(target_language_class);
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
