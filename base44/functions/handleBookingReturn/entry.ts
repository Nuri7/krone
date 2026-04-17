import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Handles guest return from Beds24.
 * Updates HotelBookingIntent with return status and booking ref if available.
 * Creates or updates sync issue records as needed.
 * Notifies admin via Slack.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const {
      intent_ref,
      return_status, // confirmed, pending, cancelled
      booking_ref,
      guest_email
    } = payload;

    if (!intent_ref) {
      return Response.json(
        { error: 'Intent reference is required' },
        { status: 400 }
      );
    }

    // Find the intent
    const intents = await base44.asServiceRole.entities.HotelBookingIntent.filter(
      { intent_ref },
      undefined,
      1
    );

    if (!intents || intents.length === 0) {
      return Response.json(
        { error: 'Booking intent not found' },
        { status: 404 }
      );
    }

    const intent = intents[0];

    // Update intent with return status
    let updateData = {
      returned_at: new Date().toISOString(),
      return_status: return_status || 'unknown',
      status: `returned_${return_status || 'pending'}`
    };

    if (booking_ref) {
      updateData.beds24_booking_ref = booking_ref;
      updateData.sync_status = 'synced';
    } else {
      updateData.sync_status = 'not_synced';
      // Create sync issue for missing booking ref
      await base44.asServiceRole.entities.HotelBookingSyncIssue.create({
        issue_type: 'missing_booking_ref',
        intent_id: intent.id,
        intent_ref,
        detected_at: new Date().toISOString(),
        severity: 'warning',
        description: `Booking returned as ${return_status} but no booking_ref provided`,
        status: 'new'
      });
    }

    await base44.asServiceRole.entities.HotelBookingIntent.update(intent.id, updateData);

    // Notify admin via Slack
    try {
      const settings = await base44.asServiceRole.entities.SiteSettings.filter(
        { key: 'global' },
        undefined,
        1
      );
      
      if (settings && settings[0] && settings[0].slack_webhook_url_env_key) {
        const webhookUrl = Deno.env.get(settings[0].slack_webhook_url_env_key);
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `🏨 Hotel Booking Return: ${intent_ref}`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Hotel Booking Returned*\n*Ref:* ${intent_ref}\n*Status:* ${return_status || 'unknown'}\n*Booking Ref:* ${booking_ref || 'Not provided'}\n*Guest:* ${intent.guest_email}`
                  }
                }
              ]
            })
          });
        }
      }
    } catch (e) {
      console.error('Slack notification failed:', e);
      // Continue - Slack failure should not block operation
    }

    return Response.json({
      success: true,
      intent_id: intent.id,
      intent_ref,
      status: updateData.status
    });
  } catch (error) {
    console.error('Booking return handler error:', error);
    return Response.json(
      { error: 'Server error handling booking return' },
      { status: 500 }
    );
  }
});