export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const payload = req.body;
        
        // ── 1. Cấu hình môi trường ──
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        const NEWSLETTER_SHEET_WEBHOOK = process.env.NEWSLETTER_SHEET_WEBHOOK;
        const PROMO_CODE = process.env.PROMO_CODE || 'WELCOME10';
        
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
🎉 <b>CÓ KHÁCH ĐĂNG KÝ NHẬN ƯU ĐÃI</b> 🎉
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${payload.name || 'Không rõ'}
📞 <b>Số điện thoại:</b> ${payload.phone || 'Không rõ'}
📧 <b>Email:</b> ${payload.email || 'Không rõ'}
🎁 <b>Mã đã cấp:</b> ${PROMO_CODE}
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
            if (!NEWSLETTER_SHEET_WEBHOOK) return;
            const sheetPayload = { ...payload, code: PROMO_CODE };
            const response = await fetch(NEWSLETTER_SHEET_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheetPayload)
            });
            if (!response.ok) throw new Error(`Google Sheets Webhook Error: ${response.status}`);
        };

        // ── 4. Tác vụ: Gửi Email Chứa Mã Giảm Giá ──
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
                    <div style="padding: 30px 20px; text-align: center;">
                        <h2 style="color: #380A12; margin-top: 0; font-size: 22px;">Chào mừng bạn đến với Yến Sào Tám Thủy!</h2>
                        <p style="color: #4b5563; line-height: 1.6; text-align: left;">Chào <b>${payload.name}</b>,</p>
                        <p style="color: #4b5563; line-height: 1.6; text-align: left;">Cảm ơn bạn đã quan tâm và đăng ký nhận thông tin từ chúng tôi. Như đã hứa, Yến Sào Tám Thủy xin gửi tặng bạn <b>Mã Giảm Giá 10%</b> áp dụng cho đơn hàng đầu tiên!</p>
                        
                        <!-- Promo Code Box -->
                        <div style="background-color: #faf9f6; border: 2px dashed #C5A059; padding: 25px; margin: 30px 0; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase;">Mã Ưu Đãi Của Bạn</p>
                            <h3 style="margin: 0; color: #380A12; font-size: 32px; letter-spacing: 3px;">${PROMO_CODE}</h3>
                        </div>
                        
                        <p style="color: #4b5563; line-height: 1.6; text-align: left; font-size: 14px;"><b>Cách sử dụng:</b> Khi đặt hàng trên Website, bạn chỉ cần nhập mã này vào phần <b>Ghi chú</b>, hoặc đọc mã này cho nhân viên tư vấn khi chúng tôi gọi điện xác nhận đơn hàng.</p>
                        
                        <div style="margin-top: 30px;">
                            <a href="${SITE_URL}/#products" style="display: inline-block; background-color: #C5A059; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Khám Phá Sản Phẩm Ngay</a>
                        </div>
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
                subject: '🎁 Tặng bạn Mã Giảm Giá 10% từ Yến Sào Tám Thủy',
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
                console.error(`[Newsletter Task Failed - ${taskName}]:`, res.reason);
            }
        });

        return res.status(200).json({ success: true, message: 'Đã xử lý newsletter' });

    } catch (error) {
        console.error("Lỗi hệ thống khi xử lý newsletter:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
