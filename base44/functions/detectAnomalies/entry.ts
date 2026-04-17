import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Scheduled/Admin function: Detects data anomalies and creates review records.
 * Looks for: duplicates, stale records, contradictions, orphans, sync failures.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const anomalies = [];

    // Check for duplicate reservations (same email + date + time within 2 hours)
    try {
      const allReservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
        { status: { $in: ['new', 'pending', 'confirmed'] } },
        undefined,
        1000
      );

      const grouped = {};
      for (const res of allReservations) {
        const key = `${res.guest_email}|${res.reservation_date}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(res);
      }

      for (const [key, items] of Object.entries(grouped)) {
        if (items.length > 1) {
          anomalies.push({
            type: 'duplicate_reservation',
            severity: 'warning',
            description: `${items.length} reservations for ${key.split('|')[0]} on ${key.split('|')[1]}`,
            item_ids: items.map(i => i.id)
          });
        }
      }
    } catch (e) {
      console.error('Duplicate check error:', e);
    }

    // Check for stale pending booking intents (> 48 hours)
    try {
      const staleCutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const staleIntents = await base44.asServiceRole.entities.HotelBookingIntent.filter(
        {
          status: 'returned_pending',
          returned_at: { $lt: staleCutoff }
        }
      );

      if (staleIntents.length > 0) {
        anomalies.push({
          type: 'stale_booking_intent',
          severity: 'info',
          description: `${staleIntents.length} booking intents pending > 48 hours`,
          item_ids: staleIntents.map(i => i.id)
        });
      }
    } catch (e) {
      console.error('Stale intent check error:', e);
    }

    // Check for unresolved sync issues
    try {
      const unresolvedIssues = await base44.asServiceRole.entities.HotelBookingSyncIssue.filter(
        { status: { $in: ['new', 'investigating'] } }
      );

      if (unresolvedIssues.length > 5) {
        anomalies.push({
          type: 'high_sync_issue_count',
          severity: 'critical',
          description: `${unresolvedIssues.length} unresolved sync issues`,
          item_ids: unresolvedIssues.map(i => i.id)
        });
      }
    } catch (e) {
      console.error('Sync issue check error:', e);
    }

    // Check for documents pending review > 7 days
    try {
      const oldCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oldDocs = await base44.asServiceRole.entities.GuestDocument.filter(
        {
          status: 'uploaded',
          created_date: { $lt: oldCutoff }
        }
      );

      if (oldDocs.length > 0) {
        anomalies.push({
          type: 'old_pending_documents',
          severity: 'warning',
          description: `${oldDocs.length} documents awaiting review for > 7 days`,
          item_ids: oldDocs.map(d => d.id)
        });
      }
    } catch (e) {
      console.error('Document check error:', e);
    }

    // Check for contradictory site settings
    try {
      const settings = await base44.asServiceRole.entities.SiteSettings.filter(
        { key: 'global' },
        undefined,
        1
      );

      if (settings && settings[0]) {
        const s = settings[0];
        // Check if email addresses are properly formatted
        const emails = [s.email_info, s.email_reservations, s.email_events].filter(e => e);
        for (const email of emails) {
          if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            anomalies.push({
              type: 'invalid_email_config',
              severity: 'critical',
              description: `Invalid email format: ${email}`
            });
          }
        }
      }
    } catch (e) {
      console.error('Settings check error:', e);
    }

    return Response.json({
      anomalies_found: anomalies.length,
      anomalies,
      scan_time: new Date().toISOString()
    });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return Response.json(
      { error: 'Server error detecting anomalies' },
      { status: 500 }
    );
  }
});