const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let html = fs.readFileSync(path, 'utf8');

const targetStr = '&copy; 2024 Yến Sào Việt. Designed with ❤️ by Antigravity.';

const idx = html.indexOf(targetStr);
if (idx !== -1) {
    const startOfReplace = idx + targetStr.length;
    const newEnd = `
                </div>
            </div>
        </footer>

    </main>
    
    <div class="toast-container" id="toast-container"></div>

    <button class="floating-order-btn" id="floating-order-btn"
            onclick="window.luxuryScrollTo('#order')">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        Đặt Hàng Ngay
    </button>
    
    <script defer src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <script src="./assets/vendor/lenis.min.js"></script>
    <script src="./assets/vendor/gsap.min.js"></script>
    <script src="./assets/vendor/ScrollTrigger.min.js"></script>
    <script defer src="./js/database.js"></script>
    <script defer src="./js/script.js"></script>
    <!-- AI Chatbot logic -->
    <script defer src="./js/chatbot.js"></script>
    <!-- Blog logic -->
    <script defer src="./js/blog.js"></script>

    <!-- Blog Modal -->
    <div id="blog-modal" class="fixed inset-0 z-[1000] hidden opacity-0 transition-opacity duration-300 items-center justify-center p-4 md:p-8">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-300 scale-95 data-[state=open]:scale-100">
            <!-- Close Button -->
            <button id="blog-modal-close" class="absolute top-6 right-6 w-10 h-10 bg-[#F4EDE5] rounded-full flex items-center justify-center text-[#4A2C2A] hover:bg-[#C5A059] hover:text-white transition-colors z-50 shadow-md">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <!-- Scrollable Body -->
            <div id="blog-modal-content" class="overflow-y-auto flex-1 p-8 md:p-12" data-lenis-prevent>
                <!-- Content will be injected here -->
            </div>
        </div>
    </div>
</body>
</html>`;

    html = html.substring(0, startOfReplace) + newEnd;
    fs.writeFileSync(path, html, 'utf8');
    console.log('Fixed index.html ending!');
} else {
    console.log('Target string not found.');
}
