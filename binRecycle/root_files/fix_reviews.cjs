const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
let html = fs.readFileSync(path, 'utf8');

// Tìm đoạn bị hỏng - có CR+LF mixed
const startBad = '</section>\n                        H';
const idx = html.indexOf(startBad);
if (idx === -1) { console.log('Not found!'); process.exit(1); }

// Tìm thấy, cắt từ đây đến hết <div class="grid
const endMarker = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">';
const endIdx = html.indexOf(endMarker, idx);
if (endIdx === -1) { console.log('End not found!'); process.exit(1); }

const replacement = `        </section>

        <section id="reviews" class="py-12 md:py-24 bg-brand-cream overflow-hidden">
            <div class="container mx-auto px-4 md:px-6">

                
                <div class="text-center mb-8 md:mb-16">
                    <p class="text-[#C5A059] text-xs font-bold uppercase tracking-[0.35em] mb-4">Kh\u00e1ch H\u00e0ng N\u00f3i G\u00ec</p>
                    <h2 class="font-serif font-black text-3xl md:text-5xl text-[#4A2C2A]">
                        H\u01a1n <span class="text-[#C5A059]">5.000</span> Kh\u00e1ch Tin T\u01b0\u1edfng
                    </h2>
                    <div class="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 md:mt-6"></div>
                </div>

                
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">`;

html = html.substring(0, idx) + replacement + html.substring(endIdx + endMarker.length);
fs.writeFileSync(path, html, 'utf8');
console.log('Fixed! Total lines:', html.split('\n').length);
