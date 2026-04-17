import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function sendEmail({ to, from_name, subject, html }) {
  const resendKey = Deno.env.get('RESEND_API_KEY');

  if (resendKey) {
    // Use Resend for real delivery to external addresses
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
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${res.status} ${err}`);
    }
    return await res.json();
  }

  // Fallback: log only (no external key available)
  console.log(`[EMAIL FALLBACK] To: ${to} | Subject: ${subject}`);
  console.log('To enable real email delivery, set RESEND_API_KEY in secrets.');
  return { fallback: true };
}

const TEMPLATES = {
  de: {
    subject: (ref) => `Reservierungsbestätigung ${ref} — Krone Langenburg by Ammesso`,
    body: (d) => `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f9f7f4;margin:0;padding:0;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
  <div style="background:#92400e;padding:32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:22px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:36px;">
    <h2 style="color:#1c1917;font-weight:600;font-size:20px;margin-bottom:6px;">Reservierung bestätigt ✓</h2>
    <p style="color:#78716c;font-size:14px;margin-bottom:24px;">Ref: <strong style="color:#1c1917;">${d.ref}</strong></p>
    <div style="background:#f9f7f4;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;font-size:14px;color:#44403c;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#a8a29e;">Name</td><td style="padding:6px 0;font-weight:500;">${d.first_name} ${d.last_name}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Datum</td><td style="padding:6px 0;font-weight:500;">${d.date}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Uhrzeit</td><td style="padding:6px 0;font-weight:500;">${d.time} Uhr</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Personen</td><td style="padding:6px 0;font-weight:500;">${d.guests}</td></tr>
        ${d.requests ? `<tr><td style="padding:6px 0;color:#a8a29e;vertical-align:top;">Wünsche</td><td style="padding:6px 0;">${d.requests}</td></tr>` : ''}
      </table>
    </div>
    <p style="color:#78716c;font-size:13px;line-height:1.6;">Wir freuen uns auf Ihren Besuch. Bei Fragen oder Änderungen erreichen Sie uns unter <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> oder <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a>.</p>
    <p style="color:#a8a29e;font-size:12px;margin-top:24px;">Bei Nichterscheinen bitten wir um frühzeitige Absage.</p>
  </div>
  <div style="background:#1c1917;padding:20px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div></body></html>`,
  },
  en: {
    subject: (ref) => `Reservation Confirmation ${ref} — Krone Langenburg by Ammesso`,
    body: (d) => `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f9f7f4;margin:0;padding:0;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;">
  <div style="background:#92400e;padding:32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:22px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:36px;">
    <h2 style="color:#1c1917;font-weight:600;font-size:20px;margin-bottom:6px;">Reservation Confirmed ✓</h2>
    <p style="color:#78716c;font-size:14px;margin-bottom:24px;">Ref: <strong>${d.ref}</strong></p>
    <div style="background:#f9f7f4;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#a8a29e;">Name</td><td style="padding:6px 0;font-weight:500;">${d.first_name} ${d.last_name}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Date</td><td style="padding:6px 0;font-weight:500;">${d.date}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Time</td><td style="padding:6px 0;font-weight:500;">${d.time}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Guests</td><td style="padding:6px 0;font-weight:500;">${d.guests}</td></tr>
        ${d.requests ? `<tr><td style="padding:6px 0;color:#a8a29e;">Requests</td><td style="padding:6px 0;">${d.requests}</td></tr>` : ''}
      </table>
    </div>
    <p style="color:#78716c;font-size:13px;line-height:1.6;">Contact us at <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> or <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a>.</p>
  </div>
  <div style="background:#1c1917;padding:20px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div></body></html>`,
  },
  it: {
    subject: (ref) => `Conferma prenotazione ${ref} — Krone Langenburg by Ammesso`,
    body: (d) => `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f9f7f4;margin:0;padding:0;">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;">
  <div style="background:#92400e;padding:32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:22px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:36px;">
    <h2 style="color:#1c1917;font-weight:600;font-size:20px;margin-bottom:6px;">Prenotazione Confermata ✓</h2>
    <p style="color:#78716c;font-size:14px;margin-bottom:24px;">Rif: <strong>${d.ref}</strong></p>
    <div style="background:#f9f7f4;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#a8a29e;">Nome</td><td style="padding:6px 0;font-weight:500;">${d.first_name} ${d.last_name}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Data</td><td style="padding:6px 0;font-weight:500;">${d.date}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Orario</td><td style="padding:6px 0;font-weight:500;">${d.time}</td></tr>
        <tr><td style="padding:6px 0;color:#a8a29e;">Persone</td><td style="padding:6px 0;font-weight:500;">${d.guests}</td></tr>
        ${d.requests ? `<tr><td style="padding:6px 0;color:#a8a29e;">Richieste</td><td style="padding:6px 0;">${d.requests}</td></tr>` : ''}
      </table>
    </div>
    <p style="color:#78716c;font-size:13px;line-height:1.6;">Contattaci: <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> o <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a>.</p>
  </div>
  <div style="background:#1c1917;padding:20px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div></body></html>`,
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { ref, first_name, last_name, email, date, time, guests, lang = 'de', requests = '' } = await req.json();
    const tpl = TEMPLATES[lang] || TEMPLATES.de;

    // Send confirmation to guest
    await sendEmail({
      to: email,
      from_name: 'Krone Langenburg by Ammesso',
      subject: tpl.subject(ref),
      html: tpl.body({ ref, first_name, last_name, date, time, guests, requests }),
    });

    // Send internal notification
    await sendEmail({
      to: 'info@krone-ammesso.de',
      from_name: 'Krone Website',
      subject: `[NEU] Reservierung ${ref} — ${first_name} ${last_name} — ${date} ${time}`,
      html: `<p><b>Neue Tischreservierung:</b></p><ul><li>Ref: ${ref}</li><li>Name: ${first_name} ${last_name}</li><li>Email: ${email}</li><li>Datum: ${date}</li><li>Zeit: ${time}</li><li>Personen: ${guests}</li>${requests ? `<li>Wünsche: ${requests}</li>` : ''}</ul>`,
    });

    // Mark email sent on reservation record
    const reservations = await base44.asServiceRole.entities.Reservation.filter({ reservation_ref: ref });
    if (reservations.length > 0) {
      await base44.asServiceRole.entities.Reservation.update(reservations[0].id, { email_sent: true });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});