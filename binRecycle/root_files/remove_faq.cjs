const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Find the start of the FAQ section and the start of the footer
const startIdx = content.indexOf('<section id="faq"');
const endIdx = content.indexOf('<footer class="bg-brand-brown');

if (startIdx !== -1 && endIdx !== -1) {
    // We want to keep the footer, so we slice up to startIdx, and from endIdx
    // Let's just find the closing </section> tag before the footer to be precise
    const beforeFooter = content.substring(startIdx, endIdx);
    const lastSectionEnd = beforeFooter.lastIndexOf('</section>') + 10;
    
    if (lastSectionEnd > 10) {
        const toRemove = beforeFooter.substring(0, lastSectionEnd);
        content = content.replace(toRemove, '');
        fs.writeFileSync(path, content, 'utf8');
        console.log('FAQ section removed successfully.');
    } else {
        console.log('Could not find </section>');
    }
} else {
    console.log('Could not find FAQ section or Footer');
}
