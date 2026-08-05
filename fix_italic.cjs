const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf8');

const old = `.hero-title-italic {\r\n    font-style: italic;\r\n    background: linear-gradient(135deg, #f5e6b0 0%, #E1B875 30%, #C5A059 65%, #8B6508 100%);\r\n    -webkit-background-clip: text;\r\n    background-clip: text;\r\n    -webkit-text-fill-color: transparent;\r\n}`;
const rep = `.hero-title-italic {\r\n    font-style: italic;\r\n    color: #E8D1A7;\r\n}`;

if (css.includes(old)) {
  css = css.replace(old, rep);
  fs.writeFileSync('src/css/style.css', css, 'utf8');
  console.log('done');
} else {
  const idx = css.indexOf('.hero-title-italic');
  console.log('Not matched. Current:', JSON.stringify(css.slice(idx, idx+200)));
}
