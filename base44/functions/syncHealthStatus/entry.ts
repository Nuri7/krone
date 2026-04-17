import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin function: Get system health and sync status.
 * Checks: last successful email, last Slack msg, pending reservations, sync issues, etc.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    const adminEmails = settings?.[0]?.super_admin_emails || [];
    if (!adminEmails.includes(user.email) && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get latest successful email
    const latestEmail = await base44.asServiceRole.entities.EmailLog.filter(
      { status: 'sent' },
      '-sent_at',
      1
    );

    // Get latest Slack notification
    const latestSlack = await base44.asServiceRole.entities.SlackLog.filter(
      { status: 'sent' },
      '-sent_at',
      1
    );

    // Get pending reservations
    const pendingReservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
      { status: { $in: ['new', 'pending'] } }
    );

    // Get unresolved sync issues
    const syncIssues = await base44.asServiceRole.entities.HotelBookingSyncIssue.filter(
      { status: { $in: ['new', 'investigating'] } }
    );

    // Get pending documents
    const pendingDocs = await base44.asServiceRole.entities.GuestDocument.filter(
      { status: { $in: ['uploaded', 'under_review'] } }
    );

    // Get unresolved messages
    const unresolved = await base44.asServiceRole.entities.GuestMessage.filter(
      { status: { $in: ['new', 'in_progress'] } }
    );

    return Response.json({
      health: {
        last_email: latestEmail?.[0]?.sent_at || null,
        last_slack: latestSlack?.[0]?.sent_at || null,
        system_time: new Date().toISOString()
      },
      pending: {
        reservations_count: pendingReservations.length,
        sync_issues_count: syncIssues.length,
        documents_count: pendingDocs.length,
        messages_count: unresolved.length
      },
      alerts: [
        ...(syncIssues.length > 0 ? [`${syncIssues.length} unresolved sync issues`] : []),
        ...(pendingDocs.length > 5 ? [`${pendingDocs.length} documents awaiting review`] : []),
        ...(unresolved.length > 3 ? [`${unresolved.length} guest messages unresolved`] : [])
      ]
    });
  } catch (error) {
    console.error('Health status error:', error);
    return Response.json(
      { error: 'Server error getting health status' },
      { status: 500 }
    );
  }
});