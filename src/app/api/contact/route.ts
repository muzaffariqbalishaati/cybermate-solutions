import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-response';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, grade, subject, message } = body;

    if (!name || !email || !phone || !message) {
      return errorResponse('Please fill in all required fields.', 400);
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse('Please enter a valid email address.', 400);
    }

    // Send notification email to admin (non-blocking)
    const adminEmail = process.env.CONTACT_ADMIN_EMAIL || process.env.SMTP_USER || 'muzaffariqbalishaati@gmail.com';
    
    sendEmail({
      to: adminEmail,
      toName: 'CyberMate Admin',
      subject: `New Contact Inquiry from ${name} – ${grade || 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">New Contact Inquiry</h2>
          <p style="color: #6b7280; margin-bottom: 24px; font-size: 14px;">A visitor submitted a contact form on CyberMate Solutions.</p>
          
          <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; font-size: 13px; width: 130px;">Name</td>
              <td style="padding: 12px 16px; color: #111827; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; font-size: 13px;">Email</td>
              <td style="padding: 12px 16px; color: #111827; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; font-size: 13px;">Phone</td>
              <td style="padding: 12px 16px; color: #111827; font-size: 14px;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; font-size: 13px;">Grade</td>
              <td style="padding: 12px 16px; color: #111827; font-size: 14px;">${grade || 'Not specified'}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; font-size: 13px;">Subject</td>
              <td style="padding: 12px 16px; color: #111827; font-size: 14px;">${subject || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; vertical-align: top; font-size: 13px;">Message</td>
              <td style="padding: 12px 16px; color: #111827; font-size: 14px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>

          <p style="font-size: 12px; color: #9ca3af; margin-top: 24px;">Sent from CyberMate Solutions contact form</p>
        </div>
      `,
    }).catch(() => {});

    // Send confirmation email to the user (non-blocking)
    sendEmail({
      to: email,
      toName: name,
      subject: `We received your inquiry – CyberMate Solutions`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #4f46e5;">Thank you, ${name}!</h2>
          <p style="color: #374151; font-size: 15px;">We have received your inquiry and our academic counselors will contact you at <strong>${phone}</strong> within the next few hours.</p>
          <p style="color: #6b7280; font-size: 14px;">For urgent queries, you can reach us directly:</p>
          <ul style="color: #374151; font-size: 14px;">
            <li>📞 Call: <a href="tel:+919934215013">+91 9934215013</a></li>
            <li>💬 WhatsApp: <a href="https://wa.me/919934215013">+91 9934215013</a></li>
          </ul>
          <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">— CyberMate Solutions Team</p>
        </div>
      `,
    }).catch(() => {});

    return successResponse(
      { submitted: true },
      'Your inquiry has been received. We will contact you shortly!'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
