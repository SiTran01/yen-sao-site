const fs = require('fs');
let srcHtml = fs.readFileSync('src/index.html', 'utf8');

// The exact string to replace with
const newHead = `<body class="bg-brand-cream text-gray-700 antialiased overflow-x-clip">

    
    <div id="site-preloader">
        <div class="preloader-inner">
            <div class="preloader-logo">
                <img src="./assets/images/avt-svg.svg" alt="Tám Thủy" class="preloader-img">
                <div class="preloader-glow"></div>
            </div>
            <p class="preloader-name">YẾN SÀO TÁM THỦY</p>
            <div class="preloader-bar"><div class="preloader-bar-fill"></div></div>
        </div>
    </div>

    
    <a href="https://zalo.me/0900000000" target="_blank" rel="noopener"
       id="zalo-chat-bubble" class="zalo-chat-bubble" aria-label="Chat Zalo với Tám Thủy">
        
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="zalo-icon">
            <rect width="48" height="48" rx="12" fill="#0068FF"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
                  fill="white" font-size="16" font-weight="900" font-family="Arial, sans-serif">Z</text>
        </svg>
        
        <span class="zalo-tooltip">Chat với Tám Thủy</span>
        
        <span class="zalo-pulse"></span>
    </a>


    <div id="chim-container" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 9999; opacity: 0;">
        <lottie-player 
            src="./assets/lottie/Bird.json" 
            background="transparent" 
            speed="0.6" 
            style="width: 120px; height: 120px;" 
            loop 
            autoplay>
        </lottie-player>
    </div>


    <header id="main-header"`;

const startIndex = srcHtml.indexOf('<body class="bg-brand-cream text-gray-700 antialiased overflow-x-clip">');
const endIndex = srcHtml.indexOf('<header id="main-header"');

if (startIndex !== -1 && endIndex !== -1) {
    srcHtml = srcHtml.substring(0, startIndex) + newHead + srcHtml.substring(endIndex + '<header id="main-header"'.length);
    fs.writeFileSync('src/index.html', srcHtml, 'utf8');
    console.log('Restored top section successfully without cursor!');
} else {
    console.error('Could not find markers', startIndex, endIndex);
}
