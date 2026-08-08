const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'css', 'style.css');
let css = fs.readFileSync(file, 'utf8');
const original = css;

// Orphaned class blocks to remove (confirmed not in index.html)
// We'll remove them carefully by finding the block start and end

// Helper: remove a CSS block starting with a selector
function removeCSSBlock(css, startMarker, endComment) {
    const idx = css.indexOf(startMarker);
    if (idx === -1) {
        console.log('NOT FOUND:', startMarker.substring(0, 60));
        return css;
    }
    // Find the matching closing brace
    let depth = 0;
    let i = idx;
    let started = false;
    while (i < css.length) {
        if (css[i] === '{') { depth++; started = true; }
        if (css[i] === '}') { 
            depth--;
            if (started && depth === 0) {
                // Remove from startMarker to this closing brace
                const removed = css.substring(idx, i + 1);
                // Also remove leading newlines before the block
                const before = css.substring(0, idx).trimEnd();
                const after = css.substring(i + 1);
                css = before + '\n' + after;
                console.log('REMOVED block:', startMarker.substring(0, 50));
                return css;
            }
        }
        i++;
    }
    console.log('BLOCK END NOT FOUND for:', startMarker.substring(0, 60));
    return css;
}

// Remove orphaned single-class and multi-class blocks
// .feature-box-container and children
css = removeCSSBlock(css, '.feature-box-container');
css = removeCSSBlock(css, '.feature-box {');
css = removeCSSBlock(css, '.feature-icon');
css = removeCSSBlock(css, '.feature-text');

// .brand-sticker group
css = removeCSSBlock(css, '.brand-sticker {');
css = removeCSSBlock(css, '.sticker-main');
css = removeCSSBlock(css, '.sticker-sub');

// Old product grid classes
css = removeCSSBlock(css, '.product-grid-container');
css = removeCSSBlock(css, '.product-item {');
css = removeCSSBlock(css, '.btn-buy-now {');

// Old stats section
css = removeCSSBlock(css, '.stats-section {');
css = removeCSSBlock(css, '.stats-grid');
css = removeCSSBlock(css, '.stat-card {');
css = removeCSSBlock(css, '.stat-divider');

// bg-oriental (references bg-product.webp but class not in HTML)
css = removeCSSBlock(css, '.bg-oriental {');

// Old hero styles no longer used
css = removeCSSBlock(css, '.hero-marble');
css = removeCSSBlock(css, '.hero-img-box {');
css = removeCSSBlock(css, '.hero-img-hu');
css = removeCSSBlock(css, '.hero-img-raw');
css = removeCSSBlock(css, '.scroll-down-btn {');

// Remove data-aos dead attributes (not used since AOS lib not loaded)
// Note: We handle this in HTML separately

fs.writeFileSync(file, css, 'utf8');
const saved = original.length - css.length;
console.log(`\nDone. Saved ${saved} bytes (${(saved/1024).toFixed(1)} KB)`);
console.log(`Original: ${original.length} bytes, New: ${css.length} bytes`);
