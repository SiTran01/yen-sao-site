const fs = require('fs');
const file = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let text = fs.readFileSync(file, 'utf8');

// 1. Remove stale inline comment
text = text.replace(
  '    /* Animation is applied via .hero-word-reveal rule below (both reveal + shine) */\r\n',
  ''
);

// 2. Remove "Run BOTH" comment line
text = text.replace(
  '/* Run BOTH word-reveal (one-shot) AND shine-sweep (infinite) together */\r\n',
  ''
);

// 3. Replace the multi-animation shorthand with single word-reveal
const oldAnim = `    animation:\r\n        word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards,\r\n        shine-sweep 4s 1.9s linear infinite;\r\n    /* animation-delay for word-reveal is set via inline style */\r\n}`;
const newAnim = `    animation: word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;\r\n    /* animation-delay for word-reveal is set via inline style */\r\n}\r\n\r\n/* Light-streak fires on ::after every 6s — long pause gives a luxury feel */\r\n#hero-main-title.hero-title-animate .hero-word-reveal::after {\r\n    animation: shine-sweep 6s 2.4s ease-in-out infinite;\r\n}`;

if (text.includes(oldAnim)) {
  text = text.replace(oldAnim, newAnim);
  console.log('✓ Animation rule patched');
} else {
  console.log('⚠ Animation rule not found — may already be patched');
}

// 4. Inject ::after block after .hero-shine-text closing brace (if not already present)
if (!text.includes('.hero-shine-text::after')) {
  const shineClose = `    transform: translateX(-12px);\r\n}\r\n\r\n/* Word reveal`;
  const shineCloseWithAfter = `    transform: translateX(-12px);\r\n}\r\n\r\n/* Light-streak overlay via ::after pseudo-element */\r\n.hero-shine-text::after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 45%;\r\n    height: 100%;\r\n    background: linear-gradient(\r\n        105deg,\r\n        transparent 20%,\r\n        rgba(255, 253, 230, 0.50) 50%,\r\n        transparent 80%\r\n    );\r\n    pointer-events: none;\r\n    transform: translateX(-110%) skewX(-20deg);\r\n    opacity: 0;\r\n}\r\n\r\n/* Word reveal`;

  if (text.includes(shineClose)) {
    text = text.replace(shineClose, shineCloseWithAfter);
    console.log('✓ ::after block injected');
  } else {
    console.log('⚠ shine close pattern not found');
  }
} else {
  console.log('✓ ::after already present');
}

fs.writeFileSync(file, text, 'utf8');
console.log('Done!');
