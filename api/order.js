export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
            const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

            if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
                return res.status(500).json({ status: 'error', message: 'Thiếu cấu hình Telegram' });
            }

            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
            if (!response.ok) {
                return res.status(500).json({ status: 'error', message: 'Token Telegram không hợp lệ' });
            }

            return res.status(200).json({ status: 'ok', message: 'Hệ thống đặt hàng sẵn sàng' });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Không thể kết nối đến Telegram' });
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const payload = req.body;
        
        // ── 1. Cấu hình môi trường ──
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK;
        
        const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
        const SMTP_PORT = process.env.SMTP_PORT || 465;
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;

        // ── 2. Tác vụ: Gửi Telegram ──
        const sendTelegram = async () => {
            if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
            const message = `
🚨 <b>CÓ ĐƠN HÀNG MỚI (Yến Sào Tám Thủy)</b> 🚨
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${payload.name || 'Không rõ'}
📞 <b>Số điện thoại:</b> ${payload.phone || 'Không rõ'}
📧 <b>Email:</b> ${payload.email || 'Không có'}
🏠 <b>Địa chỉ:</b> ${payload.address || 'Không rõ'}

📦 <b>Sản phẩm:</b> ${payload.product || 'Không rõ'}
🔢 <b>Số lượng:</b> ${payload.qty || '1'}

📝 <b>Ghi chú:</b> ${payload.note || 'Không có'}
🎁 <b>Quà tặng:</b> ${payload.isGift || 'Không'}
💳 <b>Thanh toán:</b> ${payload.payment || 'COD'}
🔗 <b>Nguồn:</b> ${payload.source || 'Website'}
━━━━━━━━━━━━━━━━━━`;
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
            });
            if (!response.ok) throw new Error(`Telegram API Error: ${response.status}`);
        };

        // ── 3. Tác vụ: Lưu Google Sheets ──
        const saveToSheets = async () => {
            if (!GOOGLE_SHEET_WEBHOOK) return;
            const response = await fetch(GOOGLE_SHEET_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Google Sheets Webhook Error: ${response.status}`);
        };

        // ── 4. Tác vụ: Gửi Email Xác Nhận ──
        const sendCustomerEmail = async () => {
            if (!payload.email || !SMTP_USER || !SMTP_PASS) return;
            
            // Import động để tối ưu serverless function
            const nodemailer = (await import('nodemailer')).default;
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: true,
                auth: { user: SMTP_USER, pass: SMTP_PASS }
            });

            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #b78a48; margin-bottom: 5px;">Cảm ơn bạn đã đặt hàng!</h2>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Yến Sào Tám Thủy - Tinh Hoa Yến Việt</p>
                    </div>
                    <p>Chào <b>${payload.name}</b>,</p>
                    <p>Chúng tôi đã nhận được yêu cầu đặt hàng của bạn. Yến Sào Tám Thủy sẽ sớm liên hệ qua số điện thoại <b>${payload.phone}</b> để xác nhận đơn hàng và thời gian giao hàng.</p>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f3f4f6;">
                        <h3 style="margin-top: 0; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Thông tin đơn hàng của bạn:</h3>
                        <ul style="line-height: 1.8; padding-left: 20px; color: #374151;">
                            <li><b>Sản phẩm:</b> ${payload.product}</li>
                            <li><b>Số lượng/Phân loại:</b> ${payload.qty}</li>
                            <li><b>Địa chỉ nhận hàng:</b> ${payload.address}</li>
                            <li><b>Ghi chú:</b> ${payload.note || 'Không có'}</li>
                            <li><b>Phương thức thanh toán:</b> ${payload.payment || 'Thanh toán khi nhận hàng (COD)'}</li>
                        </ul>
                    </div>
                    
                    <p style="color: #4b5563; font-size: 15px;">Nếu có bất kỳ thắc mắc nào hoặc cần thay đổi thông tin, vui lòng liên hệ hotline/Zalo: <b>0327534965</b>.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;">
                    <p style="text-align: center; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                        <b>Yến Sào Tám Thủy</b><br>
                        Đầm Thị Nại, Bình Định<br>
                        Website: yensaotamthuy.vn
                    </p>
                </div>
            `;

            await transporter.sendMail({
                from: `"Yến Sào Tám Thủy" <${SMTP_USER}>`,
                to: payload.email,
                subject: 'Xác nhận đơn hàng từ Yến Sào Tám Thủy',
                html: htmlContent
            });
        };

        // ── 5. Thực thi song song ──
        const results = await Promise.allSettled([
            sendTelegram(),
            saveToSheets(),
            sendCustomerEmail()
        ]);

        // Ghi log những tác vụ thất bại (nếu có)
        results.forEach((res, index) => {
            if (res.status === 'rejected') {
                const taskName = ['Telegram', 'Sheets', 'Email'][index];
                console.error(`[Order Task Failed - ${taskName}]:`, res.reason);
            }
        });

        // Vẫn báo thành công cho client để UX mượt mà
        return res.status(200).json({ success: true, message: 'Đã tiếp nhận đơn hàng' });

    } catch (error) {
        console.error("Lỗi hệ thống khi xử lý đơn hàng:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
