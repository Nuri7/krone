import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Returns available reservation times for a given date.
 * Considers: opening hours, capacity, special rules.
 * Returns: { date: string, available_times: string[], capacity_status: object }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { date } = await req.json();

    if (!date) {
      return Response.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const resDate = new Date(date);
    const dayOfWeek = resDate.getDay();

    // Get settings
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    if (!settings || settings.length === 0) {
      return Response.json(
        { error: 'System configuration missing' },
        { status: 500 }
      );
    }

    const config = settings[0];
    const maxCapacity = config.restaurant_max_capacity || 120;

    // Check if day is closed
    const openingHours = await base44.asServiceRole.entities.OpeningHour.filter(
      { entity_type: 'restaurant', day_of_week: dayOfWeek, is_active: true },
      undefined,
      1
    );

    if (openingHours.length === 0 || openingHours[0].is_closed) {
      return Response.json({
        date,
        available_times: [],
        is_closed: true,
        capacity_status: {}
      });
    }

    const hours = openingHours[0];

    // Check special rules
    const specialRules = await base44.asServiceRole.entities.SpecialOpeningRule.filter(
      {
        entity_type: 'restaurant',
        effective_date: { $lte: date },
        end_date: { $gte: date }
      },
      '-priority',
      1
    );

    let isFullyBooked = false;
    if (specialRules.length > 0) {
      const rule = specialRules[0];
      if (rule.is_closed) {
        return Response.json({
          date,
          available_times: [],
          is_closed: true,
          capacity_status: {}
        });
      }
      if (rule.fully_booked) {
        isFullyBooked = true;
      }
    }

    // Generate time slots (15-minute intervals)
    const slots = [];
    const [openHour, openMin] = (hours.opening_time || '00:00').split(':').map(Number);
    const [closeHour, closeMin] = (hours.closing_time || '23:59').split(':').map(Number);

    let currentTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    while (currentTime < closeTime - 30) {
      const slotHour = Math.floor(currentTime / 60);
      const slotMin = currentTime % 60;
      const slotStr = `${String(slotHour).padStart(2, '0')}:${String(slotMin).padStart(2, '0')}`;
      slots.push(slotStr);
      currentTime += 15; // 15-minute intervals
    }

    // Get existing reservations for this date
    const existingReservations = await base44.asServiceRole.entities.RestaurantReservation.filter(
      {
        reservation_date: date,
        status: { $in: ['confirmed', 'seated', 'completed'] }
      }
    );

    // Calculate capacity by time
    const capacityByTime = {};
    const availableTimes = [];

    for (const slot of slots) {
      capacityByTime[slot] = maxCapacity;
      
      for (const res of existingReservations) {
        if (res.reservation_time === slot) {
          capacityByTime[slot] -= (res.party_size || 0);
        }
      }

      // A slot is available if:
      // - Not fully booked (special rule)
      // - Has at least 1 available seat
      if (!isFullyBooked && capacityByTime[slot] > 0) {
        availableTimes.push(slot);
      }
    }

    return Response.json({
      date,
      available_times: availableTimes,
      is_closed: false,
      is_fully_booked: isFullyBooked,
      capacity_status: capacityByTime,
      max_capacity: maxCapacity
    });
  } catch (error) {
    console.error('Available times error:', error);
    return Response.json(
      { error: 'Server error fetching available times' },
      { status: 500 }
    );
  }
});