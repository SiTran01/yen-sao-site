const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fix = `
/* Fix brand badge being clipped */
.hero-img-col { overflow: visible !important; }
.hero-img-col .hero-products-wrapper { overflow: visible !important; }
#hero .hero-products-wrapper { overflow: visible !important; }
`;

fs.writeFileSync(cssPath, css + fix, 'utf8');
console.log('Done');
