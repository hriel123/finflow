// E-mail da recuperação de senha, pela API HTTPS do Brevo (o plano gratuito
// do Render bloqueia SMTP). Sem BREVO_API_KEY e MAIL_FROM (remetente
// verificado no Brevo), a recuperação de senha fica desligada.
const { BREVO_API_KEY, MAIL_FROM } = process.env;

export const mailConfigured = Boolean(BREVO_API_KEY && MAIL_FROM);

export async function sendMail({ to, subject, text, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name: 'FinFlow', email: MAIL_FROM }, to: [{ email: to }], subject, textContent: text, htmlContent: html }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`brevo ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
