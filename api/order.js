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

        const rawSiteUrl = process.env.VITE_SITE_URL || 'https://yensaotamthuy.vn';
        const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

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
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                    
                    <!-- Header -->
                    <div style="background-color: #380A12; padding: 30px 20px; text-align: center; border-bottom: 3px solid #C5A059;">
                        <h1 style="color: #C5A059; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Yến Sào Tám Thủy</h1>
                        <p style="color: #F0DEB4; margin: 10px 0 0 0; font-style: italic; font-size: 14px;">Tinh Hoa Yến Việt - Trao Gửi Sức Khỏe Vàng</p>
                    </div>

                    <!-- Body -->
                    <div style="padding: 30px 20px;">
                        <h2 style="color: #380A12; margin-top: 0; font-size: 20px;">Cảm ơn bạn đã đặt hàng!</h2>
                        <p style="color: #4b5563; line-height: 1.6;">Chào <b>${payload.name}</b>,</p>
                        <p style="color: #4b5563; line-height: 1.6;">Chúng tôi đã nhận được yêu cầu đặt hàng của bạn. Đội ngũ chăm sóc khách hàng sẽ sớm liên hệ qua số điện thoại <b style="color: #380A12;">${payload.phone}</b> để xác nhận đơn và thời gian giao hàng.</p>
                        
                        <!-- Order Details -->
                        <div style="background-color: #faf9f6; border: 1px solid #e5e7eb; border-left: 4px solid #C5A059; padding: 20px; margin: 25px 0; border-radius: 4px;">
                            <h3 style="margin-top: 0; color: #380A12; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Thông tin đơn hàng</h3>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280; width: 40%;">Sản phẩm:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #111827; font-weight: bold;">${payload.product}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280;">Số lượng/Phân loại:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #111827; font-weight: bold;">${payload.qty}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280;">Thanh toán:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #111827; font-weight: bold;">${payload.payment || 'Thanh toán khi nhận hàng (COD)'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #6b7280;">Địa chỉ nhận hàng:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px dashed #e5e7eb; color: #111827; font-weight: bold;">${payload.address}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Ghi chú:</td>
                                    <td style="padding: 8px 0; color: #111827; font-weight: bold;">${payload.note || 'Không có'}</td>
                                </tr>
                            </table>
                            <div style="margin-top: 20px; text-align: center;">
                                <a href="${SITE_URL}/#products" style="display: inline-block; background-color: #C5A059; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Khám Phá Thêm Sản Phẩm</a>
                            </div>
                        </div>
                        
                        <p style="color: #4b5563; line-height: 1.6;">Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ trực tiếp qua hotline/Zalo: <b style="color: #C5A059; font-size: 16px;">0327534965</b>.</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                            <strong style="color: #6b7280;">Yến Sào Tám Thủy</strong><br>
                            Hotline/Zalo: 0327534965<br>
                            Đầm Thị Nại, Bình Định<br>
                            <a href="${SITE_URL}" style="color: #C5A059; text-decoration: none;">${SITE_URL.replace(/^https?:\/\//, '')}</a>
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"Yến Sào Tám Thủy" <${SMTP_USER}>`,
                to: payload.email,
                subject: `🎉 Xác nhận đơn hàng từ Yến Sào Tám Thủy - ${payload.name}`,
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
