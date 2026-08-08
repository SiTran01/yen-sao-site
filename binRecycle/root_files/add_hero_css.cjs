const fs = require('fs');
const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const heroCSS = `

/* ============================================================
   HERO — Dark Luxury Cinematic Redesign
   ============================================================ */
.hero-new {
    min-height: 100vh;
    background:
        linear-gradient(135deg, #0D0503 0%, #1A0805 35%, #2C1208 60%, #1A0805 80%, #0D0503 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 50;
}

/* Ambient glow spheres */
.hero-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
}
.hero-glow-1 {
    width: 600px; height: 600px;
    top: -100px; right: -100px;
    background: radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%);
    animation: heroGlowPulse 6s ease-in-out infinite alternate;
}
.hero-glow-2 {
    width: 400px; height: 400px;
    bottom: 0; left: -80px;
    background: radial-gradient(circle, rgba(139,101,8,0.12) 0%, transparent 70%);
    animation: heroGlowPulse 8s ease-in-out infinite alternate-reverse;
}
.hero-glow-3 {
    width: 300px; height: 300px;
    top: 40%; left: 40%;
    background: radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%);
    animation: heroGlowPulse 10s ease-in-out infinite alternate;
}
@keyframes heroGlowPulse {
    0%   { opacity: 0.6; transform: scale(1); }
    100% { opacity: 1;   transform: scale(1.15); }
}

/* Grain */
.hero-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
}

/* Top gold line */
.hero-top-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(197,160,89,0.4) 20%, #C5A059 50%, rgba(197,160,89,0.4) 80%, transparent);
    position: relative; z-index: 5;
}

/* Inner layout */
.hero-new-inner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    padding: 80px 80px 100px;
    position: relative; z-index: 5;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* LEFT — text col */
.hero-text-col {
    flex: 0 0 50%;
    max-width: 580px;
    display: flex;
    flex-direction: column;
    gap: 0;
}

/* Eyebrow */
.hero-eyebrow-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
}
.hero-eyebrow-line {
    flex: 0 0 32px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(197,160,89,0.6));
}
.hero-eyebrow-line:last-child {
    background: linear-gradient(90deg, rgba(197,160,89,0.6), transparent);
}
.hero-eyebrow-text {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: rgba(197,160,89,0.7);
    white-space: nowrap;
}

/* Main title */
.hero-new-title {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 28px;
    line-height: 0.92;
}
.hero-title-row {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: clamp(4.5rem, 9vw, 7.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
}
.hero-title-plain {
    color: #E8D1A7;
}
.hero-title-italic {
    font-style: italic;
    background: linear-gradient(135deg, #f5e6b0 0%, #E1B875 30%, #C5A059 65%, #8B6508 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero-title-row-2 {
    margin-top: -8px;
    margin-left: 48px; /* Asymmetric indent — editorial look */
}

/* Tagline */
.hero-tagline {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.95rem;
    line-height: 1.75;
    color: rgba(232,209,167,0.55);
    margin-bottom: 40px;
    max-width: 440px;
}
.hero-tagline strong { color: rgba(197,160,89,0.85); font-weight: 600; }

/* CTA buttons */
.hero-cta-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 48px;
    flex-wrap: wrap;
}
.hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    background: linear-gradient(135deg, #C5A059, #E1B875, #C5A059);
    background-size: 200% auto;
    border-radius: 50px;
    color: #1A0805;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.4s ease;
    box-shadow: 0 8px 32px rgba(197,160,89,0.4), 0 2px 8px rgba(0,0,0,0.3);
    white-space: nowrap;
}
.hero-cta-primary:hover {
    background-position: right center;
    box-shadow: 0 12px 48px rgba(197,160,89,0.55), 0 4px 16px rgba(0,0,0,0.4);
    transform: translateY(-2px);
}
.hero-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 15px 28px;
    border: 1px solid rgba(197,160,89,0.35);
    border-radius: 50px;
    color: rgba(232,209,167,0.8);
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.35s ease;
    backdrop-filter: blur(8px);
    background: rgba(197,160,89,0.06);
    white-space: nowrap;
}
.hero-cta-secondary:hover {
    border-color: rgba(197,160,89,0.7);
    background: rgba(197,160,89,0.12);
    color: #E1B875;
    transform: translateY(-2px);
}

/* Trust row */
.hero-trust-row {
    display: flex;
    align-items: center;
    gap: 0;
}
.hero-trust-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 24px;
}
.hero-trust-item:first-child { padding-left: 0; }
.hero-trust-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 900;
    color: #E1B875;
    line-height: 1;
}
.hero-trust-num sup {
    font-size: 0.55em;
    vertical-align: super;
    color: rgba(197,160,89,0.7);
}
.hero-trust-label {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(197,160,89,0.45);
    letter-spacing: 0.06em;
    text-transform: uppercase;
}
.hero-trust-divider {
    width: 1px;
    height: 36px;
    background: linear-gradient(to bottom, transparent, rgba(197,160,89,0.25), transparent);
    flex-shrink: 0;
}

/* RIGHT — image col */
.hero-img-col {
    flex: 0 0 48%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Decorative circle behind products */
.hero-img-circle {
    position: absolute;
    width: 420px; height: 420px;
    border-radius: 50%;
    border: 1px solid rgba(197,160,89,0.12);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}
.hero-img-circle::before {
    content: '';
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    border: 1px solid rgba(197,160,89,0.07);
}

/* Brand badge on image */
.hero-brand-badge {
    position: absolute;
    bottom: -10%;
    right: -8%;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(26,8,5,0.85);
    border: 1px solid rgba(197,160,89,0.3);
    border-radius: 14px;
    padding: 12px 16px;
    backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.hero-brand-logo {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(197,160,89,0.1);
    border: 1px solid rgba(197,160,89,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.hero-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #E8D1A7;
    letter-spacing: 0.08em;
}
.hero-brand-sub {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(197,160,89,0.6);
}

/* Scroll cue */
.hero-scroll-cue {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.3s ease;
}
.hero-scroll-cue:hover { opacity: 1; }
.hero-scroll-text {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(197,160,89,0.7);
}
.hero-scroll-arrow {
    width: 32px; height: 32px;
    border: 1px solid rgba(197,160,89,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: rgba(197,160,89,0.7);
    animation: scrollBounce 2s ease-in-out infinite;
}
@keyframes scrollBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
}

/* Responsive */
@media (max-width: 1024px) {
    .hero-new-inner { padding: 80px 40px 100px; gap: 24px; }
    .hero-title-row-2 { margin-left: 24px; }
    .hero-img-circle { width: 340px; height: 340px; }
}
@media (max-width: 768px) {
    .hero-new-inner {
        flex-direction: column-reverse;
        padding: 24px 24px 80px;
        gap: 32px;
        justify-content: center;
    }
    .hero-text-col { max-width: 100%; }
    .hero-img-col { flex: 0 0 auto; width: 100%; max-width: 360px; }
    .hero-title-row { font-size: clamp(3rem, 14vw, 5rem); }
    .hero-title-row-2 { margin-left: 24px; }
    .hero-eyebrow-text { font-size: 0.58rem; letter-spacing: 0.28em; }
    .hero-tagline { font-size: 0.88rem; }
    .hero-cta-row { gap: 12px; }
    .hero-trust-item { padding: 0 14px; }
    .hero-trust-num { font-size: 1.3rem; }
    .hero-brand-badge { bottom: -5%; right: -4%; padding: 8px 12px; }
    .hero-img-circle { width: 280px; height: 280px; }
}
@media (max-width: 480px) {
    .hero-new-inner { padding: 20px 20px 72px; }
    .hero-title-row { font-size: clamp(2.8rem, 16vw, 4rem); }
    .hero-cta-primary, .hero-cta-secondary { font-size: 0.75rem; padding: 13px 20px; }
    .hero-trust-row { gap: 0; }
    .hero-trust-item { padding: 0 10px; }
}
`;

fs.writeFileSync(cssPath, css + heroCSS, 'utf8');
console.log('Hero CSS added!');
