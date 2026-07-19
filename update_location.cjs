const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Replace specific meta tags
content = content.replace('Yến Sào Tám Thủy | Tinh Hoa Yến Đảo Bình Định — Giao Toàn Quốc', 'Yến Sào Tám Thủy | Tinh Hoa Yến Sào Gia Lai — Giao Toàn Quốc');
content = content.replace('Yến Sào Tám Thủy | Tinh Hoa Yến Đảo Bình Định', 'Yến Sào Tám Thủy | Tinh Hoa Yến Sào Gia Lai');
content = content.replace('hồng yến đảo', 'hồng yến');
content = content.replace('Cung cấp yến sào cao cấp nguyên chất tại Đầm Thị Nại, Bình Định.', 'Cung cấp yến sào cao cấp nguyên chất tại khu vực Đầm Thị Nại, Gia Lai.');

// Replace testimonials
content = content.replace('Hồng Yến Đảo đúng là quý hiếm thật', 'Hồng yến đúng là quý hiếm thật');
content = content.replace('Cần Thơ · Mua Hồng Yến Đảo', 'Cần Thơ · Mua Hồng Yến');

fs.writeFileSync(path, content, 'utf8');
console.log('HTML updated.');
