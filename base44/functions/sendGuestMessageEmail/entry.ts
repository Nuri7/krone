import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Secure backend function for guest message email notifications
// Never call integrations from frontend — always go through here
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { guest_name, request_type, subject, body } = await req.json();

    if (!body || body.trim().length < 3) {
      return Response.json({ error: 'Message body too short' }, { status: 400 });
    }

    // Notify hotel staff
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@krone-ammesso.de',
      from_name: 'Krone Gästeportal',
      subject: `[Gästenachricht] ${request_type} — ${guest_name || user.email}`,
      body: `<p><b>Von:</b> ${guest_name || user.email} (${user.email})</p><p><b>Betreff:</b> ${subject || '—'}</p><p><b>Nachricht:</b></p><p>${body.replace(/\n/g, '<br/>')}</p>`,
    });

    // Also notify via Slack
    const slackPayload = {
      type: 'guest_message',
      name: guest_name || user.email,
      email: user.email,
      inquiry_type: request_type,
      message: body.slice(0, 300),
    };

    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (webhookUrl && webhookUrl.startsWith('https://')) {
      const blocks = [
        { type: 'header', text: { type: 'plain_text', text: '💬 Gästenachricht', emoji: true } },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Von:*\n${slackPayload.name}` },
            { type: 'mrkdwn', text: `*Email:*\n${user.email}` },
            { type: 'mrkdwn', text: `*Art:*\n${request_type}` },
          ]
        },
        { type: 'section', text: { type: 'mrkdwn', text: `*Nachricht:*\n${body.slice(0, 300)}` } },
        { type: 'divider' }
      ];
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
      }).catch(e => console.warn('Slack notification failed:', e.message));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('sendGuestMessageEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});