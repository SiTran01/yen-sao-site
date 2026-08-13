/**
 * generate-responsive-images.mjs
 * Dùng sharp để tạo các phiên bản ảnh responsive (400w, 800w) từ ảnh .webp gốc
 * Chạy: node scripts/generate-responsive-images.mjs
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_DIR  = path.join(__dirname, '../src/assets/images');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/images');

// Ảnh cần generate responsive variants (các ảnh được dùng trong UI)
const TARGET_IMAGES = [
    'yen-hop.webp',
    'yen-hop1.webp',
    'yen-hu.webp',
    'yen-hu1.webp',
    'yen-tinh-che.webp',
    'yen-tinh-che1.webp',
    'farm1.webp',
    'farm2.webp',
    'image1.webp',
    'bg-product.webp',
];

// Kích thước cần tạo: [suffix, width, quality]
const SIZES = [
    { suffix: '-400w', width: 400, quality: 82 },
    { suffix: '-800w', width: 800, quality: 85 },
];

async function run() {
    let success = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🦅 Sharp Responsive Image Generator — Yến Sào Tám Thủy\n');

    for (const filename of TARGET_IMAGES) {
        const inputPath = path.join(INPUT_DIR, filename);
        const baseName  = path.basename(filename, '.webp');

        if (!existsSync(inputPath)) {
            console.warn(`  ⚠️  Không tìm thấy: ${filename} — bỏ qua`);
            skipped++;
            continue;
        }

        // Lấy thông tin ảnh gốc
        const meta = await sharp(inputPath).metadata();
        console.log(`📦 ${filename} (${meta.width}×${meta.height}px, ${(meta.size / 1024).toFixed(1)}KB)`);

        for (const { suffix, width, quality } of SIZES) {
            // Không upscale ảnh nhỏ hơn target width
            if (meta.width && meta.width <= width) {
                console.log(`   ⏭️  ${baseName}${suffix}.webp — bỏ qua (gốc ${meta.width}px ≤ ${width}px)`);
                skipped++;
                continue;
            }

            const outputFilename = `${baseName}${suffix}.webp`;
            const outputPath = path.join(OUTPUT_DIR, outputFilename);

            if (existsSync(outputPath)) {
                console.log(`   ✅  ${outputFilename} — đã tồn tại, bỏ qua`);
                skipped++;
                continue;
            }

            try {
                const info = await sharp(inputPath)
                    .resize({ width, withoutEnlargement: true })
                    .webp({ quality })
                    .toFile(outputPath);

                const savings = meta.size
                    ? Math.round((1 - info.size / meta.size) * 100)
                    : 0;

                console.log(`   ✨  ${outputFilename} (${info.width}×${info.height}px, ${(info.size / 1024).toFixed(1)}KB) — tiết kiệm ${savings}%`);
                success++;
            } catch (err) {
                console.error(`   ❌  Lỗi khi xử lý ${outputFilename}:`, err.message);
                errors++;
            }
        }
    }

    console.log(`\n📊 Kết quả: ${success} ảnh mới, ${skipped} bỏ qua, ${errors} lỗi`);
    console.log('✅ Xong! Giờ cập nhật HTML để dùng srcset.\n');
}

run().catch(console.error);
