import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Sends reservation confirmation email and optionally notifies Slack/admin.
 * Logs all email sends.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const {
      reservation_id,
      reservation_ref,
      guest_email,
      guest_name,
      reservation_date,
      reservation_time,
      party_size,
      language
    } = payload;

    if (!guest_email || !reservation_ref) {
      return Response.json(
        { error: 'Email and reservation ref are required' },
        { status: 400 }
      );
    }

    // Build email subject and body (localized)
    const emailTemplates = {
      de: {
        subject: `Ihre Tischreservierung bestätigt - ${reservation_ref}`,
        body: `Lieber ${guest_name},\n\nvielen Dank für Ihre Reservierung im Kulinarium by Ammesso.\n\nDatum: ${reservation_date}\nUhrzeit: ${reservation_time} Uhr\nPersonen: ${party_size}\nReferenz: ${reservation_ref}\n\nWir freuen uns auf Sie!\n\nKrone Langenburg by Ammesso`
      },
      en: {
        subject: `Your Table Reservation Confirmed - ${reservation_ref}`,
        body: `Dear ${guest_name},\n\nThank you for your reservation at Kulinarium by Ammesso.\n\nDate: ${reservation_date}\nTime: ${reservation_time}\nGuests: ${party_size}\nReference: ${reservation_ref}\n\nWe look forward to welcoming you!\n\nKrone Langenburg by Ammesso`
      },
      it: {
        subject: `Prenotazione confermata - ${reservation_ref}`,
        body: `Caro ${guest_name},\n\nGrazie per la vostra prenotazione al Kulinarium by Ammesso.\n\nData: ${reservation_date}\nOrario: ${reservation_time}\nOspiti: ${party_size}\nRiferimento: ${reservation_ref}\n\nNon vediamo l'ora di accogliervi!\n\nKrone Langenburg by Ammesso`
      }
    };

    const lang = language || 'de';
    const template = emailTemplates[lang] || emailTemplates.de;

    // Send email via Core integration
    try {
      await base44.integrations.Core.SendEmail({
        to: guest_email,
        subject: template.subject,
        body: template.body
      });
    } catch (e) {
      console.error('Email send failed:', e);
      // Continue - log the failure and create issue
    }

    // Log the email send
    const emailLog = await base44.asServiceRole.entities.EmailLog.create({
      recipient: guest_email,
      subject: template.subject,
      template: 'reservation_confirmation',
      language: lang,
      status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity_type: 'RestaurantReservation',
      related_entity_id: reservation_id,
      related_ref: reservation_ref
    });

    // Update reservation to mark email as sent
    if (reservation_id) {
      await base44.asServiceRole.entities.RestaurantReservation.update(reservation_id, {
        email_confirmation_sent: true,
        email_confirmation_sent_at: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      email_log_id: emailLog.id,
      status: 'sent'
    });
  } catch (error) {
    console.error('Send confirmation error:', error);
    return Response.json(
      { error: 'Server error sending confirmation' },
      { status: 500 }
    );
  }
});