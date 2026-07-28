const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const lines = css.split('\n');
// Find .stats-section { at approx line 562
const startLine = lines.findIndex(l => l.trim() === '.stats-section {');
// Find the products section comment
const endLine = lines.findIndex((l, i) => i > startLine && l.includes('08. PRODUCTS'));

console.log('Found stats at line:', startLine, '| products at:', endLine);

const before = lines.slice(0, startLine).join('\n');
const after = lines.slice(endLine).join('\n');

const newCSS = `.stats-section {
    background: #1C0D07;
    position: relative;
    padding: 80px 0;
    border-top: 1px solid rgba(197,160,89,0.25);
    border-bottom: 1px solid rgba(197,160,89,0.25);
}

/* Ambient glow */
.stats-section::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 70%; height: 100%;
    background: radial-gradient(ellipse at center, rgba(139,101,8,0.15) 0%, transparent 70%);
    pointer-events: none;
}

.stats-eyebrow {
    text-align: center;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(197, 160, 89, 0.5);
    margin-bottom: 56px;
    opacity: 0;
    transform: translateY(16px);
}
.stats-eyebrow::before,
.stats-eyebrow::after {
    content: '——';
    margin: 0 12px;
    opacity: 0.4;
}

/* Grid */
.stats-grid {
    display: flex;
    align-items: stretch;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
}

/* Divider */
.stat-divider {
    flex-shrink: 0;
    width: 1px;
    background: linear-gradient(to bottom,
        transparent 0%,
        rgba(197,160,89,0.3) 20%,
        rgba(197,160,89,0.5) 50%,
        rgba(197,160,89,0.3) 80%,
        transparent 100%
    );
    position: relative;
    margin: 0 4px;
}
.stat-divider::after {
    content: '✦';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 8px;
    color: rgba(197,160,89,0.6);
    background: #1C0D07;
    padding: 4px 0;
    line-height: 1;
}

/* Stat Card */
.stat-card {
    flex: 1;
    padding: 8px 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    opacity: 0;
    transform: translateY(40px);
    transition: transform 0.4s ease;
    cursor: default;
}
.stat-card:hover { transform: translateY(-6px); }

/* Icon */
.stat-icon {
    width: 32px; height: 32px;
    color: rgba(197,160,89,0.5);
    margin-bottom: 20px;
    transition: color 0.3s ease, transform 0.3s ease;
}
.stat-card:hover .stat-icon {
    color: #E1B875;
    transform: scale(1.15) rotate(-5deg);
}

/* Number */
.stat-number-wrap {
    display: flex;
    align-items: baseline;
    justify-content: center;
    line-height: 1;
    margin-bottom: 16px;
}
.stat-number {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 6vw, 5.5rem);
    font-weight: 900;
    color: transparent;
    background: linear-gradient(160deg,
        #f5e6b0 0%,
        #E1B875 30%,
        #C5A059 55%,
        #8B6508 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    display: inline-block;
    letter-spacing: -0.02em;
}
.stat-number::after {
    content: attr(data-suffix);
    font-size: 0.4em;
    vertical-align: super;
    margin-left: 3px;
    background: linear-gradient(135deg, #E1B875, #C5A059);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.9;
}

/* Label */
.stat-label {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(232, 209, 167, 0.85);
    margin-bottom: 8px;
    position: relative;
    padding-bottom: 10px;
}
.stat-label::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 20px; height: 1px;
    background: rgba(197,160,89,0.5);
    transition: width 0.3s ease;
}
.stat-card:hover .stat-label::after { width: 36px; }

/* Desc */
.stat-desc {
    font-size: 0.68rem;
    color: rgba(197, 160, 89, 0.38);
    letter-spacing: 0.03em;
    line-height: 1.6;
    font-style: italic;
}

/* Mobile: 2x2 */
@media (max-width: 768px) {
    .stats-section { padding: 60px 0; }
    .stats-grid {
        flex-wrap: wrap;
        max-width: 100%;
    }
    .stat-card {
        flex: 0 0 50%;
        padding: 24px 20px;
        border-bottom: 1px solid rgba(197,160,89,0.1);
    }
    .stat-card:nth-child(1),
    .stat-card:nth-child(3) {
        border-right: 1px solid rgba(197,160,89,0.1);
    }
    .stat-divider { display: none; }
    .stats-eyebrow { margin-bottom: 36px; font-size: 0.58rem; }
    .stats-eyebrow::before, .stats-eyebrow::after { display: none; }
}
@media (max-width: 480px) {
    .stat-card { padding: 20px 16px; }
    .stat-number { font-size: clamp(2.8rem, 12vw, 3.5rem); }
}

`;

const result = before + '\n' + newCSS + '\n' + after;
fs.writeFileSync(cssPath, result, 'utf8');
console.log('Stats CSS fully redesigned!');
