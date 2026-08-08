const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Find blog section
const blogMarker = 'id="blog"';
const blogIdx = content.indexOf(blogMarker);
const sectionTagStart = content.lastIndexOf('<section', blogIdx);

let depth = 0;
let i = sectionTagStart;
let blogEnd = -1;
while (i < content.length) {
  if (content.startsWith('<section', i)) { depth++; i += 8; }
  else if (content.startsWith('</section>', i)) {
    depth--;
    if (depth === 0) { blogEnd = i + '</section>'.length; break; }
    i += 10;
  } else { i++; }
}

const newBlogSection = `        <section id="blog" class="blog-hscroll-section hscroll-section relative overflow-hidden" style="background: #fff5e8; height: 100vh;">

            <!-- Label -->
            <div class="hscroll-label absolute top-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-none">
                <div class="w-20 h-px bg-[#C5A059]/30"></div>
                <span class="text-[#8B6508] text-[10px] font-bold uppercase tracking-[0.35em] whitespace-nowrap">Góc Chuyên Gia · Kéo Để Khám Phá</span>
                <div class="w-20 h-px bg-[#C5A059]/30"></div>
            </div>

            <!-- Drag hint -->
            <div class="hscroll-drag-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" style="color: rgba(139,101,8,0.7)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                        <path d="M9 11V6a2 2 0 0 1 4 0v5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13 11V9a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6H9a5 5 0 0 1-5-5v-1a2 2 0 0 1 4 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-[10px] uppercase tracking-[0.22em]" style="color: rgba(74,44,42,0.4)">Kéo để khám phá</span>
                </div>
                <div class="flex items-center gap-1 mt-1">
                    <svg class="w-3.5 h-3.5 hscroll-chev-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: rgba(197,160,89,0.3)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    <svg class="w-3.5 h-3.5 hscroll-chev-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: rgba(197,160,89,0.55)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    <svg class="w-3.5 h-3.5 hscroll-chev-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: rgba(197,160,89,0.8)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </div>
            </div>

            <!-- Right fade -->
            <div class="hscroll-more-right absolute right-0 top-0 bottom-0 w-48 pointer-events-none" style="z-index:25; background: linear-gradient(to left, #fff5e8 0%, rgba(255,245,232,0.7) 40%, transparent 100%);"></div>

            <!-- Track — intro card + blog cards injected by blog.js -->
            <div id="blog-grid" class="hscroll-track flex items-center h-screen gap-8 pl-[10vw] pr-[15vw]">

                <!-- Intro card -->
                <div class="blog-hscroll-intro flex-shrink-0 w-[300px] flex flex-col justify-center pr-8">
                    <p class="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em] mb-5">Tám Thủy</p>
                    <h2 class="font-serif font-black text-[4rem] text-[#4A2C2A] leading-[1.05] mb-6">
                        <span class="hscroll-line-wrap"><span class="hscroll-intro-line blog-intro-line">Kiến</span></span>
                        <span class="hscroll-line-wrap"><span class="hscroll-intro-line blog-intro-line">Thức</span></span>
                        <span class="hscroll-line-wrap"><span class="hscroll-intro-line blog-intro-line" style="color: #C5A059">&amp; Cẩm</span></span>
                        <span class="hscroll-line-wrap"><span class="hscroll-intro-line blog-intro-line">Nang</span></span>
                    </h2>
                    <p class="hscroll-intro-el blog-intro-el text-[#4A2C2A]/50 text-sm leading-relaxed max-w-[240px]">
                        Bí quyết và kiến thức từ chuyên gia yến sào Tám Thủy.
                    </p>
                </div>

            </div>
        </section>`;

content = content.substring(0, sectionTagStart) + newBlogSection + content.substring(blogEnd);
fs.writeFileSync(path, content, 'utf8');
console.log('Blog section replaced successfully!');
