export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const payload = req.body;
        
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("Missing Telegram configuration");
            return res.status(200).json({ success: true, warning: 'Telegram config missing' });
        }

        const message = `
🚨 <b>CÓ ĐƠN HÀNG MỚI (Yến Sào Tám Thủy)</b> 🚨
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${payload.name || 'Không rõ'}
📞 <b>Số điện thoại:</b> ${payload.phone || 'Không rõ'}
🏠 <b>Địa chỉ:</b> ${payload.address || 'Không rõ'}

📦 <b>Sản phẩm:</b> ${payload.product || 'Không rõ'}
🔢 <b>Số lượng:</b> ${payload.qty || '1'}

📝 <b>Ghi chú:</b> ${payload.note || 'Không có'}
🎁 <b>Quà tặng:</b> ${payload.isGift || 'Không'}
💳 <b>Thanh toán:</b> ${payload.payment || 'COD'}
🔗 <b>Nguồn:</b> ${payload.source || 'Website'}
━━━━━━━━━━━━━━━━━━
`;

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error(`Telegram API Error: ${response.status}`);
        }

        return res.status(200).json({ success: true, message: 'Đã gửi Telegram thành công' });

    } catch (error) {
        console.error("Lỗi khi xử lý đơn hàng:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
