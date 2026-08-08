const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const extra = `
/* Header light text on dark hero */
#main-header.on-dark-hero .nav-item-premium {
    color: rgba(232,209,167,0.75) !important;
}
#main-header.on-dark-hero .nav-item-premium:hover { color: #E1B875 !important; }
#main-header.on-dark-hero .nav-item-premium::after { background-color: #C5A059 !important; }
#main-header.on-dark-hero .font-serif { color: #E8D1A7 !important; }
#main-header.on-dark-hero .border-gray-400\\/30 { border-color: rgba(197,160,89,0.2) !important; }
#main-header.on-dark-hero nav { background: rgba(26,8,5,0.5) !important; }
#main-header.on-dark-hero img[alt*="Logo"] {
    filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(10deg);
}
#main-header.on-dark-hero #hamburger-btn { border-color: rgba(197,160,89,0.4) !important; }
#main-header.on-dark-hero .hamburger-line { background-color: rgba(232,209,167,0.8) !important; }
#main-header.on-dark-hero .bg-\\[\\#C5A059\\] { background: rgba(197,160,89,0.9) !important; }
`;

fs.writeFileSync(cssPath, css + extra, 'utf8');
console.log('Done');
