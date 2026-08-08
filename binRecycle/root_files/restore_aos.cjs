const fs = require('fs');
const execSync = require('child_process').execSync;

let currentHtml = fs.readFileSync('src/index.html', 'utf8');
const originalHtml = execSync('git show HEAD:src/index.html', { encoding: 'utf8' });

const aosLines = originalHtml.split('\n').filter(line => line.includes('data-aos='));

let replaceCount = 0;
aosLines.forEach(origLine => {
    let strippedLine = origLine
        .replace(/\s+data-aos="[^"]*"/g, '')
        .replace(/\s+data-aos-delay="[^"]*"/g, '')
        .replace(/\s+data-aos-duration="[^"]*"/g, '');
        
    if (currentHtml.includes(strippedLine.trim())) {
        currentHtml = currentHtml.replace(strippedLine.trim(), origLine.trim());
        replaceCount++;
    }
});

fs.writeFileSync('src/index.html', currentHtml, 'utf8');
console.log('Restored data-aos to ' + replaceCount + ' lines.');
