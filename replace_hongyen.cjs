const fs = require('fs');
const pathIndex = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\index.html';
const pathInfo = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\data\\yensaotamthuy\\info.json';
const pathChatbot = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\js\\chatbot.js';

// 1. Update info.json
let info = fs.readFileSync(pathInfo, 'utf8');
info = info.replace(
  '"name": "Hồng Yến",\n      "description": "Dòng yến vô cùng quý hiếm, chứa hàm lượng khoáng chất sắt (Fe) cao. Sợi yến có màu cam đến đỏ, dai ngon và dinh dưỡng vượt trội."',
  '"name": "Yến Tươi",\n      "description": "Yến sào đã được nhặt sạch lông, chưa qua sấy khô. Tiện lợi, giữ nguyên vẹn độ tươi ngon và dưỡng chất, cực kỳ phù hợp cho người bận rộn muốn chưng ngay."'
);
fs.writeFileSync(pathInfo, info, 'utf8');

// 2. Update index.html
let indexHtml = fs.readFileSync(pathIndex, 'utf8');
// Meta tags
indexHtml = indexHtml.replace('hồng yến, hũ yến chưng sẵn', 'yến tươi, hũ yến chưng sẵn');
indexHtml = indexHtml.replace('yến tinh chế, hồng yến, yến chưng', 'yến tinh chế, yến tươi, yến chưng');
indexHtml = indexHtml.replace('tinh chế, hồng yến đảo. Giao toàn quốc', 'tinh chế, yến tươi. Giao toàn quốc');
indexHtml = indexHtml.replace('hồng yến đảo, hũ yến chưng.', 'yến tươi, hũ yến chưng.');

// Product Card
indexHtml = indexHtml.replace('alt="Hồng Yến"', 'alt="Yến Tươi"');
indexHtml = indexHtml.replace('>Hồng Yến<br>Đảo Quý</h3>', '>Yến Tươi<br>Nguyên Chất</h3>');

// Testimonial
indexHtml = indexHtml.replace(
  '"Hồng yến đúng là quý hiếm thật. Màu cam đẹp tự nhiên, sợi nguyên không gãy. Tôi mua cho mẹ già bổ dưỡng, mẹ thích lắm. Giá hơi cao nhưng xứng đáng!"',
  '"Yến tươi bên shop cực kỳ chất lượng. Sợi yến nhặt sạch sẽ, chưng lên nở to và dai giòn sần sật. Rất tiện lợi cho người bận rộn như tôi!"'
);
indexHtml = indexHtml.replace('Mua Hồng Yến', 'Mua Yến Tươi');

fs.writeFileSync(pathIndex, indexHtml, 'utf8');

// 3. Update chatbot.js
let chatbot = fs.readFileSync(pathChatbot, 'utf8');
chatbot = chatbot.replace('❤️ Hồng Yến Đảo — loại quý hiếm nhất\\n', '');
fs.writeFileSync(pathChatbot, chatbot, 'utf8');

console.log('Replaced Hồng Yến with Yến Tươi in all files.');
