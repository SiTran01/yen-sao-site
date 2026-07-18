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
        blogGrid.innerHTML = '';
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(74,44,42,0.05)] hover:shadow-[0_20px_40px_rgba(74,44,42,0.12)] transition-all duration-500 hover:-translate-y-2 border border-[#F4EDE5]';
            card.innerHTML = `
                <div class="relative w-full h-64 overflow-hidden bg-[#F4EDE5]">
                    <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#8B6508] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ${post.tags[0]}
                    </div>
                </div>
                <div class="p-8">
                    <div class="flex items-center gap-4 text-xs text-gray-500 mb-4 uppercase tracking-widest">
                        <span>${post.date}</span>
                        <span class="w-1 h-1 bg-[#C5A059] rounded-full"></span>
                        <span>${post.readTime}</span>
                    </div>
                    <h3 class="text-xl font-serif font-black text-[#4A2C2A] mb-3 group-hover:text-[#8B6508] transition-colors leading-snug line-clamp-2">
                        ${post.title}
                    </h3>
                    <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        ${post.excerpt}
                    </p>
                    <div class="flex items-center gap-2 text-[#C5A059] font-bold text-sm group-hover:gap-4 transition-all">
                        <span>Đọc tiếp</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => openPost(post.id));
            blogGrid.appendChild(card);
        });
    }

    async function openPost(id) {
        try {
            // Show loading state
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            
            modalContent.innerHTML = `
                <div class="flex justify-center py-20">
                    <div class="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                </div>
            `;

            const res = await fetch(`./data/posts/${id}.json`);
            if (!res.ok) throw new Error('Failed to fetch post');
            const post = await res.json();
            
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
        } catch (error) {
            console.error(error);
            modalContent.innerHTML = '<p class="text-center text-brand-red">Không thể tải nội dung bài viết.</p>';
        }
    }

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
