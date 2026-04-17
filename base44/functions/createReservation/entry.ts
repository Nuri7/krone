import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const MAX_CAPACITY = 120;
const CLOSED_DAYS = [1]; // Monday

function getDaySlots(dateStr) {
  const day = new Date(dateStr).getDay();
  if (CLOSED_DAYS.includes(day)) return [];
  if (day === 0) {
    // Sunday
    return ["12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","19:00","19:15","19:30"];
  }
  // Tue–Sat
  return ["12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30"];
}

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

    // Validate day is open
    const validSlots = getDaySlots(date);
    if (validSlots.length === 0) {
      return Response.json({ error: 'Restaurant is closed on this day' }, { status: 400 });
    }
    if (!validSlots.includes(time)) {
      return Response.json({ error: 'Invalid time slot' }, { status: 400 });
    }

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

    // Server-side capacity check (authoritative — no race condition)
    const existing = await base44.asServiceRole.entities.Reservation.filter({
      reservation_date: date,
      reservation_time: time,
    });
    const activeBookings = existing.filter(r => ['pending', 'confirmed'].includes(r.status));
    const used = activeBookings.reduce((sum, r) => sum + (r.party_size || 0), 0);

    if (used + guests > MAX_CAPACITY) {
      return Response.json({ error: 'full' }, { status: 409 });
    }

    // Create reservation
    const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
    const reservation = await base44.asServiceRole.entities.Reservation.create({
      reservation_ref: ref,
      status: 'confirmed',
      guest_first_name: first_name,
      guest_last_name: last_name,
      guest_email: email,
      guest_phone: phone,
      reservation_date: date,
      reservation_time: time,
      party_size: guests,
      special_requests: requests,
      language: lang,
      source: 'website',
      duplicate_check_key: dupKey,
    });

    // Fire notifications (non-blocking, via base44 functions)
    base44.functions.invoke('sendReservationEmail', {
      ref, first_name, last_name, email, date, time, guests, lang, requests,
    }).catch(e => console.warn('Email notification failed:', e.message));

    base44.functions.invoke('notifySlack', {
      type: 'reservation', ref,
      name: `${first_name} ${last_name}`,
      date, time, guests, lang,
    }).catch(e => console.warn('Slack notification failed:', e.message));

    return Response.json({ success: true, ref, reservation_id: reservation.id });
  } catch (error) {
    console.error('createReservation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});