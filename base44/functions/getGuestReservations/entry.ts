import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Guest function: Get their own restaurant reservations and bookings.
 * Requires authentication.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get guest's restaurant reservations
    const reservations = await base44.entities.RestaurantReservation.filter(
      { guest_email: user.email.toLowerCase() },
      '-reservation_date',
      100
    );

    // Get guest's hotel booking intents
    const bookingIntents = await base44.entities.HotelBookingIntent.filter(
      { guest_email: user.email.toLowerCase() },
      '-created_date',
      50
    );

    // Get guest profile if exists
    let guestProfile = null;
    try {
      const profiles = await base44.entities.GuestProfile.filter(
        { user_email: user.email.toLowerCase() },
        undefined,
        1
      );
      if (profiles.length > 0) {
        guestProfile = profiles[0];
      }
    } catch (e) {
      // Profile might not exist yet
    }

    return Response.json({
      guest_email: user.email,
      guest_profile: guestProfile,
      reservations: reservations.map(res => ({
        id: res.id,
        reservation_ref: res.reservation_ref,
        date: res.reservation_date,
        time: res.reservation_time,
        party_size: res.party_size,
        status: res.status,
        notes: res.notes,
        created_date: res.created_date
      })),
      booking_intents: bookingIntents.map(intent => ({
        id: intent.id,
        intent_ref: intent.intent_ref,
        check_in: intent.check_in,
        check_out: intent.check_out,
        status: intent.status,
        sync_status: intent.sync_status,
        booking_ref: intent.beds24_booking_ref,
        created_date: intent.created_date
      }))
    });
  } catch (error) {
    console.error('Get guest reservations error:', error);
    return Response.json(
      { error: 'Server error fetching your reservations' },
      { status: 500 }
    );
  }
});