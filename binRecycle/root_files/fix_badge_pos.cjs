const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Fix hero-brand-badge: was positioned relative to products-wrapper, now relative to hero-img-col
// Also fix hero-img-col to be position:relative so absolute children work
const fix = `
/* Badge now positioned relative to hero-img-col (not products-wrapper) */
.hero-img-col { position: relative; }
.hero-brand-badge {
    bottom: 0 !important;
    right: 0 !important;
}
`;

fs.writeFileSync(cssPath, css + fix, 'utf8');
console.log('Done');
