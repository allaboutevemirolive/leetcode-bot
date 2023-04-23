const { chromium } = require('playwright');
const fs = require('fs');

async function getFormattedTitle(page, string) {
    const element = await page.$(`a[href="${new URL(string).pathname}"]`);
    const text = await element.innerText();
    const formattedTitle = text.trim().replace(/\n/g, '. ');
    return formattedTitle ? formattedTitle.split('.')[1].trim().replace(/^-+|-+$/g, '').replace(/ /g, '-') : 'unknown';
}

async function getNumber(page, string) {
    const element = await page.$(`a[href="${new URL(string).pathname}"]`);
    const text = await element.innerText();
    const formattedTitle = text.trim().replace(/\n/g, '. ');
    return formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';
}

async function getFormattedTitleWithDash(page, formattedTitle, number) {
    return `${number}.${formattedTitle}`;
}

async function createMapping(matches, mapping) {
    for (const match of matches) {
        mapping[match] = await getFormattedTitle(page, match);
    }
    return mapping;
}

async function getPageNotFound(number, title) {
    return `${number}._EMPTY_${title}`;
}

async function createFolder(folderName) {
    fs.mkdir(folderName, (err) => {
        if (err && err.code !== 'EEXIST') {
            throw err;
        }
    });
}

async function writeToFile(link, dataText, reconstructedString, formattedTitleWithDash) {
    fs.mkdir(formattedTitleWithDash, (err) => {
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
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const text_file = 'LeetCode-Hard-Page-8.txt';

    const target_link = 'https://leetcode.com/problemset/all/?difficulty=HARD&page=8';

    const target_language_class = '.language-rust, .language-python, .language-java, .language-cpp';

    const matches = fs.readFileSync(text_file, 'utf8').trim().split('\n');

    let mapping = {};
    mapping = await createMapping(matches, mapping);

    for (const match of matches) {

        await page.goto(target_link);
        await page.waitForTimeout(6000);

        console.log('match: ' + match);

        const string1 = match;

        const formattedTitle = await getFormattedTitle(page, string1);
        const number = await getNumber(page, string1);
        const formattedTitleWithDash = await getFormattedTitleWithDash(page, formattedTitle, number);
        const pageNotFound = await getPageNotFound(number, formattedTitle);
        
        const folderName = formattedTitleWithDash;
        await createFolder(folderName);

        try {
            const targetUrl = `${match}solutions/?orderBy=newest_to_oldest`;
            await page.goto(targetUrl);

            await page.waitForTimeout(3000);

            const searchInput = await page.$('input[type="text"][placeholder="Search..."]');
            await searchInput.fill('rust');

            await page.waitForTimeout(5000);

        } catch (err) {
            console.log(err);
            console.log('Page not found. Not premium user');

            await createFolder(pageNotFound);
            
            continue;
        }

        try {
            const button_sort = await page.$('#headlessui-menu-button-\\:Rmaa9j9l5t6\\:');
            await button_sort.click();

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


        if (links.length === 0) {
            console.log('No links found');
            await createFolder(pageNotFound);
        } else {

            for (const link of links) {
                try {
                    await page.goto(link);
                    await page.waitForTimeout(3000);

                    const pathSegments = link.split('/').filter(str => str !== "");
                    
                    const problemName = pathSegments[pathSegments.indexOf("problems") + 1];
                    const updatedProblemName = problemName.replace(/-/g, '_');
                    const solutionId = pathSegments[pathSegments.indexOf("solutions") + 1];
                    const reconstructedString = `${updatedProblemName}${solutionId}`;
                    
                    const rustButton = await page.$('div.relative.cursor-pointer.px-3.py-3.text-label-4.dark\\:text-dark-label-4.hover\\:text-label-1.dark\\:hover\\:text-dark-label-1.GMIHh:has-text("Rust")');
                    
                    if (rustButton) {
                        await rustButton.click();

                        console.log('Clicked Rust hidden button / there is more than one language');
                    } else {

                        console.log('Rust button is visible or there is only one language');
                    }

                    const dataElement = await page.waitForSelector(target_language_class);
                    await page.waitForTimeout(3000);

                    const dataText = await dataElement.innerText();
                    await page.waitForTimeout(3000);

                    await writeToFile(link, dataText, reconstructedString, formattedTitleWithDash);

                } catch (error) {
                    console.log(`Error occurred while processing link: ${link}`);
                    console.error(error);
                }
            }
        }
    }
    await new Promise(() => { });
})();
