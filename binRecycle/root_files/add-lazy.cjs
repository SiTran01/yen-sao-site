const fs = require('fs');
let s = fs.readFileSync('src/index.html', 'utf8');

// Use a simple global replace for img src where we avoid hero images manually
// Let's just find and replace the bottom scripts first
s = s.replace('<script src="./js/script.js"></script>', '<script defer src="./js/script.js"></script>');
s = s.replace('<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>', '<script defer src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>');

fs.writeFileSync('src/index.html', s, 'utf8');
console.log('Added defer');
