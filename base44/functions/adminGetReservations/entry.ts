import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin function: Get filtered restaurant reservations.
 * Only super_admin role allowed.
 * Returns paginated, sortable list with filtering.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin status
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    const adminEmails = settings?.[0]?.super_admin_emails || [];
    if (!adminEmails.includes(user.email) && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const {
      status,
      date,
      email,
      limit = 50,
      offset = 0,
      sort_by = '-created_date'
    } = payload;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (date) query.reservation_date = date;
    if (email) query.guest_email = email.toLowerCase();

    // Log admin action
    await base44.asServiceRole.entities.AdminAuditEntry.create({
      admin_email: user.email,
      action: 'read',
      entity_type: 'RestaurantReservation',
      entity_id: 'list_query',
      change_summary: `Listed reservations with filters: ${JSON.stringify(query)}`,
      performed_at: new Date().toISOString()
    }).catch(() => {});

    // Get reservations
    const reservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
      query,
      sort_by,
      limit + 1,
      offset
    );

    const hasMore = reservations.length > limit;
    if (hasMore) {
      reservations.pop();
    }

    return Response.json({
      reservations,
      has_more: hasMore,
      offset,
      limit,
      total_returned: reservations.length
    });
  } catch (error) {
    console.error('Admin get reservations error:', error);
    return Response.json(
      { error: 'Server error retrieving reservations' },
      { status: 500 }
    );
  }
});