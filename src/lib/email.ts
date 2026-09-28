import nodemailer from 'nodemailer';
import prisma from './prisma';
import { parseTemplateVariables } from './utils';

interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  template?: string;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Log email regardless of sending status
  const logEntry = {
    toEmail: options.to,
    toName: options.toName,
    subject: options.subject,
    template: options.template,
    status: 'sent',
  };

  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('[Email] SMTP not configured. Email would have been sent to:', options.to);
      console.log('[Email] Subject:', options.subject);
      await prisma.emailLog.create({ data: { ...logEntry, status: 'skipped' } });
      return;
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'EduPro <noreply@edupro.com>',
      to: `${options.toName ? `"${options.toName}" ` : ''}<${options.to}>`,
      subject: options.subject,
      html: options.html,
    });

    await prisma.emailLog.create({ data: logEntry });
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    await prisma.emailLog.create({
      data: { ...logEntry, status: 'failed', error: String(error) },
    });
  }
}

export async function sendTemplateEmail(
  templateSlug: string,
  to: string,
  toName: string,
  variables: Record<string, string>
): Promise<void> {
  const template = await prisma.emailTemplate.findUnique({
    where: { slug: templateSlug, isActive: true },
  });

  if (!template) {
    console.warn(`[Email] Template not found: ${templateSlug}`);
    return;
  }

  const subject = parseTemplateVariables(template.subject, variables);
  const html = parseTemplateVariables(template.body, variables);

  await sendEmail({ to, toName, subject, html, template: templateSlug });
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await sendTemplateEmail('welcome', email, name, {
    student_name: name,
    platform_name: process.env.NEXT_PUBLIC_APP_NAME || 'EduPro',
    login_url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<void> {
  await sendTemplateEmail('password_reset', email, name, {
    student_name: name,
    reset_url: resetUrl,
    platform_name: process.env.NEXT_PUBLIC_APP_NAME || 'EduPro',
  });
}

export async function sendCourseEnrollmentEmail(
  email: string,
  name: string,
  courseName: string,
  courseLink: string
): Promise<void> {
  await sendTemplateEmail('course_enrollment', email, name, {
    student_name: name,
    course_name: courseName,
    course_link: courseLink,
    platform_name: process.env.NEXT_PUBLIC_APP_NAME || 'EduPro',
  });
}

export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  invoiceNumber: string,
  amount: string
): Promise<void> {
  await sendTemplateEmail('payment_confirmation', email, name, {
    student_name: name,
    invoice_number: invoiceNumber,
    amount,
    platform_name: process.env.NEXT_PUBLIC_APP_NAME || 'EduPro',
  });
}

export async function sendLiveClassReminderEmail(
  email: string,
  name: string,
  className: string,
  classTime: string,
  joinUrl: string
): Promise<void> {
  await sendTemplateEmail('live_class_reminder', email, name, {
    student_name: name,
    class_name: className,
    class_time: classTime,
    join_url: joinUrl,
    platform_name: process.env.NEXT_PUBLIC_APP_NAME || 'EduPro',
  });
}
