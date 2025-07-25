import ejs from 'ejs';
import fs from 'fs/promises';
import nodemailer, { Transporter } from 'nodemailer';
import { User } from '@prisma/client';

export enum EmailSubject {
  ResetPassword = 'Reset Password',
  ResetPin = 'Reset Transaction Pin',
  VerifyEmail = 'Verify Email',
  PaymentConfirmation = 'Payment Confirmation',
  ServerError = 'Internal Server Error',
  StudySessionReminder = 'Study Session Reminder',
}

interface EmailData {
  user: User;
  token?: string;
  [key: string]: unknown;
}

interface ErrorData {
  timestamp: string;
  fileName: string;
  lineNumber: number;
  message: string;
  stack: string;
  method: string;
  url: string;
  additionalInfo: {
    headers: unknown;
    body: unknown;
    params: unknown;
    query: unknown;
  };
}

function createTransporter(): Transporter {
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

async function renderTemplate(templateName: string, data: any): Promise<string> {
  const templatePath = `./templates/${templateName}.html`;
  const template = await fs.readFile(templatePath, 'utf-8');
  return ejs.render(template, data);
}

export async function sendMail(
  subject: EmailSubject,
  templateName: string,
  data: EmailData
): Promise<void> {
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
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

export async function sendErrorMail(
  subject: EmailSubject,
  templateName: string,
  error: Error,
  req: any
): Promise<void> {
  const transporter = createTransporter();

  try {
    const errorData: ErrorData = parseErrorData(error, req);
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
  } catch (err) {
    console.error('Error sending error email:', err);
    // Consider implementing a fallback notification method here
  }
}

function parseErrorData(error: Error, req: any): ErrorData {
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
