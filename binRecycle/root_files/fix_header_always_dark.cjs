const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fix = `
/* Header luôn dùng chữ sáng — vì nền header luôn dark glass */
#main-header .nav-item-premium {
    color: rgba(232,209,167,0.8) !important;
}
#main-header .nav-item-premium:hover { color: #E1B875 !important; }
#main-header .nav-item-premium::after { background-color: #C5A059 !important; }
#main-header [class*="font-serif"] { color: #E8D1A7 !important; }
#main-header nav { background: rgba(26,8,5,0.5) !important; border-color: rgba(197,160,89,0.2) !important; }
#main-header img[alt*="Logo"] { filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(10deg) !important; }
#main-header .hamburger-line { background-color: rgba(232,209,167,0.8) !important; }
`;

fs.writeFileSync(cssPath, css + fix, 'utf8');
console.log('Done');
