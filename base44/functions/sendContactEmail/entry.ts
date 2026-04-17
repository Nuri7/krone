import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function sendEmail({ to, from_name, subject, html }) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (resendKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${from_name} <info@krone-ammesso.de>`,
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend error: ${res.status} ${await res.text()}`);
    return await res.json();
  }
  console.log(`[EMAIL FALLBACK] To: ${to} | Subject: ${subject}`);
  return { fallback: true };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { first_name, last_name, email, phone = '', message, inquiry_type = 'general', lang = 'de' } = await req.json();

    const typeLabels = {
      general: { de: 'Allgemeine Anfrage', en: 'General Enquiry', it: 'Richiesta generale' },
      wedding: { de: 'Hochzeit & Events', en: 'Wedding & Events', it: 'Matrimoni & eventi' },
      group: { de: 'Gruppenanfrage', en: 'Group Booking', it: 'Prenotazione di gruppo' },
      business: { de: 'Geschäftsreise', en: 'Business Travel', it: "Viaggio d'affari" },
    };
    const typeLabel = typeLabels[inquiry_type]?.[lang] || inquiry_type;

    const autoReplySubjects = {
      de: `Ihre Nachricht ist angekommen — Krone Langenburg by Ammesso`,
      en: `Your message has been received — Krone Langenburg by Ammesso`,
      it: `Il tuo messaggio è stato ricevuto — Krone Langenburg by Ammesso`,
    };
    const autoReplyBodies = {
      de: `<p>Liebe/r ${first_name},</p><p>vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich bei Ihnen zurück.</p><p>Mit freundlichen Grüßen,<br/>Ihr Team von Krone Langenburg by Ammesso</p><hr/><p style="color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</p>`,
      en: `<p>Dear ${first_name},</p><p>Thank you for your message. We have received your enquiry and will be in touch as soon as possible.</p><p>Kind regards,<br/>Your team at Krone Langenburg by Ammesso</p><hr/><p style="color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</p>`,
      it: `<p>Caro/a ${first_name},</p><p>Grazie per il tuo messaggio. Abbiamo ricevuto la tua richiesta e ti risponderemo al più presto.</p><p>Cordiali saluti,<br/>Il team di Krone Langenburg by Ammesso</p><hr/><p style="color:#999;font-size:12px;">Hauptstraße 24 · 74595 Langenburg · info@krone-ammesso.de</p>`,
    };

    await sendEmail({
      to: email,
      from_name: 'Krone Langenburg by Ammesso',
      subject: autoReplySubjects[lang] || autoReplySubjects.de,
      html: autoReplyBodies[lang] || autoReplyBodies.de,
    });

    await sendEmail({
      to: 'info@krone-ammesso.de',
      from_name: 'Krone Website',
      subject: `[Kontakt] ${typeLabel} — ${first_name} ${last_name}`,
      html: `<p><b>Art:</b> ${typeLabel}</p><p><b>Name:</b> ${first_name} ${last_name}</p><p><b>Email:</b> ${email}</p><p><b>Telefon:</b> ${phone || '—'}</p><p><b>Nachricht:</b></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    const inquiries = await base44.asServiceRole.entities.ContactInquiry.filter({ email, status: 'new' });
    if (inquiries.length > 0) {
      await base44.asServiceRole.entities.ContactInquiry.update(inquiries[0].id, { email_sent: true });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});