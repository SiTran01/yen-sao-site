const fs = require('fs');

// ─── 1. Update HTML: separate clip-path (outer) from background-position shine (inner) ───
let html = fs.readFileSync('src/index.html', 'utf8');

// Find and replace Sào span
const saoOld = `class="hero-title-italic hero-shine-text hero-word-reveal" style="animation-delay:0.32s,1.9s;"> Sào</span>`;
const saoNew = `class="hero-title-italic hero-word-reveal" style="animation-delay:0.32s;"><span class="hero-shine-text"> Sào</span></span>`;

// Find and replace Thủy span
const thuyOld = `class="hero-title-italic hero-shine-text hero-word-reveal" style="animation-delay:0.89s,1.9s;"> Th\u1ee7y</span>`;
const thuyNew = `class="hero-title-italic hero-word-reveal" style="animation-delay:0.89s;"><span class="hero-shine-text"> Th\u1ee7y</span></span>`;

if (html.includes(saoOld)) {
  html = html.replace(saoOld, saoNew);
  console.log('✓ Sào span updated');
} else {
  console.log('✗ Sào not found, checking raw...');
  const idx = html.indexOf('hero-shine-text hero-word-reveal');
  console.log('Found at:', idx, JSON.stringify(html.slice(idx - 5, idx + 120)));
}

if (html.includes(thuyOld)) {
  html = html.replace(thuyOld, thuyNew);
  console.log('✓ Thủy span updated');
} else {
  console.log('✗ Thủy not found');
  const idx = html.indexOf('hero-shine-text hero-word-reveal', 335 * 80);
  if (idx !== -1) console.log('Found at:', idx, JSON.stringify(html.slice(idx - 5, idx + 120)));
}

fs.writeFileSync('src/index.html', html, 'utf8');
console.log('HTML saved');

// ─── 2. Update CSS: hero-shine-text now is the INNER span (no clip-path needed, pure bg-position shine) ───
let css = fs.readFileSync('src/css/style.css', 'utf8');

// Update the .hero-shine-text block at line 2195 area — remove clip-path/transform (those are now on outer .hero-word-reveal)
const oldShineBlock = `.hero-shine-text {
    position: relative;
    background: linear-gradient(
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

const newShineBlock = `.hero-shine-text {
    /* inner span: handles only the gold gradient + background-position shine */
    background: linear-gradient(
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
}`;

if (css.includes(oldShineBlock)) {
  css = css.replace(oldShineBlock, newShineBlock);
  console.log('✓ .hero-shine-text updated (removed clip-path)');
} else {
  console.log('✗ .hero-shine-text block not matched exactly');
}

// Update .hero-word-reveal animation: word-reveal only (clip-path + translateX on outer)
// hero-shine-text gets the bg-position animation separately
const oldReveal = `/* Word reveal + luxury gold gleam — triggered when parent h1 gets .hero-title-animate */
#hero-main-title.hero-title-animate .hero-word-reveal {
    animation:
        word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards,
        hero-light-streak 5s 2.2s ease-in-out infinite;
    /* animation-delay for word-reveal is set via inline style */
}`;

const newReveal = `/* Word reveal — outer span, clips text in via clip-path */
#hero-main-title.hero-title-animate .hero-word-reveal {
    animation: word-reveal 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    /* animation-delay is set via inline style */
}

/* Gold gleam on inner .hero-shine-text — background-position sweep */
#hero-main-title.hero-title-animate .hero-word-reveal .hero-shine-text {
    animation: hero-light-streak 5s 1.8s ease-in-out infinite;
}`;

if (css.includes(oldReveal)) {
  css = css.replace(oldReveal, newReveal);
  console.log('✓ animation rules split onto separate elements');
} else {
  console.log('✗ oldReveal not matched');
}

// Also make sure .hero-word-reveal has clip-path initial state (it had it before on hero-shine-text)
// .hero-word-reveal needs: clip-path: inset(0 100% 0 0); transform: translateX(-12px);
const wordRevealBase = `.hero-word-reveal {`;
if (css.includes(wordRevealBase)) {
  console.log('✓ .hero-word-reveal already has a base rule');
} else {
  // Insert before the animation rule
  const insertBefore = `/* Word reveal — outer span`;
  css = css.replace(insertBefore, `.hero-word-reveal {\n    clip-path: inset(0 100% 0 0);\n    transform: translateX(-12px);\n}\n\n` + insertBefore);
  console.log('✓ .hero-word-reveal base rule inserted');
}

fs.writeFileSync('src/css/style.css', css, 'utf8');
console.log('\nAll done!');
