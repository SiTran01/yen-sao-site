/* ============================================================
   âš™ï¸ SITE CONFIG â€” Yáº¿n SÃ o TÃ¡m Thá»§y
   Táº¥t cáº£ tÃ­nh nÄƒng báº­t/táº¯t vÃ  cáº¥u hÃ¬nh táº­p trung táº¡i Ä‘Ã¢y.
   
   LÆ°u Ã½: CÃ¡c biáº¿n nháº¡y cáº£m (webhook URL, SÄT, API key...)
   Ä‘Æ°á»£c Ä‘áº·t trong file .env â€” KHÃ”NG hardcode á»Ÿ Ä‘Ã¢y.
   ============================================================ */

const SITE_CONFIG = {
    // â”€â”€ ThÃ´ng tin cá»­a hÃ ng (láº¥y tá»« .env) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    shop: {
        name:    window.ENV?.SITE_NAME || 'Yáº¿n SÃ o TÃ¡m Thá»§y',
        phone:   window.ENV?.PHONE || '0327534965',
        zaloId:  window.ENV?.ZALO || '0327534965',
        email:   window.ENV?.EMAIL || 'cskh@yensaotamthuy.com',
        address: window.ENV?.ADDRESS || 'Äáº§m Thá»‹ Náº¡i, BÃ¬nh Äá»‹nh',
        siteUrl: window.ENV?.SITE_URL || '%VITE_SITE_URL%',
    },

    // â”€â”€ SEO & Meta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    seo: {
        title:   'Yáº¿n SÃ o TÃ¡m Thá»§y | Tinh Hoa Yáº¿n Viá»‡t',
        favicon: './assets/images/avt-gold.svg',
    },

    // â”€â”€ n8n Webhooks (láº¥y tá»« .env) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // â”€â”€ Báº­t / Táº¯t tÃ­nh nÄƒng â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    features: {
        preloader:      true,   // MÃ n hÃ¬nh loading khi má»Ÿ web
        chatbot:        true,   // Trá»£ lÃ½ AI TÃ¡m Thá»§y
        lottiebird:     false,   // Con chim yáº¿n bay trÃªn trang
        smoothScroll:   true,   // Cuá»™n mÆ°á»£t (Lenis)
        goldCursor:     false,   // Con trá» chuá»™t vÃ ng (desktop)
        floatingBtn:    false,    // NÃºt "Äáº·t HÃ ng Ngay" ná»•i trÃªn mobile
        hscrollGallery: true,   // Gallery cuá»™n ngang sáº£n pháº©m
        blogSection:    true,   // Pháº§n blog / bÃ i viáº¿t
        reviewSection:  true,   // Pháº§n Ä‘Ã¡nh giÃ¡ khÃ¡ch hÃ ng
        orderForm:      true,   // Form Ä‘áº·t hÃ ng
    },

    // â”€â”€ Chatbot AI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    chatbot: {
        autoGreeting: true,         // Báº­t/táº¯t tá»± Ä‘á»™ng hiá»‡n lá»i chÃ o lÃºc má»›i vÃ o trang (Xin chÃ o! MÃ¬nh lÃ ...)
        autoContextual: false,       // Báº­t/táº¯t tá»± Ä‘á»™ng nháº£y lá»i chÃ o tÆ° váº¥n khi cuá»™n Ä‘áº¿n tá»«ng sáº£n pháº©m
        maxHistory:  12,            // Sá»‘ tin nháº¯n giá»¯ láº¡i (6 cáº·p há»i/Ä‘Ã¡p)
        // systemPrompt: `Báº¡n lÃ  trá»£ lÃ½ tÆ° váº¥n yáº¿n sÃ o cá»§a "Yáº¿n SÃ o TÃ¡m Thá»§y" (yensaotamthuy.vn). Tráº£ lá»i thÃ¢n thiá»‡n, ngáº¯n gá»n, tháº¥u hiá»ƒu khÃ¡ch hÃ ng.`,
        greetingDelay: 1000,        // Thá»i gian chá» trÆ°á»›c khi tá»± Ä‘á»™ng hiá»‡n lá»i chÃ o (ms)
        greetingTimeout: 10000,      // Thá»i gian tá»± Ä‘á»™ng áº©n lá»i chÃ o (ms), 0 Ä‘á»ƒ khÃ´ng tá»± áº©n
        typingDelay: { min: 600, max: 1500 },  // Delay giáº£ láº­p gÃµ chá»¯ (ms)
        soundVolume: 0.6,           // Ã‚m lÆ°á»£ng tiáº¿ng thÃ´ng bÃ¡o (0â€“1)
        
        // Cáº¥u hÃ¬nh lá»i chÃ o tá»± Ä‘á»™ng theo tá»«ng vÃ¹ng hiá»ƒn thá»‹ (cuá»™n tá»›i Ä‘Ã¢u hiá»‡n tá»›i Ä‘Ã³)
        contextualTriggers: [
            {
                selector: '#v-yen-tho, .hscroll-product-card[data-label="Yáº¿n ThÃ´ Â· Tá»± NhiÃªn"]',
                delay: 8000,
                message: "Yáº¿n thÃ´ giá»¯ trá»n 100% vi cháº¥t tá»± nhiÃªn, ráº¥t há»£p náº¿u báº¡n cÃ³ thá»i gian tá»± nháº·t lÃ´ng. Báº¡n muá»‘n mÃ¬nh gá»­i video hÆ°á»›ng dáº«n cÃ¡ch nháº·t lÃ´ng yáº¿n nhanh khÃ´ng? ",
                id: "yen-tho"
            },
            {
                selector: '#v-yen-tuoi, .hscroll-product-card[data-label="Yáº¿n TÆ°Æ¡i Â· Cao Cáº¥p"]',
                delay: 8000,
                message: "DÃ²ng yáº¿n tÆ°Æ¡i nÃ y TÃ¡m Thá»§y Ä‘Ã£ nháº·t lÃ´ng hoÃ n toÃ n thá»§ cÃ´ng, báº¡n mua vá» lÃ  chÆ°ng Ä‘Æ°á»£c ngay. MÃ¬nh tÆ° váº¥n thÃªm cho báº¡n nhÃ©? ",
                id: "yen-tuoi"
            },
            {
                selector: '#v-yen-tinh-che, .hscroll-product-card[data-label="Yáº¿n Tinh Cháº¿ Â· Ã‰p Tá»•"]',
                delay: 8000,
                message: "Yáº¿n tinh cháº¿ Ã©p tá»• lÃ  mÃ³n quÃ  sá»©c khá»e cá»±c ká»³ sang trá»ng vÃ  Ã½ nghÄ©a. Báº¡n Ä‘á»‹nh mua Ä‘á»ƒ sá»­ dá»¥ng hay mang Ä‘i biáº¿u táº·ng áº¡? ",
                id: "yen-tinh-che"
            },
            {
                selector: '.hscroll-product-card[data-label="HÅ© Yáº¿n Â· ChÆ°ng Sáºµn"]',
                delay: 7000,
                message: "Yáº¿n chÆ°ng sáºµn cá»±c ká»³ tiá»‡n lá»£i Ä‘á»ƒ bá»“i bá»• sá»©c khá»e má»—i ngÃ y hoáº·c lÃ m quÃ  táº·ng. Báº¡n Ä‘á»‹nh mua dÃ¹ng hay biáº¿u áº¡? ",
                id: "yen-chung"
            },
            {
                selector: '#blog',
                delay: 8000,
                message: "Báº¡n Ä‘ang tÃ¬m hiá»ƒu kiáº¿n thá»©c vá» yáº¿n sÃ o? Cá»© há»i mÃ¬nh báº¥t ká»³ tháº¯c máº¯c nÃ o vá» cÃ¡ch dÃ¹ng, cÃ¡ch chÆ°ng hay cÃ´ng dá»¥ng nhÃ©! ",
                id: "blog-section"
            },
            {
                selector: '#order',
                delay: 8000,
                message: "Báº¡n Ä‘ang Ä‘iá»n form Ä‘áº·t hÃ ng pháº£i khÃ´ng? Náº¿u cÃ³ tháº¯c máº¯c gÃ¬ vá» giÃ¡ cáº£ hay phÃ¢n loáº¡i sáº£n pháº©m, cá»© há»i mÃ¬nh nhÃ©! ",
                id: "order-section"
            },
            {
                selector: 'footer',
                delay: 5000,
                message: "Báº¡n cáº§n há»— trá»£ thÃªm thÃ´ng tin gÃ¬ khÃ´ng? Äá»«ng ngáº¡i nháº¯n tin cho mÃ¬nh nhÃ©! ",
                id: "footer-section"
            }
        ]
    },

    // â”€â”€ Hiá»‡u á»©ng & Animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    animation: {
        preloaderMinTime: 15000,     // Thá»i gian tá»‘i thiá»ƒu hiá»‡n preloader (ms)
        heroParallax:     true,     // Hiá»‡u á»©ng parallax trÃªn hero
        revealOnScroll:   true,     // Hiá»‡u á»©ng hiá»‡n dáº§n khi cuá»™n
    },

    // â”€â”€ Form Ä‘áº·t hÃ ng â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    order: {
        minQuantityHu: 4,           // Sá»‘ hÅ© tá»‘i thiá»ƒu khi Ä‘áº·t Yáº¿n ChÆ°ng
        giftThreshold: 3000000,     // ÄÆ¡n tá»« bao nhiÃªu Ä‘Æ°á»£c táº·ng quÃ  (VNÄ)
    },
};

// Gáº¯n vÃ o window Ä‘á»ƒ cÃ¡c script khÃ¡c cÃ³ thá»ƒ Ä‘á»c Ä‘Æ°á»£c qua window.SITE_CONFIG
window.SITE_CONFIG = SITE_CONFIG;
