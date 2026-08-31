import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const MAX_BODY_BYTES = 64 * 1024;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const MAX_ROLE_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 4000;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  record.count += 1;
  return true;
}

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', Allow: 'POST' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' }
    });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: 'Request too large.' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (typeof body !== 'object' || body === null) {
    return new Response(JSON.stringify({ error: 'Invalid request format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { name, email, phone, role, message, website } = body as Record<string, unknown>;

  if (website && String(website).trim() !== '') {
    return new Response(JSON.stringify({ error: 'Spam detected.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const safeName = typeof name === 'string' ? name.trim() : '';
  const safeEmail = typeof email === 'string' ? email.trim() : '';
  const safePhone = typeof phone === 'string' ? phone.trim() : '';
  const safeRole = typeof role === 'string' ? role.trim() : '';
  const safeMessage = typeof message === 'string' ? message.trim() : '';

  const errors: string[] = [];
  if (safeName.length < 2) {
    errors.push('Name is required.');
  } else if (safeName.length > MAX_NAME_LENGTH) {
    errors.push('Name is too long.');
  }

  if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
    errors.push('Valid email is required.');
  } else if (safeEmail.length > MAX_EMAIL_LENGTH) {
    errors.push('Email is too long.');
  }

  if (safePhone.length > MAX_PHONE_LENGTH) {
    errors.push('Phone number is too long.');
  }

  if (safeRole.length > MAX_ROLE_LENGTH) {
    errors.push('Role is too long.');
  }

  if (safeMessage.length < 1) {
    errors.push('Message is required.');
  } else if (safeMessage.length > MAX_MESSAGE_LENGTH) {
    errors.push('Message is too long.');
  }

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: errors.join(' ') }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const toEmail = import.meta.env.CONTACT_TO_EMAIL;
  if (!toEmail) {
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: Number(import.meta.env.SMTP_PORT) || 587,
      secure: Number(import.meta.env.SMTP_PORT) === 465,
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS
      }
    });

    const sanitizedName = sanitizeHeaderValue(safeName);
    const sanitizedEmail = sanitizeHeaderValue(safeEmail);
    const sanitizedSubject = sanitizeHeaderValue(`New Contact Form Submission from ${safeName}`);

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1b2130;">
  <h2 style="color: #0b1c39;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; font-weight: bold; color: #0b1c39;">Name:</td><td style="padding: 8px 0;">${escapeHtml(safeName)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; color: #0b1c39;">Email:</td><td style="padding: 8px 0;">${escapeHtml(safeEmail)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; color: #0b1c39;">Phone:</td><td style="padding: 8px 0;">${safePhone ? escapeHtml(safePhone) : 'N/A'}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; color: #0b1c39;">Role:</td><td style="padding: 8px 0;">${safeRole ? escapeHtml(safeRole) : 'N/A'}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; color: #0b1c39;">Message:</td><td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(safeMessage)}</td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"${sanitizedName}" <${sanitizedEmail}>`,
      replyTo: sanitizedEmail,
      to: toEmail,
      subject: sanitizedSubject,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nPhone: ${safePhone || 'N/A'}\nRole: ${safeRole || 'N/A'}\nMessage: ${safeMessage}`,
      html
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Contact form email failed:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Failed to send email. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
