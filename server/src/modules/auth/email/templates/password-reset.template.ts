export function buildPasswordResetEmail(params: {
  firstName: string;
  resetUrl: string;
  expiresMinutes: number;
}): { subject: string; html: string; text: string } {
  const subject = 'Reset your Basis Sports password';

  const text = [
    `Hi ${params.firstName},`,
    '',
    'We received a request to reset your password.',
    `Use the link below within ${params.expiresMinutes} minutes:`,
    params.resetUrl,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');

  const html = `
    <p>Hi ${params.firstName},</p>
    <p>We received a request to reset your password.</p>
    <p>
      <a href="${params.resetUrl}">Reset your password</a>
    </p>
    <p>This link expires in ${params.expiresMinutes} minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  return { subject, html, text };
}