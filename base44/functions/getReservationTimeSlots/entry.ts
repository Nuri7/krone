import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Get available time slots for a given date (canonical source).
 * Uses SiteSettings + OpeningHour rules, accounts for capacity + special rules.
 * Returns slots and used capacity per slot.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { date } = await req.json();

    if (!date) {
      return Response.json({ error: 'Date required' }, { status: 400 });
    }

    // Get settings
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    if (!settings || !settings[0]) {
      return Response.json(
        { error: 'Settings not configured' },
        { status: 500 }
      );
    }

    const maxCapacity = settings[0].restaurant_max_capacity || 120;
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Get opening hours for this day
    const hours = await base44.asServiceRole.entities.OpeningHour.filter(
      { entity_type: 'restaurant', day_of_week: dayOfWeek },
      undefined,
      1
    );

    // Check special rules
    let specialRules = [];
    try {
      specialRules = await base44.asServiceRole.entities.SpecialOpeningRule.filter({
        entity_type: 'restaurant',
        effective_date: { $lte: date },
        $or: [
          { end_date: null },
          { end_date: { $gte: date } }
        ]
      });
    } catch (e) {
      // SpecialOpeningRule may not exist yet, continue with defaults
    }

    // Apply priority-sorted special rules
    const activeSpecialRule = specialRules
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .find(r => r.rule_type !== 'modified_hours');

    // If fully closed or fully booked by special rule, return empty
    if (
      (hours && hours[0] && hours[0].is_closed) ||
      (activeSpecialRule && activeSpecialRule.is_closed)
    ) {
      return Response.json({
        date,
        available_slots: [],
        used_capacity: {},
        closed_reason: 'Restaurant closed'
      });
    }

    if (activeSpecialRule && activeSpecialRule.fully_booked) {
      return Response.json({
        date,
        available_slots: [],
        used_capacity: {},
        closed_reason: 'Fully booked'
      });
    }

    // Get time windows
    let timeWindows = [];
    if (hours && hours[0]) {
      if (hours[0].service_windows && hours[0].service_windows.length > 0) {
        timeWindows = hours[0].service_windows.filter(w => w.is_bookable !== false);
      } else {
        // Fallback: use opening_time to closing_time
        if (hours[0].opening_time && hours[0].closing_time) {
          timeWindows = [{
            name: 'Service',
            start: hours[0].opening_time,
            end: hours[0].closing_time,
            is_bookable: true
          }];
        }
      }
    }

    if (timeWindows.length === 0) {
      return Response.json({
        date,
        available_slots: [],
        used_capacity: {},
        closed_reason: 'No service windows'
      });
    }

    // Generate 15-minute slots within windows
    const slots = [];
    for (const window of timeWindows) {
      const [startH, startM] = window.start.split(':').map(Number);
      const [endH, endM] = window.end.split(':').map(Number);
      let current = startH * 60 + startM;
      const end = endH * 60 + endM;

      while (current < end) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        current += 15;
      }
    }

    // Get existing reservations for this date
    const existing = await base44.asServiceRole.entities.Reservation.filter({
      reservation_date: date,
      status: { $in: ['pending', 'confirmed'] }
    });

    // Calculate used capacity per slot
    const usedCapacity = {};
    slots.forEach(s => { usedCapacity[s] = 0; });
    existing.forEach(res => {
      if (usedCapacity[res.reservation_time] !== undefined) {
        usedCapacity[res.reservation_time] += (res.party_size || 0);
      }
    });

    // Filter out full slots
    const availableSlots = slots.filter(s => (usedCapacity[s] || 0) < maxCapacity);

    return Response.json({
      date,
      available_slots: availableSlots,
      used_capacity: usedCapacity,
      max_capacity: maxCapacity,
      total_slots: slots.length
    });
  } catch (error) {
    console.error('getReservationTimeSlots error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});