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

    // ── SEO & Meta ──────────────────────────────────────────
    seo: {
        title:   'Yến Sào Tám Thủy | Tinh Hoa Yến Việt',
        favicon: './assets/images/avt-gold.svg',
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
        lottiebird:     false,   // Con chim yến bay trên trang
        smoothScroll:   true,   // Cuộn mượt (Lenis)
        goldCursor:     false,   // Con trỏ chuột vàng (desktop)
        floatingBtn:    false,   // Nút "Đặt Hàng Ngay" nổi trên mobile
        hscrollGallery: true,   // Gallery cuộn ngang sản phẩm
        blogSection:    true,   // Phần blog / bài viết
        reviewSection:  true,   // Phần đánh giá khách hàng
        orderForm:      true,   // Form đặt hàng
    },

    // ── Chatbot AI ──────────────────────────────────────────
    chatbot: {
        maxHistory:  12,            // Số tin nhắn giữ lại (6 cặp hỏi/đáp)
        // systemPrompt: `Bạn là trợ lý tư vấn yến sào của "Yến Sào Tám Thủy" (yensaotamthuy.vn). Trả lời thân thiện, ngắn gọn, thấu hiểu khách hàng.`,
        greetingDelay: 1000,        // Thời gian chờ trước khi tự động hiện lời chào (ms)
        greetingTimeout: 10000,      // Thời gian tự động ẩn lời chào (ms), 0 để không tự ẩn
        typingDelay: { min: 600, max: 1500 },  // Delay giả lập gõ chữ (ms)
        soundVolume: 0.6,           // Âm lượng tiếng thông báo (0–1)
        
        // Cấu hình lời chào tự động theo từng vùng hiển thị (cuộn tới đâu hiện tới đó)
        contextualTriggers: [
            {
                selector: '#v-yen-tho, .hscroll-product-card[data-label="Yến Thô · Tự Nhiên"]',
                delay: 8000,
                message: "Yến thô giữ trọn 100% vi chất tự nhiên, rất hợp nếu bạn có thời gian tự nhặt lông. Bạn muốn mình gửi video hướng dẫn cách nhặt lông yến nhanh không? ",
                id: "yen-tho"
            },
            {
                selector: '#v-yen-tuoi, .hscroll-product-card[data-label="Yến Tươi · Cao Cấp"]',
                delay: 8000,
                message: "Dòng yến tươi này Tám Thủy đã nhặt lông hoàn toàn thủ công, bạn mua về là chưng được ngay. Mình tư vấn thêm cho bạn nhé? ",
                id: "yen-tuoi"
            },
            {
                selector: '#v-yen-tinh-che, .hscroll-product-card[data-label="Yến Tinh Chế · Ép Tổ"]',
                delay: 8000,
                message: "Yến tinh chế ép tổ là món quà sức khỏe cực kỳ sang trọng và ý nghĩa. Bạn định mua để sử dụng hay mang đi biếu tặng ạ? ",
                id: "yen-tinh-che"
            },
            {
                selector: '.hscroll-product-card[data-label="Hũ Yến · Chưng Sẵn"]',
                delay: 7000,
                message: "Yến chưng sẵn cực kỳ tiện lợi để bồi bổ sức khỏe mỗi ngày hoặc làm quà tặng. Bạn định mua dùng hay biếu ạ? ",
                id: "yen-chung"
            },
            {
                selector: '#blog',
                delay: 8000,
                message: "Bạn đang tìm hiểu kiến thức về yến sào? Cứ hỏi mình bất kỳ thắc mắc nào về cách dùng, cách chưng hay công dụng nhé! ",
                id: "blog-section"
            },
            {
                selector: '#order',
                delay: 8000,
                message: "Bạn đang điền form đặt hàng phải không? Nếu có thắc mắc gì về giá cả hay phân loại sản phẩm, cứ hỏi mình nhé! ",
                id: "order-section"
            },
            {
                selector: 'footer',
                delay: 5000,
                message: "Bạn cần hỗ trợ thêm thông tin gì không? Đừng ngại nhắn tin cho mình nhé! ",
                id: "footer-section"
            }
        ]
    },

    // ── Hiệu ứng & Animation ───────────────────────────────
    animation: {
        preloaderMinTime: 15000,     // Thời gian tối thiểu hiện preloader (ms)
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
