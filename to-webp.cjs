/**
 * to-webp.cjs
 * Convert PNG → WebP (nhỏ hơn 60-80% mà vẫn giữ nguyên chất lượng)
 * Chạy: node to-webp.cjs
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const imgDir = path.join(__dirname, 'src/assets/images');

const tasks = [
    // File ảnh nền (không cần transparency) → quality thấp hơn
    { file: 'bg.png',            maxW: 1920, q: 75, lossless: false },
    { file: 'bg-product.png',    maxW: 1600, q: 80, lossless: false },
    { file: 'farm1.png',         maxW: 1400, q: 80, lossless: false },
    { file: 'farm2.png',         maxW: 1400, q: 80, lossless: false },

    // Product images (có transparency) → near-lossless để giữ sharp
    { file: 'yen-hop.png',       maxW: 800,  q: 85, lossless: false },
    { file: 'yen-hop1.png',      maxW: 1200, q: 85, lossless: false },
    { file: 'yen-tinh-che.png',  maxW: 800,  q: 85, lossless: false },
    { file: 'yen-tinh-che1.png', maxW: 800,  q: 85, lossless: false },
    { file: 'yen-hu.png',        maxW: 800,  q: 85, lossless: false },
    { file: 'yen-hu1.png',       maxW: 800,  q: 85, lossless: false },
    { file: 'image1.png',        maxW: 800,  q: 85, lossless: false },
];

async function convert() {
    console.log('🔄 Converting PNG → WebP...\n');
    let totalBefore = 0, totalAfter = 0;
    const mapping = []; // Để in ra danh sách rename cần update trong HTML/CSS

    for (const { file, maxW, q, lossless } of tasks) {
        const srcPath  = path.join(imgDir, file);
        if (!fs.existsSync(srcPath)) { console.log(`⚠  Bỏ qua: ${file}`); continue; }

        const webpFile = file.replace(/\.png$/i, '.webp');
        const dstPath  = path.join(imgDir, webpFile);

        const before = fs.statSync(srcPath).size;

        await sharp(srcPath)
            .resize({ width: maxW, withoutEnlargement: true })
            .webp({ quality: q, lossless, alphaQuality: 90, effort: 6 })
            .toFile(dstPath);

        const after = fs.statSync(dstPath).size;
        totalBefore += before;
        totalAfter  += after;

        const pct      = ((1 - after / before) * 100).toFixed(1);
        const beforeMB = (before / 1024 / 1024).toFixed(2);
        const afterMB  = (after  / 1024 / 1024).toFixed(2);

        console.log(`✓  ${file.padEnd(24)} → ${webpFile.padEnd(28)} ${beforeMB}MB → ${afterMB}MB  (-${pct}%)`);
        mapping.push({ from: `./assets/images/${file}`, to: `./assets/images/${webpFile}` });
    }

    const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
    console.log(`\n🎉 Tổng: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (giảm ${totalPct}%)`);

    // Ghi mapping ra file để dễ update HTML/CSS
    const mappingJson = JSON.stringify(mapping, null, 2);
    fs.writeFileSync(path.join(__dirname, 'webp-mapping.json'), mappingJson);
    console.log('\n📋 Mapping đã lưu vào webp-mapping.json');
    console.log('   → Cần update src trong index.html và url() trong style.css\n');
}

convert().catch(console.error);
