const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Remove dead data-aos attributes (AOS library not loaded)
let count = 0;
html = html.replace(/\s+data-aos="[^"]*"/g, () => { count++; return ''; });
html = html.replace(/\s+data-aos-delay="[^"]*"/g, () => { count++; return ''; });
html = html.replace(/\s+data-aos-duration="[^"]*"/g, () => { count++; return ''; });

fs.writeFileSync(file, html, 'utf8');
console.log('Removed', count, 'dead data-aos attributes');
