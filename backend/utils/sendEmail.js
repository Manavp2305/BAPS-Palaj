const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create transporter
    // For Development we might use Mailtrap, but user asked for Nodemailer with Gmail assumption in prompts
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g. 'gmail'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2) Define email options
    const mailOptions = {
        from: `Yuvak Mandal <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html
    };

    // 3) Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
