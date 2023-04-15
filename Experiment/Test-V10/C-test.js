const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const urls = fs.readFileSync('links.txt', 'utf8').trim().split('\n');

    for (let i = 0; i < urls.length; i++) {
        const targetUrl = urls[i] + "solutions/?orderBy=newest_to_oldest";
        console.log(targetUrl);
    }
})();
