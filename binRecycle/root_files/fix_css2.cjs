const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf8');

const targetStr = `.hc {
    display: inline-block;
    opacity: 0;
    transform: translateY(0.6em) rotateX(40deg);
#hero-main-title.hero-title-animate .hero-title-row:nth-child(1) .hero-char-group:nth-child(2) .hc:nth-child(1) { animation-delay: 0.32s; }`;

const replacementStr = `.hc {
    display: inline-block;
    opacity: 0;
    transform: translateY(0.6em) rotateX(40deg);
    filter: blur(6px);
    will-change: opacity, transform, filter;
}

#hero-main-title.hero-title-animate .hc {
    animation: 
        hc-appear 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) forwards,
        hc-pulse-glow 4.5s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}

/* Per-character stagger delays — Row 1: Yến Sào */
#hero-main-title.hero-title-animate .hero-title-row:nth-child(1) .hero-char-group:nth-child(1) .hc:nth-child(1) { animation-delay: 0.05s; }
#hero-main-title.hero-title-animate .hero-title-row:nth-child(1) .hero-char-group:nth-child(1) .hc:nth-child(2) { animation-delay: 0.13s; }
#hero-main-title.hero-title-animate .hero-title-row:nth-child(1) .hero-char-group:nth-child(1) .hc:nth-child(3) { animation-delay: 0.21s; }
#hero-main-title.hero-title-animate .hero-title-row:nth-child(1) .hero-char-group:nth-child(2) .hc:nth-child(1) { animation-delay: 0.32s; }`;

if (css.includes(targetStr)) {
    css = css.replace(targetStr, replacementStr);
    fs.writeFileSync('src/css/style.css', css);
    console.log('Fixed CSS successfully');
} else {
    console.log('Target string not found in style.css');
}
