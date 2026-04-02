const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTP = async (toEmail, otp, purpose = 'verify') => {
    const transporter = createTransporter();

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

    const mailOptions = {
        from: `"FigureCurator" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 OTP sent to ${toEmail}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Failed to send OTP to ${toEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { generateOTP, sendOTP };
