const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'src/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const footerStart = html.indexOf('<footer id="footer"');
const footerEnd = html.indexOf('</footer>', footerStart) + 9;

if (footerStart === -1 || footerEnd === -1) {
    console.error("Footer not found");
    process.exit(1);
}

const beforeFooter = html.substring(0, footerStart);
let footerHtml = html.substring(footerStart, footerEnd);
const afterFooter = html.substring(footerEnd);

// Increase font sizes in the footer HTML
// Match font-size: Xpx
footerHtml = footerHtml.replace(/font-size:\s*([\d.]+)px/g, (match, sizeStr) => {
    // Except for the very small ones maybe?
    let size = parseFloat(sizeStr);
    // Don't change font sizes 10px or below (like the 'Thương Hiệu' text which is exactly 10px, or maybe increase that to 11px?)
    // User requested "chữ của khối footer hơi nhỏ nhỉ thêm 1 px đi"
    // Let's add 1px to all of them.
    return `font-size:${size + 1}px`;
});

const newHtml = beforeFooter + footerHtml + afterFooter;
fs.writeFileSync(htmlPath, newHtml, 'utf8');
console.log("Footer font sizes increased by 1px!");
