const fs = require('fs');
let s = fs.readFileSync('src/index.html', 'utf8');

// Strip any BOM
if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);

// Replace box-drawing characters and weird apostrophes
s = s.replace(/[\u2500-\u257F\u2013\u2014\u2018\u2019\u201C\u201D]/g, '-');

// Apply WebP replacements
const reps = [
    ['assets/images/bg.png',             'assets/images/bg.webp'],
    ['assets/images/bg-product.png',     'assets/images/bg-product.webp'],
    ['assets/images/farm1.png',          'assets/images/farm1.webp'],
    ['assets/images/farm2.png',          'assets/images/farm2.webp'],
    ['assets/images/yen-hop.png',        'assets/images/yen-hop.webp'],
    ['assets/images/yen-hop1.png',       'assets/images/yen-hop1.webp'],
    ['assets/images/yen-tinh-che.png',   'assets/images/yen-tinh-che.webp'],
    ['assets/images/yen-tinh-che1.png',  'assets/images/yen-tinh-che1.webp'],
    ['assets/images/yen-hu.png',         'assets/images/yen-hu.webp'],
    ['assets/images/yen-hu1.png',        'assets/images/yen-hu1.webp'],
    ['assets/images/image1.png',         'assets/images/image1.webp']
];
for (const [o, n] of reps) s = s.split(o).join(n);

fs.writeFileSync('src/index.html', s, 'utf8');
console.log('Cleaned and updated WebP successfully!');
