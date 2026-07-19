const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Find the blog-modal div
const modalStartMarker = '<!-- Blog Modal -->';
const modalStart = content.indexOf(modalStartMarker);
if (modalStart === -1) throw new Error('Blog modal comment not found');

// Find the end </div> of the modal
const modalEnd = content.indexOf('</div>', content.indexOf('</div>', content.indexOf('</div>', modalStart) + 1) + 1) + '</div>'.length;

// Extract the modal HTML
const modalHTML = content.substring(modalStart, modalEnd);
console.log('Extracted modal HTML (first 120 chars):', modalHTML.substring(0, 120));

// Remove it from current position (also remove surrounding whitespace/newlines)
content = content.substring(0, modalStart).trimEnd() + '\n' + content.substring(modalEnd).trimStart();

// Insert just before </body>
const bodyCloseIdx = content.lastIndexOf('</body>');
content = content.substring(0, bodyCloseIdx) + '\n    ' + modalHTML + '\n' + content.substring(bodyCloseIdx);

fs.writeFileSync(path, content, 'utf8');
console.log('Moved blog-modal to direct child of <body>');
