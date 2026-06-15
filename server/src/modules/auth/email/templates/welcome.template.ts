export function buildWelcomeEmail(params: {
  firstName: string;
  appUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Welcome to Basis Sports';

  const text = [
    `Hi ${params.firstName},`,
    '',
    'Your account has been created successfully.',
    `Get started at ${params.appUrl}`,
  ].join('\n');

  const html = `
    <p>Hi ${params.firstName},</p>
    <p>Your account has been created successfully.</p>
    <p><a href="${params.appUrl}">Get started</a></p>
  `;

  return { subject, html, text };
}