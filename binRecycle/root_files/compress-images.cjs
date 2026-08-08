/**
 * compress-images.js
 * Nén và resize ảnh PNG nặng → giảm từ ~15MB xuống ~2-3MB
 * Chạy: node compress-images.js
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const imgDir = path.join(__dirname, 'src/assets/images');

const tasks = [
    { file: 'bg.png',            maxW: 1920, q: 80 },
    { file: 'yen-hop1.png',      maxW: 1200, q: 82 },
    { file: 'farm1.png',         maxW: 1400, q: 82 },
    { file: 'farm2.png',         maxW: 1400, q: 82 },
    { file: 'image1.png',        maxW: 800,  q: 82 },
    { file: 'yen-hop.png',       maxW: 800,  q: 82 },
    { file: 'yen-tinh-che.png',  maxW: 800,  q: 82 },
    { file: 'yen-tinh-che1.png', maxW: 800,  q: 82 },
    { file: 'yen-hu.png',        maxW: 800,  q: 82 },
    { file: 'yen-hu1.png',       maxW: 800,  q: 82 },
    { file: 'bg-product.png',    maxW: 1600, q: 82 },
];

async function compress() {
    console.log('🗜  Đang nén ảnh...\n');
    let totalBefore = 0, totalAfter = 0;

    for (const { file, maxW, q } of tasks) {
        const src = path.join(imgDir, file);
        if (!fs.existsSync(src)) { console.log(`⚠  Bỏ qua (không tìm thấy): ${file}`); continue; }

        const before = fs.statSync(src).size;
        const tmpOut = src + '.tmp';

        await sharp(src)
            .resize({ width: maxW, withoutEnlargement: true })
            .png({ quality: q, compressionLevel: 9, palette: false })
            .toFile(tmpOut);

        fs.renameSync(tmpOut, src);
        const after = fs.statSync(src).size;

        totalBefore += before;
        totalAfter  += after;

        const pct = ((1 - after / before) * 100).toFixed(1);
        const beforeMB = (before / 1024 / 1024).toFixed(2);
        const afterMB  = (after  / 1024 / 1024).toFixed(2);

        console.log(`✓  ${file.padEnd(24)} ${beforeMB}MB → ${afterMB}MB  (-${pct}%)`);
    }

    const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
    console.log(`\n🎉 Tổng: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (giảm ${totalPct}%)`);
}

compress().catch(console.error);
