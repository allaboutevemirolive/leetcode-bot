const { chromium } = require('playwright');
const fs = require('fs');
const parse5 = require('parse5');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3397130/rust-branchless/');

    await page.waitForTimeout(10000);
    
    // Get the innerHTML of the element with class "language-cpp"
    const rustCode = await page.innerHTML('.language-rust');

    // Extract the text content from the HTML using parse5
    const fragment = parse5.parseFragment(rustCode);
    const codeElement = findElementByClassName(fragment, 'code');
    const targetRust = getTextContent(codeElement);

    // Write the text content to a file
    fs.writeFileSync('rustCode.txt', targetRust);

    await browser.close();
})();

function findElementByClassName(node, className) {
    if (node.attrs && node.attrs.find(attr => attr.name === 'class' && attr.value === className)) {
        return node;
    }
    for (const childNode of node.childNodes || []) {
        const result = findElementByClassName(childNode, className);
        if (result) {
            return result;
        }
    }
    return null;
}

function getTextContent(node) {
    if (node.nodeName === '#text') {
        return node.value;
    }
    let textContent = '';
    for (const childNode of node.childNodes || []) {
        textContent += getTextContent(childNode);
    }
    return textContent;
}
