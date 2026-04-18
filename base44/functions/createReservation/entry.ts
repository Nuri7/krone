import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      first_name, last_name, email, phone = '',
      date, time, guests, requests = '', lang = 'de',
    } = body;

    // Input validation
    if (!first_name || !last_name || !email || !date || !time || !guests) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (guests < 1 || guests > 20) {
      return Response.json({ error: 'Invalid party size' }, { status: 400 });
    }
    if (!/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate date is not in the past
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return Response.json({ error: 'Date must be today or in the future' }, { status: 400 });
    }

    // Use hardcoded capacity as fallback — settings may not be seeded yet
    const maxCapacity = 120;

    // Validate day is not Monday (closed)
    const dayOfWeek = new Date(date + 'T12:00:00').getDay(); // noon to avoid TZ issues
    if (dayOfWeek === 1) {
      return Response.json({ error: 'Restaurant closed on this date' }, { status: 400 });
    }

    // Validate time is within service windows (basic check)
    const LUNCH = { start: '12:00', end: '14:15' };
    const DINNER = { start: '17:30', end: '21:30' };
    const SUNDAY = { start: '12:00', end: '19:30' };
    const isSunday = dayOfWeek === 0;
    const windows = isSunday ? [SUNDAY] : [LUNCH, DINNER];
    const timeValid = windows.some(w => time >= w.start && time <= w.end);
    if (!timeValid) {
      return Response.json({ error: 'Time not available for booking' }, { status: 400 });
    }

    // Get existing reservations for this date/time
    const existing = await base44.asServiceRole.entities.Reservation.filter({
      reservation_date: date,
      reservation_time: time,
      status: { $in: ['pending', 'confirmed'] }
    });
    const used = existing.reduce((sum, r) => sum + (r.party_size || 0), 0);

    // Anti-spam: check if same email submitted in last 2 minutes
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const recentByEmail = await base44.asServiceRole.entities.Reservation.filter({ guest_email: email });
    const veryRecent = recentByEmail.filter(r => r.created_date && r.created_date > twoMinsAgo);
    if (veryRecent.length > 0) {
      return Response.json({ error: 'Please wait a moment before submitting again' }, { status: 429 });
    }

    // Duplicate check: same email + date + time
    const dupKey = `${email.toLowerCase()}|${date}|${time}`;
    const dups = await base44.asServiceRole.entities.Reservation.filter({ duplicate_check_key: dupKey });
    if (dups.length > 0) {
      return Response.json({ error: 'duplicate' }, { status: 409 });
    }

    // LOCK: Re-check capacity immediately before create (prevent race condition)
    const finalCheck = await base44.asServiceRole.entities.Reservation.filter({
      reservation_date: date,
      reservation_time: time,
      status: { $in: ['pending', 'confirmed'] }
    });
    const finalUsed = finalCheck.reduce((sum, r) => sum + (r.party_size || 0), 0);
    if (finalUsed + guests > maxCapacity) {
      return Response.json({ error: 'full', retry_after_ms: 2000 }, { status: 409 });
    }

    // Create reservation (starts as pending, confirmation email will set to confirmed)
    const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
    const reservation = await base44.asServiceRole.entities.Reservation.create({
      reservation_ref: ref,
      status: 'pending',
      guest_first_name: first_name,
      guest_last_name: last_name,
      guest_email: email.toLowerCase(),
      guest_phone: phone,
      reservation_date: date,
      reservation_time: time,
      party_size: guests,
      special_requests: requests,
      language: lang,
      source: 'website',
      duplicate_check_key: dupKey,
      email_sent: false,
      slack_notified: false,
    });

    // Fire notifications (non-blocking, direct async calls)
    // Send confirmation email
    (async () => {
      try {
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
        
        const emailResult = await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: template.subject,
          body: template.body
        });
        
        // VALIDATE email actually succeeded before marking as confirmed
        if (!emailResult) {
          throw new Error('Email service returned no response');
        }
        
        // Update reservation to confirmed + mark email sent
        await base44.asServiceRole.entities.Reservation.update(reservation.id, {
          status: 'confirmed',
          email_sent: true,
          confirmed_at: new Date().toISOString()
        });
        
        // Log success
        await base44.asServiceRole.entities.EmailLog.create({
          recipient: email,
          subject: template.subject,
          template: 'reservation_confirmation',
          language: lang,
          status: 'sent',
          sent_at: new Date().toISOString(),
          related_entity_type: 'Reservation',
          related_entity_id: reservation.id,
          related_ref: ref
        });
      } catch (e) {
        console.error('Email notification failed:', e.message);
        await base44.asServiceRole.entities.EmailLog.create({
          recipient: email,
          subject: `Reservation ${ref}`,
          template: 'reservation_confirmation',
          language: lang,
          status: 'failed',
          failure_reason: e.message,
          sent_at: new Date().toISOString(),
          related_entity_type: 'Reservation',
          related_entity_id: reservation.id,
          related_ref: ref
        }).catch(() => {});
      }
    })();

    // Send Slack notification (non-blocking)
    (async () => {
      try {
        const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
        if (!webhookUrl) return;
        
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks: [
              { type: 'header', text: { type: 'plain_text', text: '🍽️ Neue Tischreservierung', emoji: true } },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
                  { type: 'mrkdwn', text: `*Name:*\n${first_name} ${last_name}` },
                  { type: 'mrkdwn', text: `*Datum:*\n${date}` },
                  { type: 'mrkdwn', text: `*Zeit:*\n${time}` },
                  { type: 'mrkdwn', text: `*Personen:*\n${guests}` },
                  { type: 'mrkdwn', text: `*Sprache:*\n${lang.toUpperCase()}` },
                ]
              }
            ]
          })
        });
        
        await base44.asServiceRole.entities.SlackLog.create({
          channel: '#krone-reservations',
          message_type: 'new_reservation',
          status: 'sent',
          sent_at: new Date().toISOString(),
          related_entity_type: 'Reservation',
          related_ref: ref
        });
      } catch (e) {
        console.error('Slack notification failed:', e.message);
      }
    })();

    return Response.json({ success: true, ref, reservation_id: reservation.id });
  } catch (error) {
    console.error('createReservation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});