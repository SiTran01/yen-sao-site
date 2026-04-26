// Data Source
const products = [
    {
        id: 1,
        name: "Yến Thô Cao Cấp",
        tag: "Bestseller",
        stars: 5,
        reviews: 128,
        price: 3500000,
        original_price: 4000000,
        image: "assets/image1.png",
        features: ["Nguyên tổ 100%", "Nở gấp 4-5 lần", "Tặng kèm táo đỏ"]
    },
    {
        id: 2,
        name: "Yến Tinh Chế Sợi",
        tag: "Tiện lợi",
        stars: 5,
        reviews: 85,
        price: 4200000,
        original_price: 4500000,
        image: "assets/image1.png",
        features: ["Sạch lông 100%", "Sợi dài dai ngon", "Tiết kiệm thời gian"]
    },
    {
        id: 3,
        name: "Hồng Yến Đảo",
        tag: "Quý hiếm",
        stars: 5,
        reviews: 42,
        price: 6800000,
        original_price: 7500000,
        image: "assets/image1.png",
        features: ["Giàu khoáng chất", "Màu cam tự nhiên", "Quà biếu sang trọng"]
    },
    {
        id: 4,
        name: "Yến Chân Làm Sạch",
        tag: "Giòn ngon",
        stars: 4.5,
        reviews: 67,
        price: 3200000,
        original_price: 3600000,
        image: "assets/image1.png",
        features: ["Chân yến già", "Độ nở cao", "Dai giòn sần sật"]
    }
];

// Utilities
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) =>
        `<svg class="w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>`
    ).join('');
};

// Render Functions
const renderProducts = () => {
    const container = document.getElementById('product-grid');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="group product-card-premium card-oriental rounded-xl flex flex-col">
            <!-- Image & Tag -->
            <div class="relative aspect-[4/3] overflow-hidden cursor-pointer">
                <div class="absolute top-0 left-0 bg-brand-red text-white text-xs font-bold px-3 py-1 z-10 rounded-br-lg uppercase tracking-wider">
                    ${product.tag}
                </div>
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                
                <!-- Quick Action Overlay - Nút Mua ngay trượt lên mượt mà -->
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div class="btn-buy-now">
                        <a href="https://zalo.me/0900000000" class="bg-white text-brand-brown px-7 py-3 rounded-full font-bold shadow-xl hover:bg-brand-red hover:text-white transition-colors block">
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

// ==========================================
// GSAP & Lenis Smooth Scroll Setup
// ==========================================
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Smooth scroll to target
window.luxuryScrollTo = (targetId) => {
    lenis.scrollTo(targetId, { duration: 1.5, easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 });
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Page load animation trigger
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        ScrollTrigger.refresh();

        // Gỡ bỏ CSS transition sau khi animation load xong để nhường quyền điều khiển transform cho GSAP
        // (Nếu không GSAP sẽ bị CSS giằng xé giật lag)
        setTimeout(() => {
            document.querySelectorAll('.hero-img-load').forEach(el => {
                el.style.transition = 'none';
            });
        }, 2000); 
    }, 100);

    // 2. Render Products
    renderProducts();

    // 3. Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.remove('bg-transparent', 'py-6');
            header.classList.add('bg-white/95', 'shadow-md', 'py-4');
        } else {
            header.classList.add('bg-transparent', 'py-6');
            header.classList.remove('bg-white/95', 'shadow-md', 'py-4');
        }
    });

    // 4. Hero Banner - ScrollTrigger Parallax
    const heroPinContainer = document.querySelector('.hero-pin-container');
    if (heroPinContainer) {
        // Tắt mouse parallax vì ScrollTrigger sẽ lấy trọng tâm
        document.querySelectorAll('.mouse-parallax').forEach(el => el.classList.remove('mouse-parallax'));

        // Kịch bản GSAP Parallax (Không dùng Pin nữa để các khối cùng trượt tự nhiên)
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: heroPinContainer,
                start: "top top",
                end: "bottom top", // Kéo dài hiệu ứng đúng bằng chiều cao Hero
                scrub: 1, // Mượt mà liên kết với thanh cuộn
            }
        });

        // Chữ trượt lên nhanh hơn một chút để tạo độ sâu (Parallax)
        heroTl.to('.hero-text-wrapper', {
            y: -150,
            opacity: 0.3,
            duration: 1
        }, 0);

        // Sản phẩm xòe ra và trượt chậm hơn trang (tạo cảm giác nổi 3D)
        heroTl.to('.gsap-hero-img-1', {
            y: 150, // Trượt xuống so với khung => Trượt lên chậm hơn so với trang
            xPercent: -5,
            scale: 1.1,
            rotation: -3,
            duration: 1
        }, 0);
        
        heroTl.to('.gsap-hero-img-2', {
            y: 200,
            xPercent: 10,
            scale: 1.15,
            rotation: 5,
            duration: 1
        }, 0);

        heroTl.to('.gsap-hero-img-3', {
            y: 100,
            scale: 1.1,
            rotation: -2,
            duration: 1
        }, 0);
    }

    // Hiệu ứng "Trượt lên" cho phần Main Content (Parallax overlap)
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        gsap.fromTo(mainContent, 
            { y: 150 }, // Đẩy xuống một chút lúc đầu
            {
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: mainContent,
                    start: "top bottom", // Khi main-content vừa xuất hiện ở đáy màn hình
                    end: "top 20%",      // Kéo dài cho đến khi nó lên đến 20% màn hình
                    scrub: 1
                }
            }
        );
    }

    // 5. Trình diễn hiệu ứng cũ của AOS bằng GSAP (Thay thế hoàn toàn AOS)
    gsap.utils.toArray('[data-aos]').forEach(element => {
        // Đối với phần tử trong Hero, tự động hiển thị sau khi load xong
        if (element.closest('#hero')) {
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, (parseInt(element.getAttribute('data-aos-delay')) || 0) + 100);
            return;
        }

        const animationType = element.getAttribute('data-aos');
        const delay = (parseInt(element.getAttribute('data-aos-delay')) || 0) / 1000;
        const duration = (parseInt(element.getAttribute('data-aos-duration')) || 1000) / 1000;

        let y = 0, x = 0, scale = 1;
        if (animationType === 'fade-up') y = 50;
        else if (animationType === 'fade-right') x = -50;
        else if (animationType === 'fade-left') x = 50;
        else if (animationType === 'zoom-in') scale = 0.8;
        else if (animationType === 'zoom-in-left') { scale = 0.8; x = -50; }
        else if (animationType === 'zoom-in-right') { scale = 0.8; x = 50; }

        gsap.fromTo(element, 
            { opacity: 0, y: y, x: x, scale: scale },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Kích hoạt khi phần tử hiện 15% dưới màn hình
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                duration: duration,
                delay: delay,
                ease: "power3.out",
                onStart: () => element.classList.add('aos-animate') // Giữ class để Text Reveal chạy
            }
        );
    });

    // 6. Scroll Button Event
    const scrollBtn = document.getElementById('hero-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.luxuryScrollTo('#products'); 
        });
    }
});

// 7. Chim Yến GSAP Effect — Bezier Arc Path (Giả lập 3 waypoints)
window.addEventListener("load", function () {
    const chimContainer = document.getElementById("chim-container");
    const baiDap = document.getElementById("to-chim");

    if (!chimContainer || !baiDap) return;

    const rect = baiDap.getBoundingClientRect();
    const targetX = rect.left + (rect.width / 2) - 60;
    const targetY = rect.top - 80;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const tl = gsap.timeline({ delay: 0.6 });

    // ── Waypoint 0: Xuất phát — ngoài màn hình, phía dưới-trái ─────────────
    tl.set(chimContainer, {
        x: -180,
        y: H * 0.75,
        scale: 2.0,
        rotation: -20,   // Mũi chim ngẩng lên (bay lên dốc)
        scaleX: 1,        // Bird.json hướng sang phải → giữ nguyên
        opacity: 1,
    })

    // ── Waypoint 1: Đỉnh cung — bay lên cao, lượn ra giữa màn ─────────────
    .to(chimContainer, {
        x: W * 0.30,
        y: H * 0.12,
        scale: 1.35,
        rotation: -6,    // Gần nằm ngang ở đỉnh cung
        duration: 1.5,
        ease: "power3.out",
    })

    // ── Waypoint 2: Vòng cung xuống — lao về phía chữ ──────────────────────
    .to(chimContainer, {
        x: W * 0.60,
        y: targetY - 35,
        scale: 1.08,
        rotation: 8,     // Mũi chúi nhẹ xuống khi lao
        duration: 1.0,
        ease: "power2.inOut",
    })

    // ── Waypoint 3: Hạ cánh — tiếp đất chính xác trên chữ ─────────────────
    .to(chimContainer, {
        x: targetX,
        y: targetY,
        scale: 1,
        rotation: 0,     // Chim đứng thẳng khi đậu
        duration: 0.55,
        ease: "power4.out",
    })

    // ── Landing effect: lóe sáng chữ YẾN SÀO ──────────────────────────────
    .add(() => {
        gsap.to(baiDap, {
            textShadow: "0px 0px 25px #F3E5D4, 0px 0px 55px #E1B875",
            duration: 0.35,
            yoyo: true,
            repeat: 1,
        });
    })

    // ── Float: chim đậu và vỗ cánh, lơ lửng nhẹ ───────────────────────────
    .to(chimContainer, {
        y: targetY - 15,
        rotation: 0,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });
});

// ══════════════════════════════════════════════════════════════
// 8. Custom Gold Cursor — Awwwards Style (GSAP quickSetter)
// ══════════════════════════════════════════════════════════════
(function initCursor() {
    // Bỏ qua thiết bị cảm ứng — không có cursor vật lý
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100; // Vị trí chuột hiện tại
    let rx = -100, ry = -100; // Vị trí ring (lerp lag)

    // quickSetter: bypass JS property overhead, ghi thẳng vào transform
    const setDotX  = gsap.quickSetter(dot,  'x', 'px');
    const setDotY  = gsap.quickSetter(dot,  'y', 'px');
    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');

    // ── Dot: theo cursor tức thì, không lag ────────────────────────────────
    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        setDotX(mx);
        setDotY(my);

        // Lần đầu rê chuột → fade in cursor
        if (!dot.classList.contains('is-visible')) {
            dot.classList.add('is-visible');
            ring.classList.add('is-visible');
        }
    });

    // ── Ring: lerp trong GSAP ticker → lag mượt mà ────────────────────────
    gsap.ticker.add(() => {
        const lerp = 0.11; // 0.0 = lag cực nhiều | 1.0 = theo ngay
        rx += (mx - rx) * lerp;
        ry += (my - ry) * lerp;
        setRingX(rx);
        setRingY(ry);
    });

    // ── Hover state: event delegation bắt cả element render động ──────────
    const HOVER_TARGETS = 'a, button, [role="button"], input, label, select, textarea';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(HOVER_TARGETS)) {
            document.body.setAttribute('data-cursor', 'hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(HOVER_TARGETS)) {
            document.body.removeAttribute('data-cursor');
        }
    });

    // ── Ẩn khi chuột rời cửa sổ, hiện lại khi vào ────────────────────────
    document.addEventListener('mouseleave', () => {
        gsap.to([dot, ring], { opacity: 0, duration: 0.25, overwrite: true });
    });

    document.addEventListener('mouseenter', () => {
        gsap.to([dot, ring], { opacity: 1, duration: 0.25, overwrite: true });
    });
})();

// ══════════════════════════════════════════════════════════════
// 9. Horizontal Product Gallery — Wheel → Ngang (Lenis-safe)
// ══════════════════════════════════════════════════════════════
(function initHorizontalScroll() {
    if (window.innerWidth < 768) return;

    const section = document.getElementById('products-horizontal');
    const track   = document.querySelector('.hscroll-track');
    const hint    = document.querySelector('.hscroll-hint');

    if (!section || !track) return;

    let current = 0; // vị trí hiện tại (px) — theo lerp
    let target  = 0; // vị trí mục tiêu (px) — nhảy theo wheel

    const getMaxScroll = () => Math.max(0, track.scrollWidth - section.clientWidth);

    // ── Elastic overscroll state ─────────────────────────────────────────
    let overBounce  = 0;     // Độ dịch thêm khi vượt mép (px)
    const MAX_OVER  = 90;    // Tối đa stretch
    const OVER_DAMP = 0.22;  // Resistance: 22% của overflow
    let   edgeTimer = null;

    // Flash glow ở mép tương ứng, tự tắt sau 600ms
    const flashEdge = (side) => {
        section.classList.remove('overscroll-left', 'overscroll-right');
        // Force reflow để restart animation
        void section.offsetWidth;
        section.classList.add('overscroll-' + side);
        clearTimeout(edgeTimer);
        edgeTimer = setTimeout(() =>
            section.classList.remove('overscroll-left', 'overscroll-right')
        , 600);
    };

    // ── Mouse drag-to-scroll (click & drag ngang) ──────────────────────
    let isDragging   = false;
    let dragStartX   = 0;
    let dragStartTarget = 0;
    let dragVelocity = 0;
    let lastDragX    = 0;

    section.addEventListener('mousedown', (e) => {
        // Bỏ qua click trên button/a để không block chúng
        if (e.target.closest('button, a')) return;
        isDragging      = true;
        dragStartX      = e.clientX;
        lastDragX       = e.clientX;
        dragStartTarget = target;
        dragVelocity    = 0;
        section.classList.add('is-dragging');
        if (typeof lenis !== 'undefined') lenis.stop();
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragVelocity = lastDragX - e.clientX; // Vận tốc kéo (px/frame)
        lastDragX    = e.clientX;
        const dx = e.clientX - dragStartX;
        const maxScroll = getMaxScroll();
        const rawDrag = dragStartTarget - dx;
        if (rawDrag < 0) {
            overBounce = Math.max(-MAX_OVER, rawDrag * OVER_DAMP);
            target = 0;
            flashEdge('left');
        } else if (rawDrag > maxScroll) {
            overBounce = Math.min(MAX_OVER, (rawDrag - maxScroll) * OVER_DAMP);
            target = maxScroll;
            flashEdge('right');
        } else {
            target = rawDrag;
        }
    });

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        section.classList.remove('is-dragging');
        // Trả lại Lenis sau khi kéo xong
        if (typeof lenis !== 'undefined') lenis.start();
        // Momentum: ném thêm sau khi thả
        const maxScroll = getMaxScroll();
        const rawMomentum = target + dragVelocity * 6;
        if (rawMomentum < 0) {
            overBounce = Math.max(-MAX_OVER, rawMomentum * OVER_DAMP);
            target = 0;
            flashEdge('left');
        } else if (rawMomentum > maxScroll) {
            overBounce = Math.min(MAX_OVER, (rawMomentum - maxScroll) * OVER_DAMP);
            target = maxScroll;
            flashEdge('right');
        } else {
            target = rawMomentum;
        }
        // Cập nhật drag hint
        const dragHint = section.querySelector('.hscroll-drag-hint');
        if (dragHint) {
            const pct = target / Math.max(1, maxScroll);
            if (pct > 0.05) gsap.to(dragHint, { opacity: 0, duration: 0.4, overwrite: true });
            else            gsap.to(dragHint, { opacity: 1, duration: 0.4, overwrite: true });
        }
        // Fade right-edge indicator khi về cuối
        const moreRight = section.querySelector('.hscroll-more-right');
        if (moreRight) {
            gsap.to(moreRight, {
                opacity: target >= maxScroll * 0.85 ? 0 : 1,
                duration: 0.5, overwrite: true
            });
        }
    };
    window.addEventListener('mouseup',    stopDrag);
    window.addEventListener('mouseleave', stopDrag);

    // ── Entrance Animation (khi section vào viewport) ────────────────────
    const introLabel = section.querySelector('.hscroll-intro-el:first-of-type') ||
                       section.querySelector('.hscroll-intro-el');
    const introLines  = section.querySelectorAll('.hscroll-intro-line');
    const introEls    = section.querySelectorAll('.hscroll-intro-el');
    const cards       = section.querySelectorAll('.hscroll-product-card');

    // Set trạng thái ẩn ban đầu bằng GSAP (không dùng CSS để tránh flash trên mobile)
    gsap.set(introLines, { y: '110%' });
    gsap.set(introEls,   { opacity: 0, y: -16 });
    gsap.set(cards,      { x: 80, opacity: 0 });

    const entranceTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,   // Chỉ chạy 1 lần duy nhất
        }
    });

    entranceTl
        // 1. Các dòng chữ h2: xuất hiện từ trên xuống (mask slide up)
        .to(introLines, {
            y: '0%',
            duration: 0.9,
            stagger: 0.13,    // Mỗi dòng cách nhau 130ms → cảm giác "ghi từ trên xuống"
            ease: 'power3.out',
        })
        // 2. Mô tả + divider: fade + slide xuống nhẹ
        .to(introEls, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
        }, '-=0.4')
        // 3. Các card sản phẩm: trượt từ phải vào, stagger đều
        .to(cards, {
            x: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.07,    // 8 cards × 70ms = ~560ms tổng
            ease: 'power3.out',
        }, '-=0.6');

    // ── Smooth lerp trong gsap.ticker → di chuyển mượt mà ──────────────
    const setX = gsap.quickSetter(track, 'x', 'px');


    gsap.ticker.add(() => {
        const diff = target - current;
        if (Math.abs(diff) > 0.1) {
            current += diff * 0.08;
        }
        // Spring overBounce → 0 (elastic recovery, 12% per frame)
        overBounce += (0 - overBounce) * 0.12;
        // Ghi translate = main position + elastic offset
        setX(-(current + overBounce));
    });

    // ── Reset khi resize cửa sổ ─────────────────────────────────────────
    window.addEventListener('resize', () => {
        current = 0;
        target  = 0;
        setX(0);
    });
})();

