const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let html = fs.readFileSync(path, 'utf8');

// Check what's near the end
const endSlice = html.slice(-3000);
console.log('=== LAST 3000 chars ===');
console.log(endSlice);
