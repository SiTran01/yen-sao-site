const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Change section height from 100vh to 75vh
content = content.replace(
  'class="blog-hscroll-section hscroll-section relative overflow-hidden" style="background: #fff5e8; height: 100vh;"',
  'class="blog-hscroll-section hscroll-section relative overflow-hidden" style="background: #fff5e8; height: 78vh;"'
);

// 2. Change hscroll-track height from h-screen to match
content = content.replace(
  'id="blog-grid" class="hscroll-track flex items-center h-screen gap-8 pl-[10vw] pr-[15vw]"',
  'id="blog-grid" class="hscroll-track flex items-center gap-8 pl-[10vw] pr-[15vw]" style="height:78vh;"'
);

// 3. Change intro card title font size from 4rem to 3rem
content = content.replace(
  'class="font-serif font-black text-[4rem] text-[#4A2C2A] leading-[1.05] mb-6"',
  'class="font-serif font-black text-[3rem] text-[#4A2C2A] leading-[1.05] mb-6"'
);

// 4. Change intro card width from 300px to 260px
content = content.replace(
  'class="blog-hscroll-intro flex-shrink-0 w-[300px] flex flex-col justify-center pr-8"',
  'class="blog-hscroll-intro flex-shrink-0 w-[260px] flex flex-col justify-center pr-8"'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Blog section resized.');
