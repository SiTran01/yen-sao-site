const fs = require('fs');

const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Delete <section id="about" ...> ... </section>
const aboutStart = content.indexOf('<section id="about"');
if (aboutStart !== -1) {
    const aboutEnd = content.indexOf('</section>', aboutStart) + '</section>'.length;
    content = content.substring(0, aboutStart) + content.substring(aboutEnd);
}

// 2. Remove desktop nav link
// <a href="#about" class="nav-item-premium uppercase tracking-[0.1em] no-underline" style="text-decoration: none;">Về chúng tôi</a>
const desktopNav = '<a href="#about" class="nav-item-premium uppercase tracking-[0.1em] no-underline" style="text-decoration: none;">Về chúng tôi</a>';
content = content.replace(desktopNav, '');

// 3. Remove mobile nav link
// <a href="#about" onclick="document.getElementById('mobile-menu').classList.add('translate-x-full')">Về chúng tôi</a>
const mobileNav = `<a href="#about" onclick="document.getElementById('mobile-menu').classList.add('translate-x-full')">Về chúng
                tôi</a>`;
const mobileNav2 = `<a href="#about" onclick="document.getElementById('mobile-menu').classList.add('translate-x-full')">Về chúng tôi</a>`;
content = content.replace(mobileNav, '');
content = content.replace(mobileNav2, '');
// Use regex for mobile nav because of possible newlines
content = content.replace(/<a href="#about".*?>Về chúng[\s\S]*?tôi<\/a>/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Removed about section and nav links.');
