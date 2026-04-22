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
// Custom Luxury Smooth Scroll (Global Scope)
// ==========================================
window.luxuryScrollTo = (targetY, duration = 1500) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;

    // Ease-in-out Cubic function for "luxury" feel
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = easeInOutCubic(progress);
        window.scrollTo(0, startY + (diff * ease));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Page load animation trigger
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    // Reveal handled via scroll logic due to fixed card-deck architecture

    renderProducts();

    // Header Scroll Effect
    // Header Scroll Effect
    const header = document.getElementById('main-header');

    // Initial check in case of reload mid-scroll
    const updateHeader = () => {
        if (window.scrollY > 50) {
            // Scrolled State: White background, shadow, compact
            header.classList.remove('bg-transparent', 'py-6');
            header.classList.add('bg-white/95', 'shadow-md', 'py-4');
        } else {
            // Top State: Transparent, no shadow, spacious, remove white bg
            header.classList.add('bg-transparent', 'py-6');
            header.classList.remove('bg-white/95', 'shadow-md', 'py-4');
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Run once on load

    // ========================================== (Moved to Global)

    // ==========================================
    // Card Deck Reveal Effect Logic
    // ==========================================
    const hero = document.getElementById('hero');
    const mainContent = document.getElementById('main-content');
    const spacer = document.getElementById('scroll-spacer');

    const initCardDeck = () => {
        if (!hero || !mainContent || !spacer) return;

        // 1. Calculate Heights
        const heroHeight = window.innerHeight; // Hero is 100vh
        const contentHeight = mainContent.scrollHeight; // Full height of content
        const totalHeight = heroHeight + contentHeight;

        // 2. Set Spacer Height (This creates the scrollable area)
        spacer.style.height = `${totalHeight}px`;

        // 3. Sync Logic
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const parallaxFactor = 0.2; // Move content at 20% speed of scroll

            // Scenario A: Scrolled less than 100vh (Hero is still visible)
            // Hero moves up naturally (it's absolute).
            // Main Content moves slightly UP (Parallax effect) AND Fades In.
            if (scrollY <= heroHeight) {
                // Parallax Move
                mainContent.style.transform = `translateY(-${scrollY * parallaxFactor}px)`;

                // Opacity Fade: Unveil from 0.4 to 1.0
                // Starts at 0.4 when scrollY=0. Reaches 1.0 when scrollY=heroHeight.
                const fadeStart = 0.4;
                const progress = scrollY / heroHeight; // 0 to 1
                const opacity = fadeStart + (progress * (1 - fadeStart));
                mainContent.style.opacity = opacity;
            }
            // Scenario B: Scrolled past Hero
            // Content takes over fully.
            else {
                const offsetAtTransition = heroHeight * parallaxFactor;
                const contentScroll = scrollY - heroHeight;
                mainContent.style.transform = `translateY(-${offsetAtTransition + contentScroll}px)`;
                mainContent.style.opacity = 1;
            }

            // Xoá Logic Tự Viết -> Chuyển sang Intersection Observer an toàn
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        // ==========================================
        // Tối ưu hóa: Intersection Observer mượt mà
        // ==========================================
        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -50px 0px', // Kích hoạt hiệu ứng sớm một chút khi vào màn hình
            threshold: 0.15 
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Logic chặn các element bị giấu dưới Hero (chỉ áp dụng cho những element thuộc #main-content)
                const rect = entry.boundingClientRect;
                const windowHeight = window.innerHeight;
                
                const insideMainContent = entry.target.closest('#main-content') !== null;
                const isUnderHero = insideMainContent && rect.top < windowHeight && window.scrollY < windowHeight * 0.3;

                if (entry.isIntersecting && !isUnderHero) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });

        // ==========================================
        // Hero Mouse Parallax (Hiệu ứng di chuột lơ lửng)
        // ==========================================
        const parallaxElements = document.querySelectorAll('.mouse-parallax');
        document.addEventListener('mousemove', (e) => {
            if(window.scrollY > window.innerHeight) return; // Không tính toán khi đã cuộn qua
            
            const x = (window.innerWidth - e.pageX) / 100;
            const y = (window.innerHeight - e.pageY) / 100;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
                el.style.transform = `translateX(${x * speed * 100}px) translateY(${y * speed * 100}px)`;
            });
        });

    };

    // Run init, and also re-run on resize to handle dynamic height changes
    window.addEventListener('load', initCardDeck);
    window.addEventListener('resize', initCardDeck);

    // ==========================================
    // Attach Scroll Button Event
    // ==========================================
    const scrollBtn = document.getElementById('hero-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const target = window.innerHeight; // Scroll exactly one viewport down
            window.luxuryScrollTo(target);
        });
    }



});
