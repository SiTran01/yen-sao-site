const fs = require('fs');

let s = fs.readFileSync('src/index.html', 'utf8');

// Replace all Vite-hashed image paths back to the local unhashed paths in src/assets/images
// and point them to .webp instead of .png

const imageReplacements = {
    'avt-svg-[A-Za-z0-9_-]+\\.svg': 'avt-svg.svg',
    'bg-[A-Za-z0-9_-]+\\.png': 'bg.webp',
    'bg-[A-Za-z0-9_-]+\\.webp': 'bg.webp',
    'bg-product-[A-Za-z0-9_-]+\\.png': 'bg-product.webp',
    'bg-product-[A-Za-z0-9_-]+\\.webp': 'bg-product.webp',
    'farm1-[A-Za-z0-9_-]+\\.png': 'farm1.webp',
    'farm2-[A-Za-z0-9_-]+\\.png': 'farm2.webp',
    'yen-hop-[A-Za-z0-9_-]+\\.png': 'yen-hop.webp',
    'yen-hop1-[A-Za-z0-9_-]+\\.png': 'yen-hop1.webp',
    'yen-tinh-che-[A-Za-z0-9_-]+\\.png': 'yen-tinh-che.webp',
    'yen-tinh-che1-[A-Za-z0-9_-]+\\.png': 'yen-tinh-che1.webp',
    'yen-hu-[A-Za-z0-9_-]+\\.png': 'yen-hu.webp',
    'yen-hu1-[A-Za-z0-9_-]+\\.png': 'yen-hu1.webp',
    'image1-[A-Za-z0-9_-]+\\.png': 'image1.webp'
};

for (const [hashed, clean] of Object.entries(imageReplacements)) {
    const regex = new RegExp(`\\/assets\\/${hashed}`, 'g');
    s = s.replace(regex, `./assets/images/${clean}`);
}

// Also check for preload tags that were added incorrectly in the previous step
// Wait, the previous step added: <link rel="preload" as="image" href="./assets/images/yen-tinh-che.webp">
// That should be fine.

// Let's also make sure any remaining .png references in url() in CSS are pointing to .webp
// This script only targets src/index.html, but I'll check style.css next.

fs.writeFileSync('src/index.html', s, 'utf8');
console.log('Restored hashed image paths to unhashed WebP paths in src/index.html');
