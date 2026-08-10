import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Email transporter verification failed:", error);
    } else {
        console.log("Email transporter is ready to send emails");
    }
});

export async function sendEmail({ to, subject, html, text }) {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text,
        };

        const details = await transporter.sendMail(mailOptions);

        console.log("Email sent:", details.messageId);

        return details;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}