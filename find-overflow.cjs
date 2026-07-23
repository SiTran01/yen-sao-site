const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/src/index.html', {
        waitUntil: 'load', timeout: 20000
    });
    await new Promise(r => setTimeout(r, 3000));

    const result = await page.evaluate(() => {
        const vw = window.innerWidth;
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > vw + 1) {
                const style = window.getComputedStyle(el);
                results.push({
                    tag: el.tagName,
                    id: el.id || '-',
                    cls: (el.className + '').substring(0, 80),
                    right: Math.round(rect.right),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    sw: el.scrollWidth,
                    position: style.position,
                    overflow: style.overflow
                });
            }
        });
        return {
            vw,
            docSW: document.documentElement.scrollWidth,
            bodySW: document.body.scrollWidth,
            overflowing: results.slice(0, 20)
        };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
