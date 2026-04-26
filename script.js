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

// 7. Chim Yến GSAP Effect (Lottie Version)
window.addEventListener("load", function () {
    const chimContainer = document.getElementById("chim-container");
    const baiDap = document.getElementById("to-chim");

    if (!chimContainer || !baiDap) return;

    const rect = baiDap.getBoundingClientRect();
    const targetX = rect.left + (rect.width / 2) - 60; 
    const targetY = rect.top - 80; 

    const tl = gsap.timeline();

    tl.set(chimContainer, {
        x: -150, 
        y: targetY - 100, 
        opacity: 1,
        scale: 1.5 
    })
    .to(chimContainer, {
        duration: 2.5, 
        x: targetX,
        y: targetY,
        scale: 1, 
        ease: "power2.out" 
    })
    .add(() => {
        gsap.to(baiDap, {
            textShadow: "0px 0px 20px #F3E5D4, 0px 0px 40px #E1B875", 
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    })
    .to(chimContainer, {
        y: targetY - 15,
        duration: 1.5,
        repeat: -1, 
        yoyo: true, 
        ease: "sine.inOut"
    });
});
