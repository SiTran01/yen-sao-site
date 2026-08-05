const fs = require('fs');
let css = fs.readFileSync('src/css/style.css', 'utf8');

const startMarker = '/* ─── Hero Content Animations (Eyebrow, Tagline, CTAs, Trust) ─── */';
const idx = css.indexOf(startMarker);

if (idx !== -1) {
    const fixedBlock = `/* ─── Hero Content Animations (Eyebrow, Tagline, CTAs, Trust) ─── */
.hero-eyebrow-wrap,
.hero-tagline,
.hero-cta-row,
.hero-trust-row {
    opacity: 0;
    transform: translateY(20px);
    will-change: opacity, transform;
}

.hero-text-animate .hero-eyebrow-wrap {
    animation: hero-fade-in-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 0.2s forwards;
}
.hero-text-animate .hero-tagline {
    animation: hero-fade-in-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 1.5s forwards;
}
.hero-text-animate .hero-cta-row {
    animation: 
        hero-fade-in-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 1.7s forwards,
        float-horizontal-gentle 5s ease-in-out 2.5s infinite forwards;
}
.hero-text-animate .hero-trust-row {
    animation: hero-fade-in-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 1.9s forwards;
}

@keyframes hero-fade-in-up {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
    css = css.slice(0, idx) + fixedBlock;
    fs.writeFileSync('src/css/style.css', css);
    console.log('Fixed CSS block');
} else {
    console.log('Marker not found');
}
