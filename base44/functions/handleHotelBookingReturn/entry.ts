import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Handle guest return from Beds24 checkout.
 * Updates intent status, links to real booking if available, creates sync issues if needed.
 * Notifies admin via Slack.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { intent_ref, status, booking_ref } = await req.json();

    if (!intent_ref || !status) {
      return Response.json(
        { error: 'intent_ref and status required' },
        { status: 400 }
      );
    }

    // Find intent
    const intents = await base44.asServiceRole.entities.HotelBookingIntent.filter(
      { intent_ref },
      undefined,
      1
    );

    if (!intents || intents.length === 0) {
      return Response.json({ error: 'Intent not found' }, { status: 404 });
    }

    const intent = intents[0];

    // Map Beds24 status to our enum
    const statusMap = {
      confirmed: 'returned_confirmed',
      pending: 'returned_pending',
      cancelled: 'returned_cancelled',
      success: 'returned_confirmed'
    };

    const newStatus = statusMap[status] || 'returned_pending';

    // Create sync issue if booking_ref missing but status is confirmed
    const updates = {
      status: newStatus,
      returned_at: new Date().toISOString(),
      return_status: status
    };

    if (booking_ref) {
      updates.beds24_booking_ref = booking_ref;
    } else if (status === 'confirmed' || status === 'success') {
      // Confirm but missing booking ref = issue
      await base44.asServiceRole.entities.HotelBookingSyncIssue.create({
        issue_type: 'missing_booking_ref',
        intent_id: intent.id,
        intent_ref,
        severity: 'warning',
        description: `Booking confirmed but no booking_ref from Beds24 for intent ${intent_ref}`,
        status: 'new',
        detected_at: new Date().toISOString()
      });
    }

    // Update intent
    await base44.asServiceRole.entities.HotelBookingIntent.update(intent.id, updates);

    // Notify admin
    try {
      await base44.functions.invoke('notifySlack', {
        type: 'booking_returned',
        ref: intent_ref,
        status: newStatus,
        booking_ref: booking_ref || 'missing'
      });
    } catch (e) {
      console.warn('Slack notification failed:', e.message);
    }

    return Response.json({
      success: true,
      intent_ref,
      new_status: newStatus,
      booking_ref: booking_ref || null
    });
  } catch (error) {
    console.error('handleHotelBookingReturn error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});