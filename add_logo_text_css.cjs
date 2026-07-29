const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fix = `
/* Custom responsive logo text size */
.custom-logo-text {
    font-size: 19px;
}
@media (min-width: 768px) {
    .custom-logo-text {
        font-size: 18px; /* Tailwind text-lg */
    }
}
`;

fs.writeFileSync(cssPath, css + fix, 'utf8');
console.log('Done');
