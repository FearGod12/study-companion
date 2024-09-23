import ejs from 'ejs';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
export var EmailSubject;
(function (EmailSubject) {
    EmailSubject["ResetPassword"] = "Reset Password";
    EmailSubject["ResetPin"] = "Reset Transaction Pin";
    EmailSubject["VerifyEmail"] = "Verify Email";
    EmailSubject["PaymentConfirmation"] = "Payment Confirmation";
    EmailSubject["ServerError"] = "Internal Server Error";
})(EmailSubject || (EmailSubject = {}));
export const sendMail = async (subject, templateName, data) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    try {
        // Read the HTML template
        const templatePath = `./templates/${templateName}.html`;
        const template = await fs.readFile(templatePath, 'utf-8');
        // Render the template with EJS
        const html = ejs.render(template, data);
        const mailOptions = {
            from: `"Study Companion" <${process.env.GMAIL_USER}>`,
            to: data.user.email,
            subject: subject,
            html: html,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (err) {
        throw err;
    }
};
export const sendErrorMail = async (subject, templateName, error, req) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_SERVER_PORT ? parseInt(process.env.SMTP_SERVER_PORT, 10) : 465,
        secure: true, // Changed to true for port 465
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    try {
        const templatePath = `./templates/${templateName}.html`;
        const template = await fs.readFile(templatePath, 'utf-8');
        const errorStack = error.stack?.split('\n') || [];
        const errorLocation = errorStack[1] ? errorStack[1].trim() : 'Unknown location';
        const match = errorLocation.match(/\((.+):(\d+):\d+\)$/);
        const errorData = {
            timestamp: new Date().toISOString(),
            fileName: match ? match[1] : 'Unknown file',
            lineNumber: match ? parseInt(match[2], 10) : 0,
            message: error.message,
            stack: error.stack || 'No stack trace available',
            method: req.method,
            url: req.url,
            additionalInfo: {
                headers: req.headers,
                body: req.body,
                params: req.params,
                query: req.query,
            },
        };
        const html = ejs.render(template, { error: errorData });
        const mailOptions = {
            from: `"Payment Engine API" <${process.env.SMTP_USERNAME}>`,
            to: process.env.ROOT_EMAIL?.split(','),
            subject: subject,
            html: html,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (err) {
        console.error('Error sending email:', err);
    }
};
