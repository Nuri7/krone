import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Sends cancellation email to guest when reservation is cancelled by admin or guest
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Allow both authenticated users and service-role (admin action)
    const { reservation_ref, guest_email, guest_first_name, lang = 'de', reason = '' } = await req.json();

    if (!reservation_ref || !guest_email) {
      return Response.json({ error: 'reservation_ref and guest_email are required' }, { status: 400 });
    }

    const subjects = {
      de: `Stornierung Ihrer Reservierung ${reservation_ref} — Krone Langenburg`,
      en: `Cancellation of your reservation ${reservation_ref} — Krone Langenburg`,
      it: `Cancellazione della prenotazione ${reservation_ref} — Krone Langenburg`,
    };

    const bodies = {
      de: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
  <div style="background:#92400e;padding:28px 32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:20px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1c1917;font-size:18px;margin-bottom:4px;">Reservierung storniert</h2>
    <p style="color:#78716c;font-size:13px;margin-bottom:16px;">Ref: <strong>${reservation_ref}</strong></p>
    <p style="color:#78716c;font-size:13px;line-height:1.7;">Sehr geehrte/r ${guest_first_name || 'Gast'},<br/><br/>
    Ihre Reservierung wurde storniert.${reason ? `<br/>Grund: ${reason}` : ''}<br/><br/>
    Bei Fragen kontaktieren Sie uns bitte:<br/>
    <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> · <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a></p>
  </div>
  <div style="background:#1c1917;padding:16px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div>`,
      en: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
  <div style="background:#92400e;padding:28px 32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:20px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1c1917;font-size:18px;margin-bottom:4px;">Reservation Cancelled</h2>
    <p style="color:#78716c;font-size:13px;margin-bottom:16px;">Ref: <strong>${reservation_ref}</strong></p>
    <p style="color:#78716c;font-size:13px;line-height:1.7;">Dear ${guest_first_name || 'Guest'},<br/><br/>
    Your reservation has been cancelled.${reason ? `<br/>Reason: ${reason}` : ''}<br/><br/>
    Questions? Contact us:<br/>
    <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a> · <a href="tel:+4979054177" style="color:#b45309;">+49 7905 41770</a></p>
  </div>
  <div style="background:#1c1917;padding:16px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div>`,
      it: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;">
  <div style="background:#92400e;padding:28px 32px;text-align:center;">
    <p style="color:#fbbf24;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px;">Krone Langenburg</p>
    <h1 style="color:#fff;font-size:20px;font-weight:300;margin:0;">by Ammesso</h1>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#1c1917;font-size:18px;margin-bottom:4px;">Prenotazione Cancellata</h2>
    <p style="color:#78716c;font-size:13px;margin-bottom:16px;">Rif: <strong>${reservation_ref}</strong></p>
    <p style="color:#78716c;font-size:13px;line-height:1.7;">Gentile ${guest_first_name || 'Ospite'},<br/><br/>
    La sua prenotazione è stata cancellata.${reason ? `<br/>Motivo: ${reason}` : ''}<br/><br/>
    Per domande: <a href="mailto:info@krone-ammesso.de" style="color:#b45309;">info@krone-ammesso.de</a></p>
  </div>
  <div style="background:#1c1917;padding:16px;text-align:center;">
    <p style="color:#78716c;font-size:11px;margin:0;">Hauptstraße 24 · 74595 Langenburg · +49 7905 41770</p>
  </div>
</div>`,
    };

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: guest_email,
      from_name: 'Krone Langenburg by Ammesso',
      subject: subjects[lang] || subjects.de,
      body: bodies[lang] || bodies.de,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('sendCancellationEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});