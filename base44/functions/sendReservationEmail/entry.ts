import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send reservation confirmation email & set to confirmed.
 * Logs send attempt, confirms reservation on success.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { ref, first_name, last_name, email, date, time, guests, lang, requests } = payload;

    if (!ref || !email) {
      return Response.json({ error: 'Missing ref or email' }, { status: 400 });
    }

    // Find reservation
    const reservations = await base44.asServiceRole.entities.Reservation.filter(
      { reservation_ref: ref },
      undefined,
      1
    );

    if (!reservations || reservations.length === 0) {
      console.warn(`Reservation not found: ${ref}`);
      return Response.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const reservation = reservations[0];

    // Localized email templates
    const templates = {
      de: {
        subject: `Reservierung bestätigt — Ref: ${ref}`,
        body: `<html><body style="font-family:Arial;"><h2>Tischreservierung bestätigt</h2><p>Liebe/r ${first_name} ${last_name},</p><p>vielen Dank für Ihre Reservierung. Wir freuen uns auf Sie!</p><table><tr><td>Datum:</td><td><strong>${date}</strong></td></tr><tr><td>Uhrzeit:</td><td><strong>${time}</strong></td></tr><tr><td>Personen:</td><td><strong>${guests}</strong></td></tr><tr><td>Ref:</td><td><strong>${ref}</strong></td></tr></table><p>Bei Fragen kontaktieren Sie bitte info@krone-ammesso.de</p><p>Viele Grüße,<br>Krone Langenburg Team</p></body></html>`
      },
      en: {
        subject: `Reservation Confirmed — Ref: ${ref}`,
        body: `<html><body style="font-family:Arial;"><h2>Table Reservation Confirmed</h2><p>Dear ${first_name} ${last_name},</p><p>Thank you for your reservation. We look forward to welcoming you!</p><table><tr><td>Date:</td><td><strong>${date}</strong></td></tr><tr><td>Time:</td><td><strong>${time}</strong></td></tr><tr><td>Guests:</td><td><strong>${guests}</strong></td></tr><tr><td>Ref:</td><td><strong>${ref}</strong></td></tr></table><p>If you have any questions, please contact info@krone-ammesso.de</p><p>Best regards,<br>Krone Langenburg Team</p></body></html>`
      },
      it: {
        subject: `Prenotazione confermata — Ref: ${ref}`,
        body: `<html><body style="font-family:Arial;"><h2>Prenotazione confermata</h2><p>Caro/a ${first_name} ${last_name},</p><p>Grazie per la vostra prenotazione. Non vediamo l'ora di accogliervi!</p><table><tr><td>Data:</td><td><strong>${date}</strong></td></tr><tr><td>Ora:</td><td><strong>${time}</strong></td></tr><tr><td>Ospiti:</td><td><strong>${guests}</strong></td></tr><tr><td>Ref:</td><td><strong>${ref}</strong></td></tr></table><p>Per domande, contattateci a info@krone-ammesso.de</p><p>Cordiali saluti,<br>Team Krone Langenburg</p></body></html>`
      }
    };

    const template = templates[lang] || templates.de;

    // Send email via Core integration
    const emailRes = await base44.integrations.Core.SendEmail({
      to: email,
      subject: template.subject,
      body: template.body
    });

    // Log send attempt
    await base44.asServiceRole.entities.EmailLog.create({
      recipient: email,
      subject: template.subject,
      template: 'reservation_confirmation',
      language: lang || 'de',
      status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity_type: 'Reservation',
      related_entity_id: reservation.id,
      related_ref: ref
    }).catch(() => {});

    // Update reservation: mark as confirmed, email_sent=true
    await base44.asServiceRole.entities.Reservation.update(reservation.id, {
      status: 'confirmed',
      email_sent: true,
      confirmed_at: new Date().toISOString()
    });

    return Response.json({ success: true, ref });
  } catch (error) {
    console.error('sendReservationEmail error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});