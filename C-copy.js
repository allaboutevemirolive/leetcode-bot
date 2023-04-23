const { chromium } = require('playwright');
const fs = require('fs');



async function retrieveTitle(page, match) {
    const string1 = match;
    const string2 = `a[href="${new URL(string1).pathname}"]`;
    const element = await page.$(string2);
    const text = await element.innerText();
    const formattedTitle = text.trim().replace(/\n/g, '. ');
    return formattedTitle;
}


async function getPageIsNotFound(title, number) {
    const getpageIsNotFound = `${number}._EMPTY_${title}`;
    return getpageIsNotFound;
}


async function accessPage(target_link, page, match) {
    await page.goto(target_link);
    await page.waitForTimeout(6000);
    console.log('match: ' + match);
}


async function getTitle(formattedTitle) {
    const getTitle = formattedTitle ? formattedTitle.split('.')[1].trim().replace(/^-+|-+$/g, '').replace(/ /g, '-') : 'unknown';
    return getTitle;
}


async function getNumber(formattedTitle) {

    const number = formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';
    return number;
}


async function accessQuestionLink(match) {
    const targetUrl = match + "solutions/?orderBy=newest_to_oldest";;
    await page.goto(targetUrl);
    await page.waitForTimeout(3000);
}


async function languageFiller(page, langSearcher) {
    const searchInput = await page.$('input[type="text"][placeholder="Search..."]');
    await searchInput.fill(langSearcher);
    await page.waitForTimeout(5000);
}


async function folderPageNotFound(pageIsNotFound) {
    fs.mkdir(pageIsNotFound, (err) => {
        if (err && err.code !== 'EEXIST') {
            throw err;
        }
    });
}


async function sortButtonClicker(page) {
    const button_sort = await page.$('#headlessui-menu-button-\\:Rmaa9j9l5t6\\:');
    await button_sort.click();
}


async function recentButtonClicker(page) {
    const button_recent = await page.$('div.truncate:has-text("Most Recent")');
    await button_recent.click();
}


async function scrapEachSolutionLink(page) {
    const links = await page.$$eval('a[href*="/problems/"]', links =>
        links.filter(link => {
            const row = link.closest('div[class="relative flex w-full gap-4 px-5 py-3 transition-[background] duration-500"]');
            return row && row.querySelector('a[href*="/problems/"]') === link;
        })
            .map(link => link.href)
    );
    console.log('Links scraped');

    return links;
}


async function constructSolutionFile(link) {

    await page.goto(link);
    await page.waitForTimeout(3000);

    const pathSegments = link.split('/').filter(str => str !== "");
    // We need to change "-" to "_" to follow the naming convention
    const problemName = pathSegments[pathSegments.indexOf("problems") + 1];
    const updatedProblemName = problemName.replace(/-/g, '_');

    const solutionId = pathSegments[pathSegments.indexOf("solutions") + 1];
    const reconstructedString = `${updatedProblemName}${solutionId}`;

    return reconstructedString;
}


async function languageButtonClicker(page, unhideLangButton) {
    const targetLanguageButton = await page.$(`div.relative.cursor-pointer.px-3.py-3.text-label-4.dark\\:text-dark-label-4.hover\\:text-label-1.dark\\:hover\\:text-dark-label-1.GMIHh:has-text("${unhideLangButton}")`);

    if (targetLanguageButton) {
        await targetLanguageButton.click();
        console.log('Clicked Rust hidden button / there is more than one language');
    } else {
        console.log('Rust button is visible or there is only one language');
    }
}


async function copySolutionToClipboard(page, target_language_class) {
    const dataElement = await page.waitForSelector(target_language_class);
    await page.waitForTimeout(3000);

    const dataText = await dataElement.innerText();
    await page.waitForTimeout(3000);
    return dataText;
}


async function writeToFile(formattedTitleWithDash, link, dataText, reconstructedString) {

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

    // Parameters
    const text_file = 'LeetCode-Hard-Page-8.txt';
    const target_link = 'https://leetcode.com/problemset/all/?difficulty=HARD&page=8';
    const langSearcher = 'rust';
    const unhideLangButton = 'Rust';
    const target_language_class = '.language-rust, .language-python, .language-java, .language-cpp';

    const matches = fs.readFileSync(text_file, 'utf8').trim().split('\n');

    const mapping = {};

    // Strip each questions
    for (const match of matches) {

        await accessPage(target_link, page, match);

        // Retrieve title
        const formattedTitle = await retrieveTitle(page, match);

        mapping[match] = formattedTitle;

        const title = await getTitle(formattedTitle);
        const number = await getNumber(formattedTitle);

        const formattedTitleWithDash = `${number}.${title}`;

        const pageIsNotFound = await getPageIsNotFound(title, number);


        try {
            await accessQuestionLink(match);
            await languageFiller(page, langSearcher);
        } catch (err) {
            console.log('Page not found. Not premium user or there is no solution');
            await folderPageNotFound(pageIsNotFound);
            continue;
        }

        try {
            await sortButtonClicker(page);
            await recentButtonClicker(page);
        } catch (err) {
            console.log('No sort button');
        }

        const links = await scrapEachSolutionLink(page);

        if (links.length === 0) {
            console.log('No links found');
            // If page not found, create a folder with " _EMPTY_ " prefix
            await folderPageNotFound(pageIsNotFound);

        } else {
            // For each solution / link, we store it in a txt file
            for (const link of links) {
                try {

                    const reconstructedString = await constructSolutionFile(link);

                    await languageButtonClicker(page, unhideLangButton);

                    const dataText = await copySolutionToClipboard(page, target_language_class);
                    await writeToFile(formattedTitleWithDash, link, dataText, reconstructedString);

                } catch (error) {
                    console.log(`Error occurred while processing link: ${link}`);
                    console.error(error);
                }
            }
        }
    }
    await new Promise(() => { });
})();
