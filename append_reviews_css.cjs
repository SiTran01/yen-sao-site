const fs = require('fs');

const cssPath = 'd:/CODEs/tamthuy/yen-sao-site/src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const reviewsCSS = `

/* ============================================================
   REVIEWS SECTION — Luxury Editorial Redesign
   ============================================================ */
.reviews-section {
    background: #fff5e8;
    padding: 80px 0 96px;
    overflow: hidden;
}
.reviews-header {
    text-align: center;
    margin-bottom: 48px;
    padding: 0 24px;
}
.reviews-eyebrow {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: #C5A059;
    margin-bottom: 16px;
}
.reviews-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900;
    color: #4A2C2A;
    margin-bottom: 20px;
    line-height: 1.15;
}
.reviews-title-num { color: #C5A059; font-style: italic; }
.reviews-title-line {
    width: 48px; height: 2px;
    background: linear-gradient(90deg, #C5A059, #E1B875, #C5A059);
    margin: 0 auto; border-radius: 2px;
}
.reviews-summary {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid rgba(197,160,89,0.18);
    border-radius: 20px;
    max-width: 780px;
    margin: 0 auto 56px;
    padding: 28px 40px;
    box-shadow: 0 8px 40px rgba(74,44,42,0.06);
}
.reviews-summary-score { text-align: center; flex-shrink: 0; padding-right: 32px; }
.reviews-big-score {
    font-family: 'Playfair Display', serif;
    font-size: 3.8rem; font-weight: 900; color: #4A2C2A;
    line-height: 1; display: block;
}
.reviews-stars-row {
    color: #E1A800; font-size: 1.1rem; letter-spacing: 2px; margin: 6px 0 4px;
}
.reviews-score-label { font-size: 0.68rem; color: rgba(74,44,42,0.45); }
.reviews-summary-divider {
    width: 1px; height: 64px; flex-shrink: 0; margin: 0 32px;
    background: linear-gradient(to bottom, transparent, rgba(197,160,89,0.3), transparent);
}
.reviews-bars { display: flex; flex-direction: column; gap: 8px; min-width: 180px; }
.reviews-bar-row { display: flex; align-items: center; gap: 8px; }
.reviews-bar-label { font-size: 0.68rem; color: rgba(74,44,42,0.5); width: 20px; flex-shrink:0; text-align:right; }
.reviews-bar-track { flex:1; height:5px; background:rgba(197,160,89,0.12); border-radius:99px; overflow:hidden; }
.reviews-bar-fill { height:100%; background: linear-gradient(90deg, #C5A059, #E1B875); border-radius:99px; }
.reviews-bar-pct { font-size:0.65rem; color:rgba(74,44,42,0.4); width:28px; flex-shrink:0; }
.reviews-trust-badges { display:flex; flex-direction:column; gap:16px; }
.reviews-trust-item { display:flex; align-items:center; gap:10px; }
.reviews-trust-icon { font-size:1.3rem; flex-shrink:0; }
.reviews-trust-text { font-size:0.75rem; font-weight:700; color:#4A2C2A; line-height:1.4; }
.reviews-trust-text small { font-weight:400; color:rgba(74,44,42,0.5); font-size:0.65rem; display:block; }

/* Cards */
.reviews-grid-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
.reviews-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.rv-card {
    border-radius: 20px; padding: 32px 28px 24px;
    position: relative; display:flex; flex-direction:column;
    transition: transform 0.35s ease, box-shadow 0.35s ease; overflow:hidden;
}
.rv-card:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(74,44,42,0.14); }
.rv-card--light {
    background:#fff; border:1px solid rgba(197,160,89,0.14);
    box-shadow:0 4px 24px rgba(74,44,42,0.05);
}
.rv-card--dark {
    background: linear-gradient(145deg, #3D1A0A, #2d1208);
    box-shadow:0 4px 32px rgba(74,44,42,0.2);
}
.rv-quote-mark {
    font-family:'Playfair Display',serif; font-size:5rem; line-height:0.8;
    color:rgba(197,160,89,0.15); margin-bottom:4px; font-style:italic;
    user-select:none; height:36px; overflow:hidden;
}
.rv-quote-mark--light { color:rgba(255,255,255,0.1); }
.rv-stars { color:#E1A800; font-size:0.85rem; letter-spacing:2px; margin-bottom:14px; }
.rv-stars--light { color:#E1B875; }
.rv-text { font-size:0.875rem; line-height:1.75; color:rgba(74,44,42,0.72); flex:1; margin-bottom:20px; font-style:italic; }
.rv-text--light { color:rgba(255,255,255,0.72); }
.rv-footer { display:flex; align-items:center; gap:12px; padding-top:16px; border-top:1px solid rgba(197,160,89,0.12); }
.rv-footer--dark { border-color:rgba(255,255,255,0.08); }
.rv-avatar {
    width:38px; height:38px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-family:'Be Vietnam Pro',sans-serif; font-weight:800;
    font-size:0.75rem; color:#fff; flex-shrink:0;
}
.rv-avatar--gold  { background:linear-gradient(135deg,#E1B875,#8B6508); }
.rv-avatar--dark  { background:linear-gradient(135deg,#4A2C2A,#800020); }
.rv-avatar--gold2 { background:linear-gradient(135deg,#C5A059,#E1B875); }
.rv-avatar--dark2 { background:linear-gradient(135deg,#800020,#C5A059); }
.rv-avatar--mix   { background:linear-gradient(135deg,#4A2C2A,#C5A059); }
.rv-info { flex:1; min-width:0; }
.rv-name { font-family:'Be Vietnam Pro',sans-serif; font-weight:700; font-size:0.8rem; color:#4A2C2A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rv-name--light { color:rgba(255,255,255,0.92); }
.rv-meta { font-size:0.68rem; color:rgba(74,44,42,0.45); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rv-meta--light { color:rgba(255,255,255,0.35); }
.rv-badge {
    font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;
    color:#C5A059; background:rgba(197,160,89,0.1); border:1px solid rgba(197,160,89,0.25);
    border-radius:20px; padding:3px 8px; white-space:nowrap; flex-shrink:0;
}
.rv-badge--light { color:#E1B875; background:rgba(225,184,117,0.12); border-color:rgba(225,184,117,0.2); }

@media (max-width:900px) {
    .reviews-grid { grid-template-columns:repeat(2,1fr); }
    .reviews-summary { flex-direction:column; gap:20px; padding:24px 20px; }
    .reviews-summary-divider { width:60px; height:1px; margin:4px 0; }
    .reviews-summary-score { padding:0; }
    .reviews-big-score { font-size:3rem; }
}
@media (max-width:600px) {
    .reviews-section { padding:56px 0 72px; }
    .reviews-grid { grid-template-columns:1fr; }
    .rv-card { padding:24px 20px 18px; }
    .reviews-grid-wrap { padding:0 16px; }
    .reviews-summary { margin:0 16px 40px; }
}
`;

fs.writeFileSync(cssPath, css + reviewsCSS, 'utf8');
console.log('Reviews CSS appended!');
