const fs = require('fs');

const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Find blog section precisely
const blogMarker = 'id="blog"';
const blogIdx = content.indexOf(blogMarker);
const sectionTagStart = content.lastIndexOf('<section', blogIdx);
console.log('Section tag:', content.substring(sectionTagStart, sectionTagStart + 100));

// Find the end of the blog section
let depth = 0;
let i = sectionTagStart;
let blogEnd = -1;
while (i < content.length) {
  if (content.startsWith('<section', i)) { depth++; i += 8; }
  else if (content.startsWith('</section>', i)) {
    depth--;
    if (depth === 0) { blogEnd = i + '</section>'.length; break; }
    i += 10;
  } else { i++; }
}
console.log('Blog end:', blogEnd);
console.log('Blog content:\n', content.substring(sectionTagStart, blogEnd).substring(0, 300));
