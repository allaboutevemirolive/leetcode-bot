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


async function getPageNotFound(title, number) {
    const getPageNotFound = `${number}._EMPTY_${title}`;
    return getPageNotFound;
}


async function accessPage(page, match, target_link) {
    await page.goto(target_link);
    console.log('match: ' + match);
    await page.waitForTimeout(6000);
}


async function getTitle(formattedTitle) {
    if (!formattedTitle) {
        return 'unknown';
    }

    const titleParts = formattedTitle.split('.');
    const subtitle = titleParts[1] ? titleParts[1].trim() : '';
    const normalizedSubtitle = subtitle.replace(/(^-+|-+$| )/g, '-');
    const title = normalizedSubtitle || 'unknown';

    return title;
}


async function getNumber(formattedTitle) {
    const number = formattedTitle ? formattedTitle.split('.')[0].padStart(4, '0') : '0000';
    return number;
}


async function accessQuestionLink(page, match) {
    const targetUrl = match + "solutions/?orderBy=newest_to_oldest";
    await page.goto(targetUrl);
    await page.waitForTimeout(3000);
}


async function languageFiller(page, search_lang) {
    const searchInput = await page.$('input[type="text"][placeholder="Search..."]');
    await searchInput.fill(search_lang);
    await page.waitForTimeout(5000);
}


async function folderPageNotFound(folder_page_not_found) {
    console.log('No links found');

    const folderPath = `${__dirname}/${folder_page_not_found}`;
    const filePath = `${folderPath}/emptyFile.txt`;

    try {
        // Create the folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Write to the file
        fs.writeFileSync(filePath, `// nothing`);

        console.log(`File 'emptyFile' saved inside ${folder_page_not_found} folder.`);
    } catch (err) {
        console.error(`Error writing to file: ${err}`);
    }
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

    console.log(`Scraped ${links.length} links`);

    return links;
}


async function constructSolutionFile(page, link) {

    await page.goto(link);
    await page.waitForTimeout(3000);

    const pathSegments = link.split('/').filter(str => str !== "");
    // We need to change "-" to "_" to follow the naming convention
    const problemName = pathSegments[pathSegments.indexOf("problems") + 1];
    const updatedProblemName = problemName.replace(/-/g, '_');

    const solutionId = pathSegments[pathSegments.indexOf("solutions") + 1];
    const file_txt_underscore = `${updatedProblemName}${solutionId}`;

    return file_txt_underscore;
}


async function clickLangButton(page, unhide_Lang_Button) {
    const targetLanguageButton = await page.$(`div.relative.cursor-pointer.px-3.py-3.text-label-4.dark\\:text-dark-label-4.hover\\:text-label-1.dark\\:hover\\:text-dark-label-1.GMIHh:has-text("${unhide_Lang_Button}")`);

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
    const copied_solution = await dataElement.innerText();
    await page.waitForTimeout(3000);
    return copied_solution;
}


async function writeToFile(folder_dash, link, copied_solution, file_txt_underscore) {
    const folderPath = `${__dirname}/${folder_dash}`;
    const filePath = `${folderPath}/${file_txt_underscore}.txt`;

    try {
        // Create the folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Write to the file
        fs.writeFileSync(filePath, `// ${link}\n${copied_solution}`);

        console.log(`File ${file_txt_underscore} saved inside ${folder_dash} folder.`);
    } catch (err) {
        console.error(`Error writing to file: ${err}`);
    }
}



(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Parameters
    const text_file = 'LeetCode-Hard-Page-8.txt';
    const target_link = 'https://leetcode.com/problemset/all/?difficulty=HARD&page=8';
    const search_lang = "'rust'";
    const unhide_Lang_Button = 'Rust'; // Capitalize the first letter
    const target_language_class = '.language-rust, .language-python, .language-java, .language-cpp';

    const matches = fs.readFileSync(text_file, 'utf8').trim().split('\n');
    const mapping = {};

    // Strip each questions
    for (const match of matches) {

        await accessPage(page, match, target_link);
        // Retrieve title
        const formattedTitle = await retrieveTitle(page, match);

        mapping[match] = formattedTitle;

        const title = await getTitle(formattedTitle);
        const number = await getNumber(formattedTitle);

        const folder_dash = `${number}.${title}`;
        const folder_page_not_found = await getPageNotFound(title, number);


        try {
            await accessQuestionLink(page, match);
            await languageFiller(page, search_lang);
        } catch (err) {
            console.log('Page not found. Not premium user or there is no solution');
            await folderPageNotFound(folder_page_not_found);
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
            // If page not found, create an empty folder with " _EMPTY_ " prefix
            await folderPageNotFound(folder_page_not_found);
        } else {
            // For each solution/link, we store it in a txt file
            for (const link of links) {
                try {
                    const file_txt_underscore = await constructSolutionFile(page, link);

                    await clickLangButton(page, unhide_Lang_Button);

                    const copied_solution = await copySolutionToClipboard(page, target_language_class);
                    await writeToFile(folder_dash, link, copied_solution, file_txt_underscore);

                } catch (error) {
                    console.log(`Error occurred while processing link: ${link}`);
                    console.error(error);
                }
            }
        }
    }
    await new Promise(() => { });
})();
