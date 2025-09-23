
const nodemailer = require('nodemailer');

module.exports.sendMail = (emailUser, subject, html) => {
    // Tạo transporter dùng Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,      // Gmail của bạn
            pass: process.env.EMAIL_PASSWORD,  // Mật khẩu ứng dụng (App Password)
        },
    });

    // Nội dung email
    const mailOptions = {
        from: process.env.EMAIL_USER, // hoặc "Tên hiển thị <email@gmail.com>"
        to: emailUser,
        subject: subject,
        html: html,
    };

    // Gửi mail với callback
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
