/* ============================================================
   ⚙️ SITE CONFIG — Yến Sào Tám Thủy
   Tất cả tính năng bật/tắt và cấu hình tập trung tại đây.
   
   Lưu ý: Các biến nhạy cảm (webhook URL, SĐT, API key...)
   được đặt trong file .env — KHÔNG hardcode ở đây.
   ============================================================ */

const SITE_CONFIG = {
    // ── Thông tin cửa hàng (lấy từ .env) ────────────────────
    shop: {
        name:    window.ENV?.SITE_NAME || 'Yến Sào Tám Thủy',
        phone:   window.ENV?.PHONE || '0327534965',
        zaloId:  window.ENV?.ZALO || '0327534965',
        email:   window.ENV?.EMAIL || 'cskh@yensaotamthuy.com',
        address: window.ENV?.ADDRESS || 'Đầm Thị Nại, Bình Định',
        siteUrl: window.ENV?.SITE_URL || 'https://yensaotamthuy.vn',
    },

    // ── n8n Webhooks (lấy từ .env) ──────────────────────────
    webhooks: {
        order:      (() => {
            let url = (window.ENV?.WEBHOOK_ORDER && window.ENV.WEBHOOK_ORDER !== '%VITE_N8N_ORDER_WEBHOOK%') ? window.ENV.WEBHOOK_ORDER : '';
            return url.replace('localhost', window.location.hostname);
        })(),
        newsletter: (() => {
            let url = (window.ENV?.WEBHOOK_NEWSLETTER && window.ENV.WEBHOOK_NEWSLETTER !== '%VITE_N8N_NEWSLETTER_WEBHOOK%') ? window.ENV.WEBHOOK_NEWSLETTER : '';
            return url.replace('localhost', window.location.hostname);
        })(),
        chatbot:    (() => {
            let url = (window.ENV?.WEBHOOK_CHATBOT && window.ENV.WEBHOOK_CHATBOT !== '%VITE_N8N_CHATBOT_WEBHOOK%') ? window.ENV.WEBHOOK_CHATBOT : '';
            return url.replace('localhost', window.location.hostname);
        })(),
    },

    // ── Bật / Tắt tính năng ─────────────────────────────────
    features: {
        preloader:      true,   // Màn hình loading khi mở web
        chatbot:        true,   // Trợ lý AI Tám Thủy
        lottiebird:     true,   // Con chim yến bay trên trang
        smoothScroll:   true,   // Cuộn mượt (Lenis)
        goldCursor:     true,   // Con trỏ chuột vàng (desktop)
        floatingBtn:    true,   // Nút "Đặt Hàng Ngay" nổi trên mobile
        hscrollGallery: true,   // Gallery cuộn ngang sản phẩm
        blogSection:    true,   // Phần blog / bài viết
        reviewSection:  true,   // Phần đánh giá khách hàng
    },

    // ── Chatbot AI ──────────────────────────────────────────
    chatbot: {
        maxHistory:  12,            // Số tin nhắn giữ lại (6 cặp hỏi/đáp)
        typingDelay: { min: 600, max: 1500 },  // Delay giả lập gõ chữ (ms)
        soundVolume: 0.6,           // Âm lượng tiếng thông báo (0–1)
    },

    // ── Hiệu ứng & Animation ───────────────────────────────
    animation: {
        preloaderMinTime: 1500,     // Thời gian tối thiểu hiện preloader (ms)
        heroParallax:     true,     // Hiệu ứng parallax trên hero
        revealOnScroll:   true,     // Hiệu ứng hiện dần khi cuộn
    },

    // ── Form đặt hàng ───────────────────────────────────────
    order: {
        minQuantityHu: 4,           // Số hũ tối thiểu khi đặt Yến Chưng
        giftThreshold: 3000000,     // Đơn từ bao nhiêu được tặng quà (VNĐ)
    },
};

// Gắn vào window để các script khác có thể đọc được qua window.SITE_CONFIG
window.SITE_CONFIG = SITE_CONFIG;
