const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The corrupted section to replace
const badPattern = `.faq-trigger {\r\n#site-preloader.is-hidden {`;
const badPatternUnix = `.faq-trigger {\n#site-preloader.is-hidden {`;

const goodReplacement = `.faq-trigger {
    background: none; border: none;
    cursor: pointer;
    font-family: 'Be Vietnam Pro', sans-serif;
    transition: background 0.2s ease;
}
.faq-trigger:hover { background: rgba(197,160,89,0.04); }
.faq-icon {
    font-size: 20px; font-weight: 300;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease;
    user-select: none;
}
.faq-item.is-open .faq-icon {
    transform: rotate(45deg);
    background: rgba(197,160,89,0.15);
    border-color: rgba(197,160,89,0.5) !important;
}
.faq-body { transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1); }


/* ============================================================
   13. FOOTER
   ============================================================ */
.footer-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1.2fr;
    gap: 48px;
}
.footer-col-title {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.25em;
    color: #C5A059;
    text-transform: uppercase;
    margin: 0 0 24px;
    position: relative;
    padding-bottom: 12px;
}
.footer-col-title::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 28px; height: 1px;
    background: linear-gradient(90deg, #C5A059, transparent);
}
@media (max-width: 1024px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    .footer-brand-col { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    #footer > div { padding-left: 20px !important; padding-right: 20px !important; padding-top: 48px !important; }
}


/* ============================================================
   14. PRELOADER
   ============================================================ */
#site-preloader {
    position: fixed; inset: 0; z-index: 99999;
    background: linear-gradient(135deg, #1a0a05 0%, #2d1208 50%, #4A2C2A 100%);
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.7s ease, visibility 0.7s ease;
}
#site-preloader.is-hidden {`;

if (css.includes(badPattern)) {
    css = css.replace(badPattern, goodReplacement);
    console.log('Fixed CRLF pattern');
} else if (css.includes(badPatternUnix)) {
    css = css.replace(badPatternUnix, goodReplacement);
    console.log('Fixed LF pattern');
} else {
    // Try to find the pattern more flexibly
    const idx = css.indexOf('.faq-trigger {');
    if (idx !== -1) {
        const nextBit = css.substring(idx, idx + 200);
        console.log('Context around .faq-trigger:', JSON.stringify(nextBit));
    } else {
        console.log('Pattern not found at all');
    }
    process.exit(1);
}

// Also remove duplicate section headers if any
css = css.replace(/\/\* ={60,}\r?\n\s*\/\* ={60,}/g, '/* =============================================================');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS file fixed successfully!');
