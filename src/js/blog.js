document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const modal = document.getElementById('blog-modal');
    const modalClose = document.getElementById('blog-modal-close');
    const modalContent = document.getElementById('blog-modal-content');

    // Fetch index.json
    async function fetchBlogIndex() {
        try {
            const res = await fetch('./data/posts/index.json');
            if (!res.ok) throw new Error('Failed to fetch blog index');
            const posts = await res.json();
            renderBlogCards(posts);
        } catch (error) {
            console.error(error);
            blogGrid.innerHTML = '<p class="text-center w-full col-span-3 text-brand-red">Không thể tải bài viết lúc này.</p>';
        }
    }

    function renderBlogCards(posts) {
        const track = document.getElementById('blog-grid');
        if (!track) return;
        // Remove any previously injected cards (but keep intro card)
        track.querySelectorAll('.blog-post-card').forEach(el => el.remove());

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-post-card hscroll-card flex-shrink-0 w-[440px] h-[56vh] rounded-[2rem] overflow-hidden relative group cursor-pointer';
            card.innerHTML = `
                <div class="absolute inset-0 bg-gradient-to-t from-[#2d1208]/90 via-transparent to-transparent z-10 transition-opacity duration-700"></div>
                <div class="absolute inset-0 bg-[#f0ebe4] flex items-center justify-center overflow-hidden">
                    <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110">
                </div>

                <div class="absolute top-7 left-7 z-20">
                    <span class="bg-white/90 backdrop-blur text-[#8B6508] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">${post.tags[0]}</span>
                </div>

                <div class="absolute bottom-4 left-4 right-4 p-6 z-20 bg-[#2d1208]/40 backdrop-blur-lg rounded-[1.5rem] border border-white/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                    <div class="flex items-center gap-3 mb-2 md:mb-3">
                        <span class="text-[#C5A059] text-[8px] md:text-[10px] uppercase tracking-[0.25em] font-bold">${post.date}</span>
                        <span class="w-1 h-1 rounded-full bg-[#C5A059]/50"></span>
                        <span class="text-white/60 text-[8px] md:text-[10px] uppercase tracking-[0.25em]">${post.readTime}</span>
                    </div>
                    <h3 class="text-white font-serif font-black text-[1.6rem] leading-tight mb-3 line-clamp-2">${post.title}</h3>
                    <p class="hidden md:block text-white/60 text-xs leading-relaxed mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">${post.excerpt}</p>
                    <div class="hidden md:flex items-center gap-2 text-[#C5A059] font-bold text-sm opacity-0 group-hover:opacity-100 group-hover:gap-4 transition-all duration-300 delay-150">
                        <span>Đọc tiếp</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => openPost(post.id));
            track.appendChild(card);
        });

        // Trigger blog hscroll init after cards are in DOM
        if (typeof window.initBlogHScroll === 'function') window.initBlogHScroll();
    }

    async function openPost(id) {
        try {
            // 1. Mở modal ngay lập tức
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            modalContent.scrollTop = 0;

            // 2. Chèn màn hình Preload VÀO TRONG khung modal
            // Dùng 1 thẻ div trống ép chiều cao 90vh (bằng đúng max-h của modal) để khung không bị giật/thay đổi kích thước khi load xong
            // Dùng thẻ absolute -inset-[2px] (tràn viền 2px) và rounded-[2rem] để che triệt để viền trắng (anti-aliasing bleed) ở 4 góc trên Safari/Mobile
            modalContent.innerHTML = `
                <div style="width: 100%; height: 90vh;"></div>
                <div class="absolute -inset-[2px] z-[40] flex flex-col items-center justify-center" 
                     style="background: linear-gradient(135deg, #1a0a05 0%, #2d1208 50%, #4A2C2A 100%); border-radius: 2rem;">
                    <div class="preloader-inner scale-110 flex flex-col items-center">
                        <div class="preloader-logo relative w-[80px] h-[80px]">
                            <img src="./assets/images/avt-svg.svg" alt="Tám Thủy" class="preloader-img absolute inset-0 w-full h-full object-contain" 
                                 style="filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(10deg); animation: preloaderFloat 1.5s ease-in-out infinite alternate;">
                            <div class="preloader-glow absolute inset-[-20px] rounded-full" 
                                 style="background: radial-gradient(circle, rgba(197,160,89,0.35) 0%, transparent 70%); animation: preloaderPulse 1.5s ease-in-out infinite;"></div>
                        </div>
                        <p class="mt-8 text-[#C5A059] font-bold text-xs uppercase tracking-[0.3em]">Yến Sào Tám Thủy</p>
                        <div class="w-24 h-[2px] bg-white/10 rounded-full mt-4 overflow-hidden">
                            <div class="h-full bg-[#C5A059]" style="animation: preloaderBar 1.5s ease-in-out infinite;"></div>
                        </div>
                    </div>
                </div>
            `;

            // 3. Thời gian chờ tối thiểu 1.5s (điện ảnh)
            const minDelay = new Promise(resolve => setTimeout(resolve, 1500));

            // 4. Tải data JSON bài viết
            const fetchJSON = fetch(`./data/posts/${id}.json`).then(res => {
                if (!res.ok) throw new Error('Failed to fetch post');
                return res.json();
            });
            const post = await fetchJSON;

            // 5. Tải trước hình ảnh trong bài viết (Tối đa 2.5s)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const images = Array.from(tempDiv.querySelectorAll('img'));
            
            const imagePromises = images.map(img => {
                return new Promise((resolve) => {
                    if (!img.src) { resolve(); return; }
                    const imageLoad = new Image();
                    imageLoad.src = img.src;
                    imageLoad.onload = resolve;
                    imageLoad.onerror = resolve; // Bỏ qua lỗi ảnh để không chặn hiển thị
                });
            });

            const maxImageTimeout = new Promise(resolve => setTimeout(resolve, 2500));
            const preloadImagesTask = Promise.race([
                Promise.all(imagePromises),
                maxImageTimeout
            ]);

            // Chờ cả 2: Đủ 1.5s tối thiểu VÀ ảnh load xong (hoặc timeout)
            await Promise.all([minDelay, preloadImagesTask]);
            
            // 6. Ẩn preloader (bằng cách ghi đè nội dung thật vào)
            modalContent.innerHTML = `
                <div class="mb-8">
                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-4 uppercase tracking-widest font-bold">
                        <span class="text-[#8B6508]">${post.tags.join(', ')}</span>
                        <span class="w-1 h-1 bg-[#C5A059] rounded-full"></span>
                        <span>${post.date}</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-serif font-black text-[#4A2C2A] mb-6 leading-tight">${post.title}</h2>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-[#4A2C2A] rounded-full flex items-center justify-center text-[#C5A059] font-serif font-black text-lg">T</div>
                        <span class="font-bold text-gray-700">${post.author}</span>
                    </div>
                </div>
                <div class="w-full h-px bg-gray-200 mb-8"></div>
                <div class="prose prose-lg prose-headings:font-serif prose-headings:font-black prose-headings:text-[#4A2C2A] prose-a:text-[#8B6508] max-w-none text-gray-700">
                    ${post.content}
                </div>
            `;
            modalContent.scrollTop = 0; // Đảm bảo cuộn lên trên cùng
            
        } catch (error) {
            console.error(error);
            modalContent.innerHTML = '<p class="text-center text-brand-red py-10 font-bold">Không thể tải nội dung bài viết. Vui lòng thử lại.</p>';
        }
    }
    
    // Expose to window for external links
    window.openPost = openPost;

    function closeModal() {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modalContent.innerHTML = '';
        }, 300);
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    // Init
    if (blogGrid) fetchBlogIndex();
});
