import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Guest function: Send a message to property (questions, special requests).
 * Requires authentication.
 * Logs and notifies admin.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const {
      message_type,
      subject,
      body,
      language,
      related_reservation_ref
    } = payload;

    if (!subject || !body) {
      return Response.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    // Create message record
    const message = await base44.entities.GuestMessage.create({
      user_email: user.email.toLowerCase(),
      guest_name: user.full_name || user.email,
      message_type: message_type || 'general_question',
      subject,
      body,
      language: language || 'en',
      status: 'new',
      related_reservation_ref: related_reservation_ref || null
    });

    // Link to guest profile if exists
    try {
      const profiles = await base44.entities.GuestProfile.filter(
        { user_email: user.email.toLowerCase() },
        undefined,
        1
      );
      if (profiles.length > 0) {
        await base44.entities.GuestMessage.update(message.id, {
          guest_profile_id: profiles[0].id
        });
      }
    } catch (e) {
      // Silently ignore
    }

    // Log email notification
    await base44.asServiceRole.entities.EmailLog.create({
      recipient: user.email,
      subject: 'Message Received',
      template: 'contact_confirmation',
      language: language || 'en',
      status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity_type: 'GuestMessage',
      related_entity_id: message.id
    }).catch(() => {});

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
              text: `💬 Guest Message`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Guest Message*\n*Type:* ${message_type}\n*From:* ${user.email}\n*Subject:* ${subject}\n*Preview:* ${body.substring(0, 100)}...`
                  }
                }
              ]
            })
          });
        }
      }
    } catch (e) {
      console.error('Slack notification failed:', e);
    }

    return Response.json({
      success: true,
      message_id: message.id,
      status: 'new'
    });
  } catch (error) {
    console.error('Guest send message error:', error);
    return Response.json(
      { error: 'Server error sending message' },
      { status: 500 }
    );
  }
});