const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fix = `
/* Header when scrolled over dark hero — force dark bg + light text */
#main-header.on-dark-hero {
    border-bottom-color: rgba(197,160,89,0.2) !important;
}
#main-header.on-dark-hero .nav-item-premium {
    color: rgba(232,209,167,0.8) !important;
}
#main-header.on-dark-hero .nav-item-premium:hover { color: #E1B875 !important; }
#main-header.on-dark-hero .nav-item-premium::after { background-color: #C5A059 !important; }
#main-header.on-dark-hero [class*="font-serif"][class*="text-"] { color: #E8D1A7 !important; }
#main-header.on-dark-hero nav { background: rgba(26,8,5,0.55) !important; border-color: rgba(197,160,89,0.25) !important; }
#main-header.on-dark-hero img[alt*="Logo"] { filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(10deg) !important; }
#main-header.on-dark-hero [class*="bg-\\\\[\\\\#C5A059\\\\]"] { background: #C5A059 !important; color: #1A0805 !important; }
#main-header.on-dark-hero .hamburger-line { background-color: rgba(232,209,167,0.8) !important; }

/* Transition for smooth bg change */
#main-header {
    transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease, border-color 0.4s ease !important;
}
`;

fs.writeFileSync(cssPath, css + fix, 'utf8');
console.log('Done');
