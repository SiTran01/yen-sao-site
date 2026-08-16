/**
 * script.js — Yến Sào Tám Thủy
 * Cấu trúc file:
 *  01. DATA — Product data source
 *  02. UTILITIES — Helpers dùng chung
 *  03. GSAP & LENIS SETUP — Smooth scroll engine
 *  04. PRELOADER — Ẩn preloader sau khi trang load
 *  05. PAGE INIT — DOMContentLoaded main setup
 *  06. HERO — Parallax & scroll animations
 *  07. CHIM YẾN — GSAP Bezier arc bird animation
 *  08. CUSTOM GOLD CURSOR — Awwwards style cursor
 *  09. HORIZONTAL SCROLL GALLERY — Wheel → ngang
 *  10. STATS COUNTER — Animated number counting
 *  11. ORDER FORM — n8n Webhook integration
 *  12. FLOATING ORDER BUTTON — Mobile sticky
 *  13. ORDER SECTION ANIMATION — GSAP entrance
 *  14. FAQ ACCORDION — Toggle với animation
 *  15. TESTIMONIALS ANIMATION — GSAP stagger
 *  16. NEWSLETTER FORM — Footer email → n8n
 */


/* ============================================================
   01. DATA — Product data source
   Thêm/sửa sản phẩm tại đây
   ============================================================ */
/* Các sản phẩm hiện tại được quản lý bởi YEN_SAO_DB trong file database.js */
/* ============================================================
   02. UTILITIES — Helpers dùng chung
   ============================================================ */

/** ---- Mobile Menu Open/Close ---- */
function openMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!menu || !backdrop) return;
    menu.style.transform = 'translateX(0%)';
    backdrop.style.background = 'rgba(26, 8, 5, 0.6)';
    backdrop.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('hamburger-open');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!menu || !backdrop) return;
    menu.style.transform = 'translateX(110%)';
    backdrop.style.background = 'rgba(26, 8, 5, 0)';
    backdrop.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    document.body.classList.remove('hamburger-open');
}

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

/** Format số thành tiền VNĐ (ví dụ: 3.500.000 ₫) */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/** Tạo HTML string cho các ngôi sao rating */
const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) =>
        `<svg class="w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>`
    ).join('');
};

/** Render danh sách sản phẩm vào #product-grid */
const renderProducts = () => {
    const container = document.getElementById('product-grid');
    if (!container) return;

    container.innerHTML = YEN_SAO_DB.products.map(product => `
        <div class="group product-card-premium card-oriental rounded-xl flex flex-col">
            <!-- Image & Tag -->
            <div class="relative aspect-[4/3] overflow-hidden cursor-pointer">
                <div class="absolute top-0 left-0 bg-brand-red text-white text-xs font-bold px-3 py-1 z-10 rounded-br-lg uppercase tracking-wider">
                    ${product.tag}
                </div>
                <picture>
                    <source
                        srcset="${product.image.replace('.webp','-400w.webp')} 400w, ${product.image} 800w"
                        sizes="(max-width: 640px) 400px, 800px"
                        type="image/webp">
                    <img src="${product.image}" alt="${product.name} — Yến Sào Tám Thủy" class="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="300">
                </picture>

                <!-- Quick Action Overlay -->
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div class="btn-buy-now">
                        <a href="https://zalo.me/${window.SITE_CONFIG?.shop?.zaloId || '0327534965'}" class="bg-white text-brand-brown px-7 py-3 rounded-full font-bold shadow-xl hover:bg-brand-red hover:text-white transition-colors block">
                            Mua Ngay
                        </a>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="p-5 flex flex-col flex-grow">
                <div class="flex items-center gap-1 mb-2">
                    <div class="flex">${renderStars(Math.floor(product.stars))}</div>
                    <span class="text-xs text-gray-500 ml-2">(${product.reviews} đánh giá)</span>
                </div>

                <h3 class="font-sans font-bold text-lg text-brand-brown mb-2 line-clamp-2 hover:text-brand-red transition-colors cursor-pointer">${product.name}</h3>

                <!-- Features -->
                <ul class="text-xs text-gray-500 mb-4 space-y-1">
                    ${product.features.map(f => `<li class="flex items-center gap-1"><span class="text-brand-gold">❖</span> ${f}</li>`).join('')}
                </ul>

                <div class="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                    <div>
                        <p class="text-xs text-gray-400 line-through mb-1">${formatCurrency(product.original_price)}</p>
                        <p class="text-xl font-bold text-brand-red">${formatCurrency(product.price)}</p>
                    </div>
                    <button class="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center hover:bg-brand-red transition-colors shadow-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};


/* ============================================================
   03. GSAP & LENIS SETUP — Smooth scroll engine
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

const lenis = window.SITE_CONFIG?.features?.smoothScroll ? new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    smooth: true,
    smoothTouch: false,
}) : null;

// Kết nối Lenis với GSAP ticker (1 RAF loop duy nhất, không dùng RAF thủ công)
// Dùng gsap.ticker làm driver để tránh chạy 2 RAF loops song song
if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
}

/** Smooth scroll to target ID using Lenis */
window.luxuryScrollTo = (targetId) => {
    // Không gọi ScrollTrigger.refresh() ở đây vì nó tính toán lại toàn trang gây sai vị trí cuộn
    
    let el = targetId;
    if (typeof targetId === 'string') {
        el = document.querySelector(targetId);
    }
    if (!el) return;
    
    if (lenis) {
        lenis.scrollTo(el, {
            offset: -130, // Đảm bảo chừa nhiều khoảng trống hơn cho fixed menu
            duration: 1.5,
            easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        });
    } else {
        const y = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
};


/* ============================================================
   04. PRELOADER — Ẩn sau khi trang load xong
   ============================================================ */
(function initPreloader() {
    const preloader = document.getElementById('site-preloader');
    if (!preloader) return;

    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.preloader === false) {
        preloader.remove();
        return;
    }

    const hidePreloader = () => {
        setTimeout(() => {
            preloader.classList.add('is-hidden');
            document.body.classList.add('page-loaded');
            ScrollTrigger.refresh();
            preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
        }, 300); // 300ms buffer sau window.load
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
})();


/* ============================================================
   05. PAGE INIT — DOMContentLoaded main setup
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    // Remove CSS transition sau khi animation xong → nhường cho GSAP
    setTimeout(() => {
        document.querySelectorAll('.hero-img-load').forEach(el => {
            el.style.transition = 'none';
        });
    }, 4000);

    // Apply SEO & Tab Info
    (function applySeo() {
        if (!window.SITE_CONFIG?.seo) return;
        
        if (window.SITE_CONFIG.seo.title) {
            document.title = window.SITE_CONFIG.seo.title;
        }
        
        if (window.SITE_CONFIG.seo.favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = window.SITE_CONFIG.seo.favicon;
        }
    })();
    // Proactively remove chatbot DOM if disabled (since chatbot.js is lazy loaded)
    (function checkChatbotFlag() {
        if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.chatbot === false) {
            document.getElementById('ai-chat-trigger')?.remove();
            document.getElementById('ai-chat-panel')?.remove();
        }
    })();

    // Header dark mode: toggle class when over dark hero
    (function initHeaderDarkMode() {
        const header = document.getElementById('main-header');
        const hero   = document.getElementById('hero');
        if (!header || !hero) return;

        const updateHeaderMode = () => {
            const heroBottom = hero.getBoundingClientRect().bottom;
            if (heroBottom > 60) {
                header.classList.add('on-dark-hero');
            } else {
                header.classList.remove('on-dark-hero');
            }
        };

        updateHeaderMode();
        window.addEventListener('scroll', updateHeaderMode, { passive: true });
    })();

    // Render product cards
    renderProducts();

    // Render order form options
    const orderSelect = document.getElementById('order-product');
    const dynamicVariantContainer = document.getElementById('dynamic-variant-container');

    if (orderSelect) {
        let optionsHTML = '<option value="">-- Chọn sản phẩm --</option>';
        YEN_SAO_DB.products.forEach(p => {
            optionsHTML += `<option value="${p.id}">${p.name}</option>`;
        });
        optionsHTML += '<option value="tu-van">Cần tư vấn thêm</option>';
        orderSelect.innerHTML = optionsHTML;

        // Handle variant changes
        orderSelect.addEventListener('change', (e) => {
            const selectedId = e.target.value;
            const product = YEN_SAO_DB.products.find(p => p.id === selectedId);
            const variantSelectGroup = document.getElementById('variant-select-group');
            const customQtyGroup = document.getElementById('custom-qty-group');
            const orderQty = document.getElementById('order-qty');
            const customQtyInput = document.getElementById('order-qty-custom');
            const customQtyLabel = document.getElementById('custom-qty-label');
            const customQtyNote = document.getElementById('custom-qty-note');

            // Reset UI về trạng thái tối mờ (disabled)
            if (variantSelectGroup && orderQty) {
                variantSelectGroup.style.opacity = '0.5';
                variantSelectGroup.style.pointerEvents = 'none';
                orderQty.disabled = true;
                orderQty.innerHTML = '<option value="">-- Vui lòng chọn yến --</option>';
            }

            if (customQtyGroup && customQtyInput && customQtyLabel && customQtyNote) {
                customQtyGroup.style.opacity = '0.5';
                customQtyGroup.style.pointerEvents = 'none';
                customQtyInput.disabled = true;
                customQtyInput.type = 'text';
                customQtyInput.placeholder = '--';
                customQtyInput.value = '';
                customQtyLabel.innerText = 'Nhập Số Lượng';
                customQtyNote.style.display = 'none';
            }

            if (!product || !product.variantConfig) {
                return; // Trả về trạng thái mặc định nếu chưa chọn sản phẩm
            }

            const config = product.variantConfig;

            if (config.type === 'select_with_custom') {
                // Kích hoạt cột trái
                variantSelectGroup.style.opacity = '1';
                variantSelectGroup.style.pointerEvents = 'auto';
                orderQty.disabled = false;
                orderQty.innerHTML = config.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');

                customQtyLabel.innerText = config.customLabel;
                customQtyInput.placeholder = config.customPlaceholder;

                // Cài đặt sự kiện tắt/bật cột phải
                orderQty.onchange = (ev) => {
                    if (ev.target.value === 'custom') {
                        customQtyGroup.style.opacity = '1';
                        customQtyGroup.style.pointerEvents = 'auto';
                        customQtyInput.disabled = false;
                        customQtyInput.focus();
                    } else {
                        customQtyGroup.style.opacity = '0.5';
                        customQtyGroup.style.pointerEvents = 'none';
                        customQtyInput.disabled = true;
                        customQtyInput.value = '';
                    }
                };
                orderQty.onchange({ target: orderQty }); // chạy thử 1 lần
            } 
            else if (config.type === 'number_input') {
                // Tắt cột trái (để chữ mô tả)
                orderQty.innerHTML = `<option value="custom">${config.label}</option>`;
                
                // Bật cột phải
                customQtyGroup.style.opacity = '1';
                customQtyGroup.style.pointerEvents = 'auto';
                customQtyInput.disabled = false;
                customQtyInput.type = 'number';
                customQtyLabel.innerText = config.label;
                customQtyInput.placeholder = config.placeholder;
                
                if (config.note) {
                    customQtyNote.innerText = config.note;
                    customQtyNote.style.display = 'block';
                }
            }
        });
    }

    // Header scroll effect — luôn dark glass, không đổi trắng
    const header = document.getElementById('main-header');

    const updateHeaderScroll = () => {
        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.remove('bg-transparent', 'bg-white/95', 'py-6');
            header.classList.add('py-4');
            header.style.background = 'rgba(20, 8, 3, 0.88)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 2px 24px rgba(0,0,0,0.35)';
            header.style.borderBottomColor = 'transparent';
        } else {
            header.classList.add('bg-transparent', 'py-6');
            header.classList.remove('bg-white/95', 'py-4');
            header.style.background = '';
            header.style.backdropFilter = '';
            header.style.boxShadow = '';
            header.style.borderBottomColor = 'transparent';
        }
    };

    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();

    // Hero scroll button — click V → scroll xuống page 2
    // Kéo lên tay → page 1 tự quay lại (sticky)
    const scrollBtn = document.getElementById('hero-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            lenis.scrollTo('#products', {
                offset: -220,
                duration: 1.5,
                easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
            });
        });
    }
});



/* ============================================================
   06. HERO — Parallax & scroll animations
   ============================================================ */
(function initHeroAnimations() {
    // AOS replacement với GSAP
    const isMobile = window.innerWidth < 768;
    
    gsap.utils.toArray('[data-aos]').forEach(element => {
        // Trong Hero hoặc trên Mobile → hiện ngay sau khi load (không dùng ScrollTrigger để tránh lỗi overflow ngang trên Android)
        if (element.closest('#hero') || isMobile) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.classList.add('aos-animate');
            }, (parseInt(element.getAttribute('data-aos-delay')) || 0) + 100);
            return;
        }

        const animationType = element.getAttribute('data-aos');
        const delay    = (parseInt(element.getAttribute('data-aos-delay'))    || 0)    / 1000;
        const duration = (parseInt(element.getAttribute('data-aos-duration')) || 1000) / 1000;

        let y = 0, x = 0, scale = 1;
        if (animationType === 'fade-up')        y = 50;
        else if (animationType === 'fade-right') x = -50;
        else if (animationType === 'fade-left')  x = 50;
        else if (animationType === 'zoom-in')    scale = 0.8;
        else if (animationType === 'zoom-in-left')  { scale = 0.8; x = -50; }
        else if (animationType === 'zoom-in-right') { scale = 0.8; x = 50; }

        gsap.fromTo(element,
            { opacity: 0, y, x, scale },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 95%",
                    toggleActions: "play none none none"
                },
                opacity: 1, y: 0, x: 0, scale: 1,
                duration, delay,
                ease: "power3.out",
                onStart: () => element.classList.add('aos-animate')
            }
        );
    });

    // Hero GSAP Parallax
    const heroPinContainer = document.querySelector('.hero-pin-container');
    if (heroPinContainer) {
        document.querySelectorAll('.mouse-parallax').forEach(el => el.classList.remove('mouse-parallax'));

        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: heroPinContainer,
                start: "top top",
                end: "bottom top",
                scrub: 1,
            }
        });

        // Chữ trượt lên nhanh hơn → tạo độ sâu
        heroTl.to('.hero-text-col', { y: -150, opacity: 0.3, duration: 1 }, 0);

        // Sản phẩm trượt chậm hơn → cảm giác nổi 3D
        heroTl.to('.gsap-hero-img-1', { y: 150, xPercent: -5, scale: 1.1, rotation: -3, duration: 1 }, 0);
        heroTl.to('.gsap-hero-img-2', { y: 200, xPercent: 10, scale: 1.15, rotation: 5, duration: 1 }, 0);
        heroTl.to('.gsap-hero-img-3', { y: 100, scale: 1.1, rotation: -2, duration: 1 }, 0);
    }

    // Main content overlap parallax
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        gsap.fromTo(mainContent,
            { y: 150 },
            {
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: mainContent,
                    start: "top bottom",
                    end: "top 20%",
                    scrub: 1
                }
            }
        );
    }
})();


/* ============================================================
   07. CHIM YẾN — GSAP Bezier arc bird animation
   Chim bay từ góc dưới-trái → đậu lên chữ "YẾN SÀO"
   ============================================================ */
window.addEventListener("load", function () {
    const chimContainer = document.getElementById("chim-container");
    const baiDap = document.getElementById("to-chim");

    if (!chimContainer || !baiDap) return;

    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.lottiebird === false) {
        chimContainer.remove();
        return;
    }

    const rect = baiDap.getBoundingClientRect();
    const targetX = rect.left + (rect.width / 2) - 60;
    const targetY = rect.top - 80;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const tl = gsap.timeline({ delay: 0.6 });

    // Waypoint 0: Xuất phát — ngoài màn hình phía dưới-trái
    tl.set(chimContainer, { x: -180, y: H * 0.75, scale: 2.0, rotation: -20, scaleX: 1, opacity: 1 })

    // Waypoint 1: Đỉnh cung — bay lên cao, lượn ra giữa màn
    .to(chimContainer, { x: W * 0.30, y: H * 0.12, scale: 1.35, rotation: -6, duration: 1.5, ease: "power3.out" })

    // Waypoint 2: Vòng cung xuống — lao về phía chữ
    .to(chimContainer, { x: W * 0.60, y: targetY - 35, scale: 1.08, rotation: 8, duration: 1.0, ease: "power2.inOut" })

    // Waypoint 3: Hạ cánh — tiếp đất chính xác trên chữ
    .to(chimContainer, { x: targetX, y: targetY, scale: 1, rotation: 0, duration: 0.55, ease: "power4.out" })

    // Landing effect: lóe sáng chữ YẾN SÀO
    .add(() => {
        gsap.to(baiDap, {
            textShadow: "0px 0px 25px #F3E5D4, 0px 0px 55px #E1B875",
            duration: 0.35, yoyo: true, repeat: 1,
        });
    })

    // Float: chim đậu và vỗ cánh lơ lửng nhẹ
    .to(chimContainer, { y: targetY - 15, rotation: 0, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
});


/* ============================================================
   08. CUSTOM GOLD CURSOR — Awwwards style cursor
   ============================================================ */
(function initCustomCursor() {
    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.goldCursor === false) {
        return;
    }
    
    // Check if device is touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.createElement('div');
    cursor.id = 'custom-gold-cursor';
    cursor.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 20px; height: 20px;
        border: 2px solid #C5A059;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, background-color 0.2s;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    // Hide default cursor
    const style = document.createElement('style');
    style.innerHTML = `
        * { cursor: none !important; }
    `;
    document.head.appendChild(style);
    
    // GSAP quickSetter for high performance
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");
    
    window.addEventListener('mousemove', e => {
        setX(e.clientX);
        setY(e.clientY);
    });
    
    // Hover effects
    const addHoverEffect = () => {
        document.querySelectorAll('a, button, input, select, textarea, [class*="cursor-pointer"]').forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "1";
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.backgroundColor = 'rgba(197, 160, 89, 0.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    };
    
    addHoverEffect();
    
    // Observe DOM changes to attach hover effects to new elements
    const observer = new MutationObserver(mutations => {
        if (mutations.length) addHoverEffect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

/* ============================================================
   09. HORIZONTAL SCROLL GALLERY — Wheel → ngang (Lenis-safe)
   ============================================================ */
(function initHorizontalScroll() {
    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.hscrollGallery === false) {
        const section = document.getElementById('products-horizontal');
        if (section) section.style.display = 'none';
        return;
    }
    const isMobileView = window.matchMedia('(max-width: 1024px)').matches;
    const section = document.getElementById('products-horizontal');
    const track   = document.querySelector('.hscroll-track-products') || document.querySelector('#products-horizontal .hscroll-track');

    if (isMobileView) {
        // Override TRỰC TIẾP inline style trên track (JS > CSS > !important)
        if (track) {
            gsap.killTweensOf(track);
            // Xóa tất cả inline style có thể interfere
            track.style.cssText = [
                'display: flex',
                'flex-direction: row',
                'height: auto',
                'min-height: 300px',
                'overflow-x: auto',
                'overflow-y: hidden',
                'padding: 1rem 2rem 1.5rem 1.5rem',
                'gap: 0.875rem',
                'flex-wrap: nowrap',
                'transform: none',
                '-webkit-overflow-scrolling: touch',
                'scroll-snap-type: none',
                'scrollbar-width: none'
            ].join(';');
            track.scrollLeft = 0;
        }
        // Fix intro card
        if (section) {
            const introCard = section.querySelector('#products-intro-card');
            if (introCard) {
                introCard.style.cssText = [
                    'flex-shrink: 0',
                    'width: 120px',
                    'min-width: 120px',
                    'padding: 0',
                    'margin: 0',
                    'display: flex',
                    'flex-direction: column',
                    'justify-content: center'
                ].join(';');
            }
            // Reset GSAP inline styles trên các element bên trong
            const introLines = section.querySelectorAll('.hscroll-intro-line');
            const introEls   = section.querySelectorAll('.hscroll-intro-el');
            const cards      = section.querySelectorAll('.hscroll-product-card');
            const decorTree  = section.querySelector('.decor-hscroll-branch-tl');
            gsap.set(introLines, { clearProps: 'all' });
            gsap.set(introEls,   { clearProps: 'all' });
            gsap.set(cards,      { clearProps: 'all' });
            if (decorTree) gsap.set(decorTree, { clearProps: 'all' });
        }
        return;
    }

    if (!section || !track) return;

    let current = 0; // Vị trí hiện tại (px) — lerp
    let target  = 0; // Vị trí mục tiêu (px)

    const getMaxScroll = () => Math.max(0, track.scrollWidth - section.clientWidth);

    // Elastic overscroll state
    let overBounce = 0;
    const MAX_OVER  = 90;
    const OVER_DAMP = 0.22;
    let currentEdgeSide = null;

    // Smooth edge glow — stays on while dragging at edge, fades out slowly on release
    const showEdge = (side) => {
        if (currentEdgeSide !== side) {
            section.classList.remove('overscroll-left', 'overscroll-right');
            section.classList.add('overscroll-' + side);
            currentEdgeSide = side;
        }
    };
    const hideEdge = () => {
        if (!currentEdgeSide) return;
        section.classList.remove('overscroll-left', 'overscroll-right');
        currentEdgeSide = null;
    };

    // Mouse drag-to-scroll
    let isDragging = false, dragStartX = 0, dragStartTarget = 0, dragVelocity = 0, lastDragX = 0;

    section.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a')) return;
        isDragging = true;
        dragStartX = e.clientX;
        lastDragX  = e.clientX;
        dragStartTarget = target;
        dragVelocity = 0;
        section.classList.add('is-dragging');
        if (typeof lenis !== 'undefined') lenis.stop();
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragVelocity = lastDragX - e.clientX;
        lastDragX = e.clientX;
        const dx = e.clientX - dragStartX;
        const maxScroll = getMaxScroll();
        const rawDrag = dragStartTarget - dx;
        if (rawDrag < 0) {
            overBounce = Math.max(-MAX_OVER, rawDrag * OVER_DAMP);
            target = 0;
            showEdge('left');
        } else if (rawDrag > maxScroll) {
            overBounce = Math.min(MAX_OVER, (rawDrag - maxScroll) * OVER_DAMP);
            target = maxScroll;
            showEdge('right');
        } else {
            target = rawDrag;
            hideEdge();
        }
    });

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        section.classList.remove('is-dragging');
        if (typeof lenis !== 'undefined') lenis.start();
        hideEdge(); // fade out glow smoothly

        const maxScroll = getMaxScroll();
        const rawMomentum = target + dragVelocity * 6;
        if (rawMomentum < 0) {
            overBounce = Math.max(-MAX_OVER, rawMomentum * OVER_DAMP);
            target = 0;
        } else if (rawMomentum > maxScroll) {
            overBounce = Math.min(MAX_OVER, (rawMomentum - maxScroll) * OVER_DAMP);
            target = maxScroll;
        } else {
            target = rawMomentum;
        }

        // Drag hint opacity update
        const dragHint = section.querySelector('.hscroll-drag-hint');
        if (dragHint) {
            const pct = target / Math.max(1, maxScroll);
            gsap.to(dragHint, { opacity: pct > 0.05 ? 0 : 1, duration: 0.4, overwrite: true });
        }
        const moreRight = section.querySelector('.hscroll-more-right');
        if (moreRight) {
            gsap.to(moreRight, { opacity: target >= maxScroll * 0.85 ? 0 : 1, duration: 0.5, overwrite: true });
        }
    };
    window.addEventListener('mouseup',    stopDrag);
    window.addEventListener('mouseleave', stopDrag);

    // Entrance animation khi section vào viewport
    const introLines = section.querySelectorAll('.hscroll-intro-line');
    const introEls   = section.querySelectorAll('.hscroll-intro-el');
    const cards      = section.querySelectorAll('.hscroll-product-card');
    const decorTree  = section.querySelector('.decor-hscroll-branch-tl'); // Lấy phần tử cây

    gsap.set(introLines, { y: '110%' });
    gsap.set(introEls,   { opacity: 0, y: -16 });
    gsap.set(cards,      { x: 80, opacity: 0 });
    if (decorTree) gsap.set(decorTree, { opacity: 0, y: -30 });

    const entranceTl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 82%', once: true } });
    
    if (decorTree) {
        entranceTl.to(decorTree, { opacity: 0.12, y: 0, duration: 2.5, ease: 'power2.out' }, 0); // Chạy cùng lúc ngay từ đầu, mờ dần 2.5s
    }

    entranceTl
        .to(introLines, { y: '0%', duration: 0.9, stagger: 0.13, ease: 'power3.out' }, 0.2)
        .to(introEls,   { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.4')
        .to(cards,      { x: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: 'power3.out' }, '-=0.6');

    // Smooth lerp trong gsap.ticker — slower spring-back for rubber-band feel
    const setX = gsap.quickSetter(track, 'x', 'px');
    gsap.ticker.add(() => {
        const diff = target - current;
        if (Math.abs(diff) > 0.1) current += diff * 0.08;
        // Slow spring-back only when released — feels like rubber band
        if (!isDragging) overBounce += (0 - overBounce) * 0.06;
        setX(-(current + overBounce));
    });

    // Reset khi resize
    window.addEventListener('resize', () => { current = 0; target = 0; setX(0); });
})();


/* ============================================================
   09b. BLOG HORIZONTAL SCROLL — Same logic for blog section
   ============================================================ */
function createHScrollInstance(section, track) {
    const isMobileView = window.matchMedia('(max-width: 1024px)').matches;

    if (!section || !track || isMobileView) {
        // Override TRỰC TIẾP inline style trên blog track
        if (track) {
            gsap.killTweensOf(track);
            track.style.cssText = [
                'display: flex',
                'flex-direction: row',
                'height: auto',
                'min-height: 270px',
                'overflow-x: auto',
                'overflow-y: hidden',
                'padding: 1rem 2rem 1.5rem 1.5rem',
                'gap: 0.75rem',
                'flex-wrap: nowrap',
                'transform: none',
                '-webkit-overflow-scrolling: touch',
                'scroll-snap-type: none',
                'scrollbar-width: none'
            ].join(';');
            track.scrollLeft = 0;
        }
        // Fix blog intro card
        if (section) {
            const introCard = section.querySelector('.blog-hscroll-intro');
            if (introCard) {
                introCard.style.cssText = [
                    'flex-shrink: 0',
                    'width: 110px',
                    'min-width: 110px',
                    'padding: 0',
                    'margin: 0',
                    'display: flex',
                    'flex-direction: column',
                    'justify-content: center'
                ].join(';');
            }
            const introLines = section.querySelectorAll('.hscroll-intro-line');
            const introEls   = section.querySelectorAll('.hscroll-intro-el');
            const cards      = section.querySelectorAll('.blog-post-card, .hscroll-product-card');
            const decorTree  = section.querySelector('.decor-blog-branch-tl');
            gsap.set(introLines, { clearProps: 'all' });
            gsap.set(introEls,   { clearProps: 'all' });
            gsap.set(cards,      { clearProps: 'all' });
            if (decorTree) gsap.set(decorTree, { clearProps: 'all' });
        }
        return;
    }

    let current = 0, target = 0, overBounce = 0;
    const MAX_OVER = 90, OVER_DAMP = 0.22;
    let currentEdgeSide = null;
    let isDragging = false, dragStartX = 0, dragStartTarget = 0, dragVelocity = 0, lastDragX = 0;

    const getMaxScroll = () => Math.max(0, track.scrollWidth - section.clientWidth);

    // Smooth edge glow — stays on while dragging at edge, fades out slowly on release
    const showEdge = (side) => {
        if (currentEdgeSide !== side) {
            section.classList.remove('overscroll-left', 'overscroll-right');
            section.classList.add('overscroll-' + side);
            currentEdgeSide = side;
        }
    };
    const hideEdge = () => {
        if (!currentEdgeSide) return;
        section.classList.remove('overscroll-left', 'overscroll-right');
        currentEdgeSide = null;
    };

    section.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a')) return;
        isDragging = true;
        dragStartX = e.clientX;
        lastDragX  = e.clientX;
        dragStartTarget = target;
        dragVelocity = 0;
        section.classList.add('is-dragging');
        if (typeof lenis !== 'undefined') lenis.stop();
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragVelocity = lastDragX - e.clientX;
        lastDragX = e.clientX;
        const dx = e.clientX - dragStartX;
        const maxScroll = getMaxScroll();
        const rawDrag = dragStartTarget - dx;
        if (rawDrag < 0) {
            overBounce = Math.max(-MAX_OVER, rawDrag * OVER_DAMP);
            target = 0;
            showEdge('left');
        } else if (rawDrag > maxScroll) {
            overBounce = Math.min(MAX_OVER, (rawDrag - maxScroll) * OVER_DAMP);
            target = maxScroll;
            showEdge('right');
        } else {
            target = rawDrag;
            hideEdge();
        }
    });

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        section.classList.remove('is-dragging');
        if (typeof lenis !== 'undefined') lenis.start();
        hideEdge(); // fade out glow smoothly

        const maxScroll = getMaxScroll();
        const rawMomentum = target + dragVelocity * 6;
        if (rawMomentum < 0) {
            overBounce = Math.max(-MAX_OVER, rawMomentum * OVER_DAMP);
            target = 0;
        } else if (rawMomentum > maxScroll) {
            overBounce = Math.min(MAX_OVER, (rawMomentum - maxScroll) * OVER_DAMP);
            target = maxScroll;
        } else {
            target = rawMomentum;
        }
        const dragHint = section.querySelector('.hscroll-drag-hint');
        if (dragHint) gsap.to(dragHint, { opacity: target > 0.05 * maxScroll ? 0 : 1, duration: 0.4, overwrite: true });
        const moreRight = section.querySelector('.hscroll-more-right');
        if (moreRight) gsap.to(moreRight, { opacity: target >= maxScroll * 0.85 ? 0 : 1, duration: 0.5, overwrite: true });
    };
    window.addEventListener('mouseup',    stopDrag);
    window.addEventListener('mouseleave', stopDrag);

    // Touch support
    let touchStartX = 0, touchStartTarget = 0;
    section.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; touchStartTarget = target; }, { passive: true });
    section.addEventListener('touchmove', (e) => {
        const dx = e.touches[0].clientX - touchStartX;
        const maxScroll = getMaxScroll();
        target = Math.max(0, Math.min(maxScroll, touchStartTarget - dx));
    }, { passive: true });

    // Entrance animation
    const introLines = section.querySelectorAll('.hscroll-intro-line');
    const introEls   = section.querySelectorAll('.hscroll-intro-el');
    const cards      = section.querySelectorAll('.blog-post-card, .hscroll-product-card');
    const decorTree  = section.querySelector('.decor-blog-branch-tl'); // Lấy phần tử cây blog

    gsap.set(introLines, { y: '110%' });
    gsap.set(introEls,   { opacity: 0, y: -16 });
    gsap.set(cards,      { x: 80, opacity: 0 });
    if (decorTree) gsap.set(decorTree, { opacity: 0, y: -30 });

    const entranceTl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 82%', once: true } });
    
    if (decorTree) {
        entranceTl.to(decorTree, { opacity: 0.10, y: 0, duration: 2.5, ease: 'power2.out' }, 0); // Giảm opacity mờ đi để không lấn át chữ
    }

    entranceTl
        .to(introLines, { y: '0%', duration: 0.9, stagger: 0.13, ease: 'power3.out' }, 0.2)
        .to(introEls,   { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.4')
        .to(cards,      { x: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }, '-=0.6');

    // Lerp ticker — slow spring-back for rubber-band feel
    const setX = gsap.quickSetter(track, 'x', 'px');
    gsap.ticker.add(() => {
        const diff = target - current;
        if (Math.abs(diff) > 0.1) current += diff * 0.08;
        // Slow spring-back only when released — feels like rubber band
        if (!isDragging) overBounce += (0 - overBounce) * 0.06;
        setX(-(current + overBounce));
    });

    window.addEventListener('resize', () => { current = 0; target = 0; setX(0); });
}

// Called by blog.js after cards are injected
window.initBlogHScroll = function() {
    const section = document.getElementById('blog');
    
    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.blogSection === false) {
        if (section) section.style.display = 'none';
        return;
    }

    const track   = document.getElementById('blog-grid');
    if (section && track && !section.dataset.hscrollReady) {
        section.dataset.hscrollReady = '1';
        createHScrollInstance(section, track);
    }
};





/* ============================================================
   11. ORDER FORM — n8n Webhook integration
   ============================================================ */
(function initOrderForm() {
    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.orderForm === false) {
        const orderSection = document.getElementById('order');
        if (orderSection) orderSection.style.display = 'none';
        return;
    }

    // ──────────────────────────────────────────────────────────
    // 🔧 CẤU HÌNH WEBHOOK (Lấy từ config.js / .env)
    // ──────────────────────────────────────────────────────────
    const N8N_WEBHOOK_URL = window.SITE_CONFIG?.webhooks?.order || '';
    const IS_WEBHOOK_CONFIGURED = N8N_WEBHOOK_URL.trim() !== '';

    // Cập nhật indicator trạng thái
    const dot = document.getElementById('n8n-dot');
    const statusText = document.getElementById('n8n-status-text');
    if (dot && statusText) {
        if (IS_WEBHOOK_CONFIGURED) {
            dot.classList.remove('pending');
            statusText.textContent = 'Tự động hóa n8n · Đang hoạt động';
        } else {
            dot.classList.add('pending');
            statusText.textContent = 'n8n Webhook · Chưa cấu hình (sẽ lưu tạm)';
        }
    }

    // Form validation
    function validateForm(data) {
        if (!data.name || data.name.trim().length < 2) {
            showToast({ type: 'error', title: 'Thiếu họ tên', message: 'Vui lòng nhập đầy đủ họ và tên.' });
            return false;
        }
        const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            showToast({ type: 'error', title: 'Số điện thoại không hợp lệ', message: 'Vui lòng nhập SĐT Việt Nam hợp lệ.' });
            return false;
        }
        if (!data.product) {
            showToast({ type: 'error', title: 'Chưa chọn sản phẩm', message: 'Vui lòng chọn sản phẩm bạn quan tâm.' });
            return false;
        }
        if (!data.address || data.address.trim().length < 5) {
            showToast({ type: 'error', title: 'Thiếu địa chỉ', message: 'Vui lòng nhập địa chỉ nhận hàng chi tiết.' });
            return false;
        }
        return true;
    }

    async function sendToN8N(payload) {
        if (!IS_WEBHOOK_CONFIGURED) {
            const orders = JSON.parse(localStorage.getItem('tamthuy_orders') || '[]');
            orders.push({ ...payload, timestamp: new Date().toISOString(), id: Date.now() });
            localStorage.setItem('tamthuy_orders', JSON.stringify(orders));
            console.log('[TámThủy] Đơn hàng lưu tạm (chưa có n8n):', payload);
            return { success: true, mode: 'localStorage' };
        }

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { success: true, mode: 'n8n', data: await response.json().catch(() => ({})) };
    }
    window.sendToN8N = sendToN8N;

    // Form submit handler
    const form      = document.getElementById('order-form');
    const submitBtn = document.getElementById('order-submit-btn');
    const successEl = document.getElementById('order-success');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let finalQty = '';
        const qtyEl = document.getElementById('order-qty');
        const customQtyEl = document.getElementById('order-qty-custom');
        
        if (qtyEl) {
            if (qtyEl.value === 'custom' || qtyEl.disabled) {
                finalQty = customQtyEl?.value?.trim() || 'Khác';
            } else {
                finalQty = qtyEl.options[qtyEl.selectedIndex]?.text || qtyEl.value;
            }
        }

        const payload = {
            name:    document.getElementById('order-name')?.value?.trim()    || '',
            phone:   document.getElementById('order-phone')?.value?.trim()   || '',
            address: document.getElementById('order-address')?.value?.trim() || '',
            product: document.getElementById('order-product')?.value         || '',
            qty:     finalQty || '1',
            note:    document.getElementById('order-note')?.value?.trim()    || '',
            payment: document.getElementById('order-payment')?.value         || 'COD',
            isGift:  document.getElementById('order-gift')?.checked ? 'Có' : 'Không',
            source:  'website-tamthuy',
            utm:     window.location.search || '',
        };

        if (!validateForm(payload)) return;

        submitBtn.classList.add('is-loading');

        try {
            const result = await sendToN8N(payload);

            form.style.display = 'none';
            // Also hide title and subtitle for a cleaner success state
            const title = form.closest('.order-form-card').querySelector('.order-form-title');
            const subtitle = form.closest('.order-form-card').querySelector('.order-form-subtitle');
            if (title) title.style.display = 'none';
            if (subtitle) subtitle.style.display = 'none';

            successEl.classList.add('is-visible');

            const modeMsg = result.mode === 'localStorage'
                ? 'Đơn đã lưu tạm · Sẽ gửi tự động khi n8n kết nối'
                : 'n8n đã nhận đơn và đang xử lý tự động';

            showToast({ type: 'success', title: '🎉 Đặt hàng thành công!', message: modeMsg, duration: 6000 });

        } catch (err) {
            console.error('[TámThủy] Webhook error:', err);
            showToast({ type: 'error', title: 'Gửi thất bại', message: 'Hệ thống đang bận. Vui lòng thử lại hoặc gọi hotline.' });
        } finally {
            submitBtn.classList.remove('is-loading');
        }
    });

    // Reset form
    window.resetOrderForm = function () {
        form.reset();
        form.style.display = '';
        
        // Show title and subtitle again
        const title = form.closest('.order-form-card').querySelector('.order-form-title');
        const subtitle = form.closest('.order-form-card').querySelector('.order-form-subtitle');
        if (title) title.style.display = '';
        if (subtitle) subtitle.style.display = '';

        successEl.classList.remove('is-visible');
    };
})();


/* ============================================================
   11.1. TOAST NOTIFICATION SYSTEM
   ============================================================ */
(function initToastSystem() {
    /**
     * showToast({ type, title, message, duration })
     * type: 'success' | 'error'
     */
    window.showToast = function ({ type = 'success', title, message, duration = 4000 } = {}) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = { success: '✓', error: '✕' };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || '!'}</div>
            <div class="toast-content">
                ${title   ? `<p class="toast-title">${title}</p>`   : ''}
                ${message ? `<p class="toast-msg">${message}</p>`   : ''}
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };
})();


/* ============================================================
   12. FLOATING ORDER BUTTON — Mobile visibility control
   ============================================================ */
(function initFloatingBtn() {
    const floatingBtn = document.getElementById('floating-order-btn');
    if (!floatingBtn) return;

    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.floatingBtn === false) {
        floatingBtn.remove();
        return;
    }

    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom 80%',
        onEnter:     () => floatingBtn.classList.add('is-visible'),
        onLeaveBack: () => floatingBtn.classList.remove('is-visible'),
    });
})();


/* ============================================================
   13. ORDER SECTION ANIMATION — GSAP entrance
   ============================================================ */
(function initOrderAnimation() {
    const section = document.getElementById('order');
    if (!section) return;

    const leftContent = section.querySelector('.order-section-grid > div:first-child');
    const formCard    = section.querySelector('.order-form-card');

    if (leftContent) {
        gsap.fromTo(leftContent,
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%', once: true } }
        );
    }
    if (formCard) {
        gsap.fromTo(formCard,
            { opacity: 0, x: 60, y: 20 },
            { opacity: 1, x: 0, y: 0, duration: 1, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: section, start: 'top 75%', once: true } }
        );
    }

    const badges = section.querySelectorAll('.trust-badge');
    if (badges.length) {
        gsap.fromTo(badges,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.4, scrollTrigger: { trigger: section, start: 'top 70%', once: true } }
        );
    }
})();





/* ============================================================
   15. TESTIMONIALS ANIMATION — GSAP stagger entrance
   ============================================================ */
(function initTestimonialsAnimation() {
    const section = document.getElementById('reviews');
    if (!section) return;

    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.reviewSection === false) {
        section.style.display = 'none';
        return;
    }

    const header = section.querySelector('.reviews-header');
    const summary = section.querySelector('.reviews-summary');
    const cards  = section.querySelectorAll('.rv-card');

    if (header) {
        gsap.fromTo(header,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } }
        );
    }
    if (summary) {
        gsap.fromTo(summary,
            { opacity: 0, y: 20, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: section, start: 'top 75%', once: true } }
        );
    }
    if (cards.length) {
        gsap.fromTo(cards,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.3, scrollTrigger: { trigger: section, start: 'top 75%', once: true } }
        );
    }
})();


/* ============================================================
   16. NEWSLETTER FORM — Footer email → n8n
   ============================================================ */

/** Global wrapper — gọi từ onclick trong HTML */
function submitFooterNewsletter() {
    const emailInput = document.getElementById('footer-email');
    if (!emailInput) return;
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast({ type: 'error', title: 'Email không hợp lệ', message: 'Vui lòng nhập địa chỉ email đúng định dạng.' });
        return;
    }
    const payload = { email, source: 'newsletter-footer', timestamp: new Date().toISOString() };
    const subs = JSON.parse(localStorage.getItem('tamthuy_subscribers') || '[]');
    subs.push(payload);
    localStorage.setItem('tamthuy_subscribers', JSON.stringify(subs));
    emailInput.value = '';
    showToast({ type: 'success', title: '🎉 Đăng ký thành công!', message: 'Mã giảm giá 10% sẽ được gửi về email của bạn.', duration: 6000 });
}

(function initNewsletterForm() {
    // 🔧 Cấu hình — lấy từ config.js / .env
    const N8N_NEWSLETTER_URL = window.SITE_CONFIG?.webhooks?.newsletter || '';

    const footerEmailInput = document.querySelector('footer input[type="email"]');
    const footerSubmitBtn  = document.querySelector('footer button');
    if (!footerEmailInput || !footerSubmitBtn) return;

    footerSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = footerEmailInput.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast({ type: 'error', title: 'Email không hợp lệ', message: 'Vui lòng nhập địa chỉ email đúng định dạng.' });
            return;
        }

        const payload = { email, source: 'newsletter-footer', timestamp: new Date().toISOString() };

        try {
            if (N8N_NEWSLETTER_URL) {
                await fetch(N8N_NEWSLETTER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                // Lưu tạm localStorage
                const subs = JSON.parse(localStorage.getItem('tamthuy_subscribers') || '[]');
                subs.push(payload);
                localStorage.setItem('tamthuy_subscribers', JSON.stringify(subs));
            }

            footerEmailInput.value = '';
            showToast({ type: 'success', title: '🎉 Đăng ký thành công!', message: 'Mã giảm giá 10% sẽ được gửi về email của bạn.', duration: 6000 });

        } catch {
            showToast({ type: 'error', title: 'Lỗi kết nối', message: 'Vui lòng thử lại sau.' });
        }
    });

    // Cho phép nhấn Enter
    footerEmailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') footerSubmitBtn.click();
    });
})();

/* ============================================================
   17. DYNAMIC PRODUCT COUNT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.hscroll-product-card');
    const countDisplay = document.getElementById('dynamic-product-count');
    if (countDisplay && productCards.length > 0) {
        const count = productCards.length;
        const formattedCount = count < 10 ? '0' + count : count;
        countDisplay.textContent = `${formattedCount} sản phẩm`;
    }
});
