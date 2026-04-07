const axios = require('axios');

// Brevo API URL
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmailViaAPI = async (toEmail, subject, html) => {
    try {
        const apiKey = process.env.BREVO_API_KEY; // API Key lấy từ Brevo
        const senderEmail = process.env.EMAIL_USER; // Email bạn đã xác thực trên Brevo (ví dụ: email Gmail của bạn)
        const senderName = 'FigureCurator';

        if (!apiKey) {
            console.warn('⚠️ Thiếu BREVO_API_KEY trong file .env');
        }

        const response = await axios.post(
            BREVO_API_URL,
            {
                sender: { name: senderName, email: senderEmail },
                to: [{ email: toEmail }],
                subject: subject,
                htmlContent: html
            },
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json'
                }
            }
        );
        return { success: true, messageId: response.data?.messageId || 'Brevo_Sent' };
    } catch (error) {
        console.error(`❌ Email API Failed for ${toEmail}:`, error.response ? JSON.stringify(error.response.data) : error.message);
        return { success: false, error: error.message };
    }
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTP = async (toEmail, otp, purpose = 'verify') => {

    const isVerify = purpose === 'verify';
    const subject = isVerify
        ? '🔐 Mã xác thực đăng ký - FigureCurator'
        : '🔑 Mã đặt lại mật khẩu - FigureCurator';
    const heading = isVerify
        ? 'Xác thực tài khoản'
        : 'Đặt lại mật khẩu';
    const description = isVerify
        ? 'Cảm ơn bạn đã đăng ký tài khoản tại FigureCurator. Vui lòng nhập mã xác thực bên dưới để kích hoạt tài khoản của bạn.'
        : 'Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhập mã xác thực bên dưới để tiếp tục.';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background:#f4f7fa; font-family: 'Segoe UI', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa; padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                            <td style="background:linear-gradient(135deg, #00658d, #00adef); padding:32px 40px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; font-style:italic; letter-spacing:-0.02em;">
                                    FigureCurator
                                </h1>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <h2 style="margin:0 0 12px; color:#181c1e; font-size:20px; font-weight:700;">
                                    ${heading}
                                </h2>
                                <p style="margin:0 0 28px; color:#6e7881; font-size:14px; line-height:1.6;">
                                    ${description}
                                </p>
                                <!-- OTP Code -->
                                <div style="background:#f0f7fb; border:2px dashed #00adef; border-radius:12px; padding:24px; text-align:center; margin:0 0 28px;">
                                    <p style="margin:0 0 8px; color:#8a949d; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; font-weight:600;">
                                        Mã xác thực của bạn
                                    </p>
                                    <p style="margin:0; color:#00658d; font-size:36px; font-weight:800; letter-spacing:8px; font-family:monospace;">
                                        ${otp}
                                    </p>
                                </div>
                                <p style="margin:0 0 8px; color:#6e7881; font-size:13px; line-height:1.5;">
                                    ⏰ Mã xác thực có hiệu lực trong <strong style="color:#181c1e;">5 phút</strong>.
                                </p>
                                <p style="margin:0; color:#6e7881; font-size:13px; line-height:1.5;">
                                    ⚠️ Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background:#f8fafb; padding:20px 40px; border-top:1px solid #e8ecef; text-align:center;">
                                <p style="margin:0; color:#8a949d; font-size:11px;">
                                    © 2024 FigureCurator. Bộ sưu tập Figure & Anime Goods cao cấp.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await sendEmailViaAPI(toEmail, subject, html);
        if(!info.success) throw new Error(info.error);
        console.log(`📧 OTP Email triggered for ${toEmail}`);
        return { success: true, messageId: 'api' };
    } catch (error) {
        console.error(`❌ Failed to send OTP to ${toEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

// Send Order Status email
const sendOrderStatusEmail = async (toEmail, status, orderId) => {

    let statusText = '';
    let heading = '';
    let description = '';

    if (status === 'processing' || status === 'confirmed') {
        heading = 'Đơn hàng đã được xác nhận';
        statusText = 'ĐANG XỬ LÝ';
        description = `Đơn hàng <strong>${orderId}</strong> của bạn đã được xác nhận và đang trong quá trình đóng gói.`;
    } else if (status === 'shipping') {
        heading = 'Đơn hàng đang giao';
        statusText = 'ĐANG VẬN CHUYỂN';
        description = `Đơn hàng <strong>${orderId}</strong> của bạn đã được bàn giao cho đơn vị vận chuyển.`;
    } else if (status === 'delivered') {
        heading = 'Giao hàng thành công';
        statusText = 'ĐÃ GIAO';
        description = `Đơn hàng <strong>${orderId}</strong> của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm!`;
    } else if (status === 'cancelled') {
        heading = 'Đơn hàng đã huỷ';
        statusText = 'ĐÃ HUỶ';
        description = `Đơn hàng <strong>${orderId}</strong> của bạn đã bị huỷ. Nếu bạn có thắc mắc, vui lòng liên hệ chúng tôi.`;
    } else {
        return { success: false, error: 'Invalid status' };
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background:#f4f7fa; font-family: 'Segoe UI', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa; padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                            <td style="background:linear-gradient(135deg, #00658d, #00adef); padding:32px 40px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; font-style:italic; letter-spacing:-0.02em;">
                                    FigureCurator
                                </h1>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <h2 style="margin:0 0 12px; color:#181c1e; font-size:20px; font-weight:700;">
                                    ${heading}
                                </h2>
                                <p style="margin:0 0 28px; color:#6e7881; font-size:14px; line-height:1.6;">
                                    ${description}
                                </p>
                                <div style="background:#f0f7fb; border:2px dashed #00adef; border-radius:12px; padding:24px; text-align:center; margin:0 0 28px;">
                                    <p style="margin:0 0 8px; color:#8a949d; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; font-weight:600;">
                                        Trạng thái
                                    </p>
                                    <p style="margin:0; color:#00658d; font-size:28px; font-weight:800; letter-spacing:2px;">
                                        ${statusText}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background:#f8fafb; padding:20px 40px; border-top:1px solid #e8ecef; text-align:center;">
                                <p style="margin:0; color:#8a949d; font-size:11px;">
                                    © 2026 FigureCurator. Bộ sưu tập Figure & Anime Goods cao cấp.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await sendEmailViaAPI(toEmail, `Cập nhật đơn hàng ${orderId} - FigureCurator`, html);
        if(!info.success) throw new Error(info.error);
        console.log(`📧 Order Status Email triggered for ${toEmail}`);
        return { success: true, messageId: 'api' };
    } catch (error) {
        console.error(`❌ Failed to send Order Status to ${toEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

// Send Order Placed Email
const sendOrderPlacedEmail = async (toEmail, orderId, items, total, shippingAddress) => {

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding:12px; border-bottom:1px solid #e8ecef;">
                <p style="margin:0; color:#181c1e; font-weight:600; font-size:14px;">${item.name || 'Sản phẩm'}</p>
            </td>
            <td style="padding:12px; border-bottom:1px solid #e8ecef; text-align:center;">
                <p style="margin:0; color:#6e7881; font-size:14px;">x${item.quantity}</p>
            </td>
            <td style="padding:12px; border-bottom:1px solid #e8ecef; text-align:right;">
                <p style="margin:0; color:#181c1e; font-weight:600; font-size:14px;">${(item.price * item.quantity).toLocaleString()}đ</p>
            </td>
        </tr>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background:#f4f7fa; font-family: 'Segoe UI', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa; padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                            <td style="background:linear-gradient(135deg, #00658d, #00adef); padding:32px 40px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; font-style:italic; letter-spacing:-0.02em;">
                                    FigureCurator
                                </h1>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <h2 style="margin:0 0 12px; color:#181c1e; font-size:20px; font-weight:700; text-align:center;">
                                    Xác nhận đặt hàng thành công
                                </h2>
                                <p style="margin:0 0 28px; color:#6e7881; font-size:14px; line-height:1.6; text-align:center;">
                                    Cảm ơn bạn đã đặt hàng tại FigureCurator! Đơn hàng <strong>${orderId}</strong> của bạn đã được ghi nhận.
                                </p>
                                
                                <div style="background:#f8fafb; border-radius:12px; padding:24px; margin-bottom:28px;">
                                    <h3 style="margin:0 0 16px; font-size:16px; color:#00658d;">Thông tin giao hàng</h3>
                                    <p style="margin:0; color:#181c1e; font-size:14px; line-height:1.5;">${shippingAddress}</p>
                                </div>

                                <h3 style="margin:0 0 16px; font-size:16px; color:#00658d;">Chi tiết đơn hàng</h3>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:24px;">
                                    <thead>
                                        <tr>
                                            <th style="padding:12px; text-align:left; border-bottom:2px solid #e8ecef; color:#8a949d; font-size:12px; text-transform:uppercase;">Sản phẩm</th>
                                            <th style="padding:12px; text-align:center; border-bottom:2px solid #e8ecef; color:#8a949d; font-size:12px; text-transform:uppercase;">SL</th>
                                            <th style="padding:12px; text-align:right; border-bottom:2px solid #e8ecef; color:#8a949d; font-size:12px; text-transform:uppercase;">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itemsHtml}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" style="padding:16px 12px; text-align:right; color:#6e7881; font-size:14px;"><strong>Tổng cộng:</strong></td>
                                            <td style="padding:16px 12px; text-align:right; color:#ff6b00; font-size:20px; font-weight:800;">${total.toLocaleString()}đ</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background:#f8fafb; padding:20px 40px; border-top:1px solid #e8ecef; text-align:center;">
                                <p style="margin:0; color:#8a949d; font-size:11px;">
                                    © 2026 FigureCurator. Bộ sưu tập Figure & Anime Goods cao cấp.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await sendEmailViaAPI(toEmail, `Xác nhận đơn hàng ${orderId} - FigureCurator`, html);
        if(!info.success) throw new Error(info.error);
        console.log(`📧 Order Placed Email triggered for ${toEmail}`);
        return { success: true, messageId: 'api' };
    } catch (error) {
        console.error(`❌ Failed to send Order Placed Email to ${toEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { generateOTP, sendOTP, sendOrderStatusEmail, sendOrderPlacedEmail };
