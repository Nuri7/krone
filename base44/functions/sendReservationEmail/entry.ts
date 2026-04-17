import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TEMPLATES = {
  de: {
    subject: (ref) => `Reservierungsbestätigung ${ref} — Krone Langenburg by Ammesso`,
    body: (d) => `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
  <div style="background:#92400e;padding:28px 32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:20px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1c1917;font-size:18px;margin-bottom:4px;">Reservierung bestätigt ✓</h2>
    <p style="color:#78716c;font-size:13px;margin-bottom:20px;">Ref: <strong>${d.ref}</strong></p>
    <table style="width:100%;font-size:13px;border-collapse:collapse;background:#f9f7f4;border-radius:10px;padding:16px;">
      <tr><td style="padding:5px 12px;color:#a8a29e;">Name</td><td style="padding:5px 12px;font-weight:500;">${d.first_name} ${d.last_name}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Datum</td><td style="padding:5px 12px;font-weight:500;">${d.date}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Uhrzeit</td><td style="padding:5px 12px;font-weight:500;">${d.time} Uhr</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Personen</td><td style="padding:5px 12px;font-weight:500;">${d.guests}</td></tr>
      ${d.requests ? `<tr><td style="padding:5px 12px;color:#a8a29e;vertical-align:top;">Wünsche</td><td style="padding:5px 12px;">${d.requests}</td></tr>` : ''}
    </table>
    <p style="color:#78716c;font-size:13px;margin-top:20px;line-height:1.6;">
      Wir freuen uns auf Ihren Besuch!<br/>
      Bei Fragen: <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> · <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a>
    </p>
    <p style="color:#a8a29e;font-size:11px;margin-top:16px;">Bitte sagen Sie frühzeitig ab, falls Sie nicht erscheinen können.</p>
  </div>
  <div style="background:#1c1917;padding:16px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div>`,
  },
  en: {
    subject: (ref) => `Reservation Confirmation ${ref} — Krone Langenburg by Ammesso`,
    body: (d) => `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
  <div style="background:#92400e;padding:28px 32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:20px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1c1917;font-size:18px;margin-bottom:4px;">Reservation Confirmed ✓</h2>
    <p style="color:#78716c;font-size:13px;margin-bottom:20px;">Ref: <strong>${d.ref}</strong></p>
    <table style="width:100%;font-size:13px;border-collapse:collapse;background:#f9f7f4;border-radius:10px;padding:16px;">
      <tr><td style="padding:5px 12px;color:#a8a29e;">Name</td><td style="padding:5px 12px;font-weight:500;">${d.first_name} ${d.last_name}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Date</td><td style="padding:5px 12px;font-weight:500;">${d.date}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Time</td><td style="padding:5px 12px;font-weight:500;">${d.time}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Guests</td><td style="padding:5px 12px;font-weight:500;">${d.guests}</td></tr>
      ${d.requests ? `<tr><td style="padding:5px 12px;color:#a8a29e;">Requests</td><td style="padding:5px 12px;">${d.requests}</td></tr>` : ''}
    </table>
    <p style="color:#78716c;font-size:13px;margin-top:20px;line-height:1.6;">
      We look forward to welcoming you!<br/>
      Questions: <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> · <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a>
    </p>
  </div>
  <div style="background:#1c1917;padding:16px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div>`,
  },
  it: {
    subject: (ref) => `Conferma prenotazione ${ref} — Krone Langenburg by Ammesso`,
    body: (d) => `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
  <div style="background:#92400e;padding:28px 32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:20px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1c1917;font-size:18px;margin-bottom:4px;">Prenotazione Confermata ✓</h2>
    <p style="color:#78716c;font-size:13px;margin-bottom:20px;">Rif: <strong>${d.ref}</strong></p>
    <table style="width:100%;font-size:13px;border-collapse:collapse;background:#f9f7f4;padding:16px;">
      <tr><td style="padding:5px 12px;color:#a8a29e;">Nome</td><td style="padding:5px 12px;font-weight:500;">${d.first_name} ${d.last_name}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Data</td><td style="padding:5px 12px;font-weight:500;">${d.date}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Orario</td><td style="padding:5px 12px;font-weight:500;">${d.time}</td></tr>
      <tr><td style="padding:5px 12px;color:#a8a29e;">Persone</td><td style="padding:5px 12px;font-weight:500;">${d.guests}</td></tr>
      ${d.requests ? `<tr><td style="padding:5px 12px;color:#a8a29e;">Richieste</td><td style="padding:5px 12px;">${d.requests}</td></tr>` : ''}
    </table>
    <p style="color:#78716c;font-size:13px;margin-top:20px;">
      Non vediamo l'ora di accogliervi! <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a>
    </p>
  </div>
  <div style="background:#1c1917;padding:16px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div>`,
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { ref, first_name, last_name, email, date, time, guests, lang = 'de', requests = '' } = await req.json();
    const tpl = TEMPLATES[lang] || TEMPLATES.de;
    const html = tpl.body({ ref, first_name, last_name, date, time, guests, requests });

    // Guest confirmation
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: 'Krone Langenburg by Ammesso',
      subject: tpl.subject(ref),
      body: html,
    });

    // Internal notification to property
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@krone-ammesso.de',
      from_name: 'Krone Website',
      subject: `[NEU] Reservierung ${ref} — ${first_name} ${last_name} — ${date} ${time}`,
      body: `<p><b>Neue Tischreservierung</b></p><ul><li>Ref: ${ref}</li><li>Name: ${first_name} ${last_name}</li><li>Email: ${email}</li><li>Datum: ${date}</li><li>Zeit: ${time}</li><li>Personen: ${guests}</li>${requests ? `<li>Wünsche: ${requests}</li>` : ''}</ul>`,
    });

    // Mark email_sent on the reservation record
    const reservations = await base44.asServiceRole.entities.Reservation.filter({ reservation_ref: ref });
    if (reservations.length > 0) {
      await base44.asServiceRole.entities.Reservation.update(reservations[0].id, { email_sent: true });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});