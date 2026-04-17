import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      first_name, last_name, email, phone = '',
      date, time, guests, requests = '', lang = 'de',
    } = body;

    // Input validation
    if (!first_name || !last_name || !email || !date || !time || !guests) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (guests < 1 || guests > 20) {
      return Response.json({ error: 'Invalid party size' }, { status: 400 });
    }
    if (!/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate date is not in the past
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return Response.json({ error: 'Date must be today or in the future' }, { status: 400 });
    }

    // Validate slot exists & is available (use canonical source)
    const slotRes = await base44.functions.invoke('getReservationTimeSlots', { date });
    if (!slotRes.data || !slotRes.data.available_slots) {
      return Response.json(
        { error: slotRes.data?.closed_reason || 'Slot validation failed' },
        { status: 400 }
      );
    }
    if (!slotRes.data.available_slots.includes(time)) {
      return Response.json({ error: 'Slot no longer available' }, { status: 400 });
    }
    const maxCapacity = slotRes.data.max_capacity;

    // Anti-spam: check if same email submitted in last 2 minutes
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const recentByEmail = await base44.asServiceRole.entities.Reservation.filter({ guest_email: email });
    const veryRecent = recentByEmail.filter(r => r.created_date && r.created_date > twoMinsAgo);
    if (veryRecent.length > 0) {
      return Response.json({ error: 'Please wait a moment before submitting again' }, { status: 429 });
    }

    // Duplicate check: same email + date + time
    const dupKey = `${email.toLowerCase()}|${date}|${time}`;
    const dups = await base44.asServiceRole.entities.Reservation.filter({ duplicate_check_key: dupKey });
    if (dups.length > 0) {
      return Response.json({ error: 'duplicate' }, { status: 409 });
    }

    // Final capacity check (authoritative)
    const used = slotRes.data.used_capacity[time] || 0;
    if (used + guests > maxCapacity) {
      return Response.json({ error: 'full' }, { status: 409 });
    }

    // Create reservation (starts as pending, confirmation email will set to confirmed)
    const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
    const reservation = await base44.asServiceRole.entities.Reservation.create({
      reservation_ref: ref,
      status: 'pending',
      guest_first_name: first_name,
      guest_last_name: last_name,
      guest_email: email.toLowerCase(),
      guest_phone: phone,
      reservation_date: date,
      reservation_time: time,
      party_size: guests,
      special_requests: requests,
      language: lang,
      source: 'website',
      duplicate_check_key: dupKey,
      email_sent: false,
      slack_notified: false,
    });

    // Fire notifications (non-blocking, via base44 functions)
    // Email triggers confirmation status change
    base44.functions.invoke('sendReservationEmail', {
      ref, first_name, last_name, email, date, time, guests, lang, requests,
    }).catch(e => {
      console.error('Email notification failed:', e.message);
      // Log failure
      base44.asServiceRole.entities.EmailLog.create({
        recipient: email,
        subject: `Reservierung bestätigt — ${ref}`,
        template: 'reservation_confirmation',
        language: lang,
        status: 'failed',
        failure_reason: e.message,
        sent_at: new Date().toISOString(),
        related_entity_type: 'Reservation',
        related_entity_id: reservation.id,
        related_ref: ref
      }).catch(() => {});
    });

    // Slack notification
    base44.functions.invoke('notifySlack', {
      type: 'reservation', ref,
      name: `${first_name} ${last_name}`,
      date, time, guests, lang,
    }).catch(e => console.error('Slack notification failed:', e.message));

    return Response.json({ success: true, ref, reservation_id: reservation.id });
  } catch (error) {
    console.error('createReservation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});