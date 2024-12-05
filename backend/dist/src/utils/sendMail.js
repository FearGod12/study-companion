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
    EmailSubject["StudySessionReminder"] = "Study Session Reminder";
})(EmailSubject || (EmailSubject = {}));
function createTransporter() {
    return nodemailer.createTransport({
        // host: 'smpt.gmail.com',
        // port: 465,
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
}
async function renderTemplate(templateName, data) {
    const templatePath = `./templates/${templateName}.html`;
    const template = await fs.readFile(templatePath, 'utf-8');
    return ejs.render(template, data);
}
export async function sendMail(subject, templateName, data) {
    const transporter = createTransporter();
    try {
        const html = await renderTemplate(templateName, data);
        const mailOptions = {
            from: `"Study Companion" <${process.env.GMAIL_USER}>`,
            to: data.user.email,
            subject: subject,
            html: html,
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
}
export async function sendErrorMail(subject, templateName, error, req) {
    const transporter = createTransporter();
    try {
        const errorData = parseErrorData(error, req);
        const html = await renderTemplate(templateName, { error: errorData });
        const rootEmail = process.env.ROOT_EMAIL;
        if (!rootEmail) {
            throw new Error('ROOT_EMAIL environment variable is not defined');
        }
        const mailOptions = {
            from: `"Study Companion API" <${process.env.GMAIL_USER}>`,
            to: rootEmail.split(','),
            subject: subject,
            html: html,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (err) {
        console.error('Error sending error email:', err);
        // Consider implementing a fallback notification method here
    }
}
function parseErrorData(error, req) {
    const errorStack = error.stack?.split('\n') || [];
    const errorLocation = errorStack[1] ? errorStack[1].trim() : 'Unknown location';
    const match = errorLocation.match(/\((.+):(\d+):\d+\)$/);
    return {
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
}
