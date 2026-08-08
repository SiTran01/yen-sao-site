const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fix = `
/* Custom responsive logo size to bypass Tailwind compiler issues */
.custom-logo-size {
    width: 58px;
    height: 58px;
}
@media (min-width: 768px) {
    .custom-logo-size {
        width: 56px;
        height: 56px;
    }
}
`;

fs.writeFileSync(cssPath, css + fix, 'utf8');
console.log('Done');
