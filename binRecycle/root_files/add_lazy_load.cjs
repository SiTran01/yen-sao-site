const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Lines that are hero/above-fold — keep eager (by line number range)
// Hero images: lines 410, 416, 422 — yen-tinh-che, yen-hu, yen-hop
// Preloader + chatbot header avatars (avt-svg): lines 80, 117, 137
// Nav logo (avt-svg): 184
// Footer avatar: 1244

// We'll target img tags by lines below-fold (products, hscroll, reviews etc.)
// Below-fold product section images: 502, 512, 542, 552
// Hscroll cards: 638-774
// Any others

const lines = html.split('\n');
let count = 0;

const belowFoldLines = [502, 512, 542, 552, 638, 659, 678, 697, 717, 736, 755, 774];

for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    if (belowFoldLines.includes(lineNum)) {
        if (lines[i].includes('<img') && !lines[i].includes('loading=')) {
            lines[i] = lines[i].replace('<img ', '<img loading="lazy" ');
            count++;
        }
    }
}

html = lines.join('\n');
fs.writeFileSync(file, html, 'utf8');
console.log('Added loading=lazy to', count, 'images');
