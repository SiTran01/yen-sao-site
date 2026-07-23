const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    
    // Serve file locally or use file:// protocol. Since there are assets, let's just use file protocol and ignore missing assets.
    await page.goto('file://' + __dirname + '/src/index.html', { waitUntil: 'networkidle0' });

    const overflowingElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const viewportWidth = window.innerWidth;
        const overflowing = [];
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > viewportWidth && rect.width > 0) {
                // ignore elements that are just wrappers passing the overflow
                overflowing.push({
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    right: rect.right,
                    width: rect.width,
                    scrollWidth: el.scrollWidth
                });
            }
        });
        
        return {
            viewportWidth,
            bodyScrollWidth: document.body.scrollWidth,
            htmlScrollWidth: document.documentElement.scrollWidth,
            overflowing
        };
    });

    console.log(JSON.stringify(overflowingElements, null, 2));
    await browser.close();
})();
