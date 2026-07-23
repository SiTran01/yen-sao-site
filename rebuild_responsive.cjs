const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\css\\style.css';
let css = fs.readFileSync(path, 'utf8');

// Tìm điểm bắt đầu của phần responsive (comment header)
const startMarker = '/* ─── 768px and below — TABLET & MOBILE ─── */';
const startIdx = css.indexOf(startMarker);

if (startIdx === -1) {
    console.log('Start marker not found!');
    process.exit(1);
}

// Cắt phần trước responsive và thay thế toàn bộ phần sau bằng code mới
const before = css.substring(0, startIdx);

const newResponsive = `/* =============================================================
   18. RESPONSIVE OVERRIDES — Mobile First
   ============================================================= */

/* ───── Tablet & Mobile: max-width 767px ───── */
@media (max-width: 767px) {

    /* ── HEADER ── */
    header {
        padding: 0.6rem 1rem !important;
    }
    /* Shrink logo text on mobile */
    header .font-serif.font-black.text-lg {
        font-size: 0.85rem !important;
        letter-spacing: 0.08em !important;
    }
    header img.w-14 {
        width: 2.25rem !important;
        height: 2.25rem !important;
    }

    /* ── HERO ── */
    .hero-pin-container {
        height: 100svh;
    }
    /* Flex layout: column, images on top, text below */
    .hero-pin-container > div {
        flex-direction: column !important;
        justify-content: center !important;
        gap: 0 !important;
        padding-top: 5rem !important;
        padding-left: 1.25rem !important;
        padding-right: 1.25rem !important;
    }
    .hero-pin-container > div > div:first-child {
        order: 1;
        width: 100% !important;
        margin-top: 0 !important;
        flex: 0 0 auto;
    }
    .hero-products-wrapper {
        max-width: 240px !important;
        margin: 0 auto;
    }
    .hero-text-wrapper {
        order: 2;
        width: 100% !important;
        align-items: center !important;
        text-align: center !important;
        padding-left: 0 !important;
        margin-bottom: 0.5rem !important;
        flex: 0 0 auto;
    }
    .hero-title {
        font-size: 2.6rem !important;
        line-height: 1.1 !important;
    }
    .hero-subtitle {
        font-size: 0.55rem !important;
        letter-spacing: 0.25em !important;
    }
    /* Brand sticker — hide on mobile to save space */
    .stamp-animation {
        display: none !important;
    }

    /* ── STATS ── */
    .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    .stat-card + .stat-card::before { display: none; }
    .stat-card { padding: 1.5rem 1rem !important; }
    .stat-number { font-size: clamp(2rem, 8vw, 2.8rem) !important; }
    .stat-label { font-size: 0.7rem !important; }
    .stat-desc  { font-size: 0.65rem !important; }
    .stat-icon  { width: 32px !important; height: 32px !important; margin-bottom: 0.75rem !important; }

    /* ── PRODUCTS (alternating card layout) ── */
    #products {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
    }
    #products > div.container {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }
    #products .text-center.mb-24 { margin-bottom: 2rem !important; }
    #products h2.text-5xl {
        font-size: 2.2rem !important;
    }
    /* Product cards: stack column, reduce padding */
    #products .relative.w-full.max-w-6xl {
        flex-direction: column !important;
        gap: 0 !important;
        margin-bottom: 1.5rem !important;
        border-radius: 1.5rem !important;
    }
    #products .relative.w-full.max-w-6xl .w-full.md\\:w-1\\/2 {
        width: 100% !important;
        order: unset !important;
    }
    /* Text content inside cards */
    #products .p-10, #products .p-10.md\\:p-16 {
        padding: 1.25rem 1rem !important;
    }
    #products h3.text-4xl, #products h3.md\\:text-5xl {
        font-size: 1.6rem !important;
    }
    #products p.text-lg { font-size: 0.9rem !important; }
    #products .mb-10 { margin-bottom: 1.25rem !important; }
    /* Image containers inside product cards */
    #products .p-8, #products .p-8.md\\:p-12 {
        padding: 1rem !important;
    }

    /* ── HORIZONTAL SCROLL — Products ── */
    .hscroll-section {
        height: auto !important;
        overflow: hidden !important;
        cursor: default !important;
    }
    #products-horizontal {
        padding: 0 !important;
    }
    #products-horizontal .hscroll-label,
    #products-horizontal .hscroll-drag-hint {
        display: none !important;
    }
    #products-horizontal .hscroll-more-right { display: none !important; }
    #products-horizontal .hscroll-track {
        display: flex !important;
        flex-direction: row !important;
        height: auto !important;
        min-height: 320px !important;
        overflow-x: scroll !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding: 2rem 1rem 1.5rem !important;
        gap: 0.75rem !important;
        align-items: stretch !important;
        flex-wrap: nowrap !important;
    }
    #products-horizontal .hscroll-track::-webkit-scrollbar { display: none; }
    /* Intro card */
    #products-horizontal .hscroll-track > div:first-child {
        flex-shrink: 0 !important;
        width: 180px !important;
        min-width: 180px !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: 0.5rem !important;
    }
    #products-horizontal .hscroll-track > div:first-child h2 {
        font-size: 2rem !important;
    }
    /* Product cards */
    #products-horizontal .hscroll-card {
        flex-shrink: 0 !important;
        scroll-snap-align: start;
        width: 70vw !important;
        min-width: 200px !important;
        max-width: 260px !important;
        height: auto !important;
        min-height: 280px !important;
        border-radius: 1.25rem !important;
    }

    /* ── HORIZONTAL SCROLL — Blog ── */
    .blog-hscroll-section {
        overflow: hidden !important;
        height: auto !important;
    }
    .blog-hscroll-section .hscroll-label,
    .blog-hscroll-section .hscroll-drag-hint {
        display: none !important;
    }
    .blog-hscroll-section .hscroll-more-right { display: none !important; }
    #blog-grid {
        display: flex !important;
        flex-direction: row !important;
        height: auto !important;
        min-height: 300px !important;
        overflow-x: scroll !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding: 2rem 1rem 1.5rem !important;
        gap: 0.75rem !important;
        align-items: stretch !important;
        flex-wrap: nowrap !important;
    }
    #blog-grid::-webkit-scrollbar { display: none; }
    .blog-hscroll-intro {
        flex-shrink: 0 !important;
        width: 160px !important;
        min-width: 160px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        padding-right: 0.5rem !important;
    }
    .blog-hscroll-intro h2 { font-size: 1.6rem !important; }
    .blog-post-card {
        flex-shrink: 0 !important;
        scroll-snap-align: start;
        width: 70vw !important;
        min-width: 200px !important;
        max-width: 260px !important;
        height: auto !important;
        min-height: 280px !important;
        border-radius: 1.25rem !important;
    }
    /* Mobile swipe hint text at bottom of hscroll sections */
    .blog-hscroll-section::after {
        content: '← Vuốt để xem thêm →';
        display: block;
        text-align: center;
        font-size: 0.6rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(74,44,42,0.45);
        padding: 0.5rem 0 1rem;
        font-weight: 700;
    }

    /* ── ORDER SECTION ── */
    .order-section {
        padding: 3rem 0 !important;
    }
    .order-section-grid {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
    }
    .order-section h2 {
        font-size: clamp(1.6rem, 6vw, 2.2rem) !important;
    }
    .order-section .container {
        padding-left: 1.25rem !important;
        padding-right: 1.25rem !important;
    }
    .form-row { grid-template-columns: 1fr !important; }
    .order-form-card {
        padding: 1.5rem 1rem !important;
        border-radius: 1.25rem !important;
    }
    .trust-badges {
        gap: 0.4rem !important;
        margin-top: 1rem !important;
    }
    .trust-badge {
        font-size: 0.65rem !important;
        padding: 0.3rem 0.6rem !important;
        gap: 4px !important;
    }
    .trust-badge-icon { font-size: 0.8rem !important; }

    /* ── REVIEWS ── */
    #reviews {
        padding-top: 3rem !important;
        padding-bottom: 3rem !important;
    }
    #reviews .container { padding-left: 1rem !important; padding-right: 1rem !important; }
    #reviews .grid { grid-template-columns: 1fr !important; gap: 1rem !important; }

    /* ── FOOTER ── */
    footer { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
    footer .container { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
    footer .grid {
        grid-template-columns: 1fr !important;
        gap: 1.75rem !important;
    }

    /* ── BLOG MODAL ── */
    #blog-modal {
        padding: 0 !important;
        align-items: flex-end !important;
    }
    #blog-modal > div:nth-child(2) {
        max-height: 93vh !important;
        border-radius: 1.5rem 1.5rem 0 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    #blog-modal-content { padding: 1.25rem 1rem !important; }
    #blog-modal-close { top: 1rem !important; right: 1rem !important; }

    /* ── CHATBOT ── */
    #ai-chat-bubble {
        bottom: 5rem !important;
        right: 0.75rem !important;
    }
    #ai-chat-window {
        width: calc(100vw - 1rem) !important;
        right: 0.5rem !important;
        bottom: 8.5rem !important;
        max-height: 60vh !important;
    }

    /* ── FLOATING ORDER BUTTON ── */
    .floating-order-btn {
        display: flex !important;
        left: 1rem !important;
        right: 1rem !important;
        bottom: 0.75rem !important;
        transform: translateX(0) translateY(100px) !important;
        width: calc(100% - 2rem);
        justify-content: center;
        border-radius: 1.5rem;
        padding: 0.875rem 1.25rem;
        font-size: 0.8rem;
    }
    .floating-order-btn.is-visible {
        transform: translateX(0) translateY(0) !important;
    }
}

/* ───── Small phones only: max-width 430px ───── */
@media (max-width: 430px) {
    .hero-title { font-size: 2.2rem !important; }
    .hero-products-wrapper { max-width: 200px !important; }

    .stats-grid { grid-template-columns: 1fr !important; }
    .stat-card { padding: 1.25rem 1rem !important; }

    #products h2.text-5xl { font-size: 1.8rem !important; }
    #products h3 { font-size: 1.4rem !important; }

    #products-horizontal .hscroll-card,
    .blog-post-card {
        width: 80vw !important;
        max-width: 240px !important;
    }

    .order-section h2 { font-size: 1.5rem !important; }
    .order-form-card { padding: 1.25rem 0.875rem !important; }
}

/* ───── Desktop only: hide floating order btn ───── */
@media (min-width: 768px) {
    .floating-order-btn { display: none !important; }
}

/* ───── Feature boxes responsive ───── */
@media (max-width: 1024px) {
    .feature-box-container { grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .feature-box { padding: 14px; gap: 10px; }
    .feature-icon { width: 38px; }
    .feature-text { font-size: 0.82rem; }
    .feature-text strong { font-size: 0.92rem; }
}
@media (max-width: 600px) {
    .feature-box-container { grid-template-columns: 1fr; gap: 10px; }
    .feature-box { padding: 12px; }
}
`;

css = before + newResponsive;
fs.writeFileSync(path, css, 'utf8');
console.log('Responsive CSS replaced successfully!');
console.log('Total lines:', css.split('\n').length);
