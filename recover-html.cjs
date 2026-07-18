const fs = require('fs');

// Read from dist/index.html (the clean one before any PowerShell corruption)
let s = fs.readFileSync('dist/index.html', 'utf8');

// Revert Vite injected CSS
s = s.replace(/<link rel=\"stylesheet\".*?href=\"\/assets\/index-[A-Za-z0-9_-]+\.css\">/, '<link rel="stylesheet" href="./css/style.css">');

// Strip all HTML comments to be extra safe
s = s.replace(/<!--[\s\S]*?-->/g, '');

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

// Add optimizations (lazy loading/preloading was lost from the original dist)
s = s.replace('<head>', '<head>\n    <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">\n    <link rel="dns-prefetch" href="https://fonts.googleapis.com">\n    <link rel="preload" as="image" href="./assets/images/yen-tinh-che.webp">\n    <link rel="preload" as="image" href="./assets/images/yen-hu.webp">\n    <link rel="preload" as="image" href="./assets/images/yen-hop.webp">');

// Write back to src/index.html
fs.writeFileSync('src/index.html', s, 'utf8');
console.log('Successfully recovered src/index.html from dist/index.html and applied WebP');
