const fs = require('fs');

const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Find the position of 'Cơ sở chăn nuôi'
const aboutSectionIndex = content.indexOf('Cơ sở chăn nuôi');
if (aboutSectionIndex === -1) throw new Error('Not found about section');

const btnIndex = content.indexOf('Xem thêm', aboutSectionIndex);
const linkStart = content.lastIndexOf('<a href', btnIndex);
const linkEnd = content.indexOf('</a>', btnIndex) + '</a>'.length;

const oldBtn = content.substring(linkStart, linkEnd);
console.log('Old button:\\n' + oldBtn);

const newBtn = `<a href="javascript:void(0)" onclick="window.openPost('co-so-chan-nuoi')"
                            class="inline-block px-8 py-3 bg-[#a56d38] text-white font-bold rounded-full hover:bg-brand-brown transition-all shadow-lg hover:shadow-xl">
                            Xem thêm
                        </a>`;

content = content.substring(0, linkStart) + newBtn + content.substring(linkEnd);
fs.writeFileSync(path, content, 'utf8');
console.log('Button updated safely.');
