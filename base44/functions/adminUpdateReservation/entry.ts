import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin function: Update a reservation status/details.
 * Only super_admin role allowed.
 * Handles status changes, cancellations, notes, etc.
 * Logs all changes and triggers notifications.
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

    const payload = await req.json();
    const {
      reservation_id,
      new_status,
      cancellation_reason,
      internal_notes,
      notes
    } = payload;

    if (!reservation_id || !new_status) {
      return Response.json(
        { error: 'reservation_id and new_status are required' },
        { status: 400 }
      );
    }

    // Get existing reservation
    const existing = await base44.asServiceRole.entities.RestaurantReservation.filter(
      { id: reservation_id },
      undefined,
      1
    );

    if (!existing || existing.length === 0) {
      return Response.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const res = existing[0];
    const oldStatus = res.status;

    // Build update
    const updateData = {
      status: new_status
    };

    if (new_status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
      updateData.confirmed_by = user.email;
    }

    if (new_status === 'cancelled_by_staff') {
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancelled_by = 'staff';
      if (cancellation_reason) {
        updateData.cancellation_reason = cancellation_reason;
      }
    }

    if (internal_notes) {
      updateData.internal_notes = internal_notes;
    }

    if (notes) {
      updateData.notes = notes;
    }

    // Update reservation
    await base44.asServiceRole.entities.RestaurantReservation.update(reservation_id, updateData);

    // Log audit entry
    await base44.asServiceRole.entities.AdminAuditEntry.create({
      admin_email: user.email,
      action: 'status_change',
      entity_type: 'RestaurantReservation',
      entity_id: reservation_id,
      entity_ref: res.reservation_ref,
      old_value: oldStatus,
      new_value: new_status,
      change_summary: `Status changed from ${oldStatus} to ${new_status}`,
      performed_at: new Date().toISOString()
    }).catch(() => {});

    // Try to notify guest of status change if applicable
    if (new_status === 'confirmed' && res.guest_email) {
      try {
        await base44.functions.invoke('sendReservationStatusNotification', {
          reservation_id,
          reservation_ref: res.reservation_ref,
          guest_email: res.guest_email,
          new_status,
          language: res.language
        });
      } catch (e) {
        console.error('Failed to send status notification:', e);
      }
    }

    return Response.json({
      success: true,
      reservation_id,
      old_status: oldStatus,
      new_status
    });
  } catch (error) {
    console.error('Admin update reservation error:', error);
    return Response.json(
      { error: 'Server error updating reservation' },
      { status: 500 }
    );
  }
});