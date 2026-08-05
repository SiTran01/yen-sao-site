const fs = require('fs');
const file = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let text = fs.readFileSync(file, 'utf8');

// ── 1. Fix .hero-shine-text: remove overflow:hidden, add background-size/position ──
// Remove overflow: hidden line
text = text.replace('    overflow: hidden;\r\n', '');

// Replace the static background with one that has background-size for animation
const oldBg = `    background: linear-gradient(
        110deg,
        #9a7420 0%,
        #e8c97a 45%,
        #fffbe8 60%,
        #c9a55a 80%,
        #8B6508 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    clip-path: inset(0 100% 0 0);
    transform: translateX(-12px);
}`;

const newBg = `    background: linear-gradient(
        110deg,
        #8B6508 0%,
        #c9a55a 18%,
        #fffbe8 36%,
        #fff9e0 46%,
        #fffbe8 56%,
        #c9a55a 74%,
        #8B6508 100%
    );
    background-size: 280% auto;
    background-position: 0% center;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    clip-path: inset(0 100% 0 0);
    transform: translateX(-12px);
}`;

if (text.includes(oldBg)) {
  text = text.replace(oldBg, newBg);
  console.log('✓ background updated with background-size');
} else {
  console.log('✗ background pattern not found');
}

// ── 2. Remove the ::after block entirely ──
const afterBlock = `\r\n/* Light-streak overlay via ::after pseudo-element */\r\n.hero-shine-text::after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 45%;\r\n    height: 100%;\r\n    background: linear-gradient(\r\n        105deg,\r\n        transparent 20%,\r\n        rgba(255, 253, 230, 0.50) 50%,\r\n        transparent 80%\r\n    );\r\n    pointer-events: none;\r\n    transform: translateX(-110%) skewX(-20deg);\r\n    opacity: 0;\r\n}`;
if (text.includes(afterBlock)) {
  text = text.replace(afterBlock, '');
  console.log('✓ ::after block removed');
} else {
  console.log('✗ ::after block not found, trying alternate...');
  // Try just removing what we can find
  const idx = text.indexOf('/* Light-streak overlay via ::after pseudo-element */');
  const endIdx = text.indexOf('}\r\n\r\n/* Word reveal', idx);
  if (idx !== -1 && endIdx !== -1) {
    text = text.slice(0, idx) + text.slice(endIdx + 3);
    console.log('✓ ::after block removed (alternate)');
  }
}

// ── 3. Restore word-reveal + add hero-light-streak animation ──
const oldWordReveal = `/* Word reveal — triggered when parent h1 gets .hero-title-animate */\r\n#hero-main-title.hero-title-animate .hero-word-reveal {\r\n    animation: word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;\r\n    /* animation-delay for word-reveal is set via inline style */\r\n}\r\n\r\n/* Light-streak fires on ::after every 6s — long pause gives a luxury feel */\r\n#hero-main-title.hero-title-animate .hero-word-reveal::after {\r\n    animation: hero-light-streak 6s 2.4s ease-in-out infinite;\r\n}`;

const newWordReveal = `/* Word reveal + luxury gold gleam — triggered when parent h1 gets .hero-title-animate */\r\n#hero-main-title.hero-title-animate .hero-word-reveal {\r\n    animation:\r\n        word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards,\r\n        hero-light-streak 5s 2.2s ease-in-out infinite;\r\n    /* animation-delay for word-reveal is set via inline style */\r\n}`;

if (text.includes(oldWordReveal)) {
  text = text.replace(oldWordReveal, newWordReveal);
  console.log('✓ word-reveal animation merged with hero-light-streak');
} else {
  console.log('✗ word-reveal block not found');
  // Show context around the area
  const idx = text.indexOf('Word reveal');
  console.log('Context:', JSON.stringify(text.slice(Math.max(0, idx-5), idx+300)));
}

// ── 4. Replace hero keyframe to use background-position ──
const oldKeyframe = `/* Luxury light-streak sweep on italic text (hero only) */\r\n@keyframes hero-light-streak {\r\n    0%        { transform: translateX(-110%) skewX(-20deg); opacity: 0; }\r\n    5%        { opacity: 1; }\r\n    30%       { transform: translateX(210%) skewX(-20deg); opacity: 0; }\r\n    100%      { transform: translateX(210%) skewX(-20deg); opacity: 0; }\r\n}`;

const newKeyframe = `/* Luxury gold gleam on text — sweep once then long pause (background-clip:text) */\r\n@keyframes hero-light-streak {\r\n    0%   { background-position: 0% center; }\r\n    35%  { background-position: 200% center; }\r\n    100% { background-position: 200% center; }\r\n}`;

if (text.includes(oldKeyframe)) {
  text = text.replace(oldKeyframe, newKeyframe);
  console.log('✓ keyframe updated to background-position');
} else {
  console.log('✗ keyframe not found');
  const idx = text.indexOf('hero-light-streak');
  console.log('Context:', JSON.stringify(text.slice(Math.max(0, idx-30), idx+300)));
}

fs.writeFileSync(file, text, 'utf8');
console.log('\nDone!');
