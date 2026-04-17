import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, ref, name, date, time, guests, lang, email, inquiry_type, message } = payload;

    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ skipped: true, reason: 'No SLACK_WEBHOOK_URL configured' });
    }

    // Validate it's an incoming webhook URL (not a bot token)
    if (!webhookUrl.startsWith('https://')) {
      console.warn('SLACK_WEBHOOK_URL does not look like a valid webhook URL. Expected https://hooks.slack.com/... Got:', webhookUrl.slice(0, 20));
      return Response.json({ skipped: true, reason: 'SLACK_WEBHOOK_URL appears to be a bot token, not an Incoming Webhook URL. Please set it to https://hooks.slack.com/services/...' });
    }

    let blocks = [];

    if (type === 'reservation') {
      blocks = [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🍽️ Neue Tischreservierung', emoji: true }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Datum:*\n${date}` },
            { type: 'mrkdwn', text: `*Zeit:*\n${time} Uhr` },
            { type: 'mrkdwn', text: `*Personen:*\n${guests}` },
            { type: 'mrkdwn', text: `*Sprache:*\n${lang?.toUpperCase() || 'DE'}` },
          ]
        },
        { type: 'divider' }
      ];
    } else if (type === 'contact') {
      blocks = [
        {
          type: 'header',
          text: { type: 'plain_text', text: '📩 Neue Kontaktanfrage', emoji: true }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Art:*\n${inquiry_type || 'general'}` },
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Email:*\n${email || '—'}` },
          ]
        },
        ...(message ? [{
          type: 'section',
          text: { type: 'mrkdwn', text: `*Nachricht:*\n${message}` }
        }] : []),
        { type: 'divider' }
      ];
    } else if (type === 'booking_intent') {
      blocks = [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🏨 Neue Buchungsanfrage (Beds24)', emoji: true }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Ref:*\n${ref}` },
            { type: 'mrkdwn', text: `*Name:*\n${name || '—'}` },
            { type: 'mrkdwn', text: `*Check-in:*\n${date || '—'}` },
            { type: 'mrkdwn', text: `*Personen:*\n${guests || '—'}` },
          ]
        }
      ];
    }

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });

    if (!slackRes.ok) {
      const text = await slackRes.text();
      throw new Error(`Slack error: ${slackRes.status} ${text}`);
    }

    // Update records
    const base44 = createClientFromRequest(req);
    if (type === 'reservation' && ref) {
      const items = await base44.asServiceRole.entities.Reservation.filter({ reservation_ref: ref });
      if (items.length > 0) {
        await base44.asServiceRole.entities.Reservation.update(items[0].id, { slack_notified: true });
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});