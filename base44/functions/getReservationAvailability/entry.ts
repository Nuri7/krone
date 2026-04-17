import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Returns availability info for a date range (for calendar picker).
 * Returns which dates are open/closed/fully booked.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { start_date, end_date } = payload;

    if (!start_date || !end_date) {
      return Response.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      );
    }

    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    const maxCapacity = settings?.[0]?.restaurant_max_capacity || 120;

    const availability = {};

    // Iterate through date range
    const current = new Date(start_date);
    const end = new Date(end_date);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay();

      // Check if closed
      const openingHours = await base44.asServiceRole.entities.OpeningHour.filter(
        { entity_type: 'restaurant', day_of_week: dayOfWeek, is_active: true },
        undefined,
        1
      );

      if (!openingHours || openingHours.length === 0 || openingHours[0].is_closed) {
        availability[dateStr] = { status: 'closed' };
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Check special rules
      const rules = await base44.asServiceRole.entities.SpecialOpeningRule.filter(
        {
          entity_type: 'restaurant',
          effective_date: { $lte: dateStr },
          end_date: { $gte: dateStr }
        },
        '-priority',
        1
      );

      if (rules.length > 0 && rules[0].is_closed) {
        availability[dateStr] = { status: 'closed', reason: rules[0].rule_name };
        current.setDate(current.getDate() + 1);
        continue;
      }

      if (rules.length > 0 && rules[0].fully_booked) {
        availability[dateStr] = { status: 'fully_booked', reason: rules[0].rule_name };
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Check capacity
      const reservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
        {
          reservation_date: dateStr,
          status: { $in: ['confirmed', 'seated', 'completed'] }
        }
      );

      const bookedSeats = reservations.reduce((sum, res) => sum + (res.party_size || 0), 0);
      const availableSeats = maxCapacity - bookedSeats;

      if (availableSeats <= 0) {
        availability[dateStr] = { status: 'fully_booked', available_seats: 0 };
      } else {
        availability[dateStr] = { status: 'available', available_seats: availableSeats };
      }

      current.setDate(current.getDate() + 1);
    }

    return Response.json({
      availability,
      max_capacity: maxCapacity
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return Response.json(
      { error: 'Server error checking availability' },
      { status: 500 }
    );
  }
});