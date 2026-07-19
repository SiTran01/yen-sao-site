const fs = require('fs');

const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
const content = fs.readFileSync(path, 'utf8');

const orderStart = content.indexOf('<section id="order" class="order-section">');
const aboutStart = content.indexOf('<section id="about" class="py-24 bg-[#fff5e8]">');

// find the last </section> before aboutStart
const orderEnd = content.lastIndexOf('</section>', aboutStart) + '</section>'.length;

const orderBlock = content.substring(orderStart, orderEnd);

// Remove the orderBlock from its current position
let newContent = content.substring(0, orderStart) + content.substring(orderEnd);

// Find where to insert it (before <section id="blog")
const blogStart = newContent.indexOf('<section id="blog"');

newContent = newContent.substring(0, blogStart) + orderBlock + '\n\n        ' + newContent.substring(blogStart);

fs.writeFileSync(path, newContent, 'utf8');
console.log('Order section moved successfully.');
