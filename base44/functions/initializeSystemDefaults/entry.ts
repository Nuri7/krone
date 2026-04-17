import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Initialize system with default SiteSettings + OpeningHours.
 * Admin-only. Idempotent.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    // Check if settings exist
    const existing = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    if (existing && existing.length > 0) {
      return Response.json({
        success: true,
        message: 'Settings already exist',
        settings_id: existing[0].id
      });
    }

    // Create default SiteSettings
    const settings = await base44.asServiceRole.entities.SiteSettings.create({
      key: 'global',
      category: 'branding',
      hotel_name: 'Krone Langenburg',
      hotel_tagline_de: 'Authentisch, Elegant, Herzlich',
      hotel_tagline_en: 'Authentic, Elegant, Warm',
      hotel_tagline_it: 'Autentico, Elegante, Caloroso',
      restaurant_name: 'Kulinarium by Ammesso',
      address_street: 'Hauptstraße 24',
      address_city: 'Langenburg',
      address_zip: '74595',
      address_country: 'Germany',
      address_country_code: 'DE',
      phone: '+49 7905 41770',
      phone_whatsapp: '+49 7905 41770',
      email_info: 'info@krone-ammesso.de',
      email_reservations: 'reservations@krone-ammesso.de',
      email_events: 'events@krone-ammesso.de',
      beds24_prop_id: '310599',
      beds24_booking_url: 'https://beds24.com/booking2.php?propid=310599',
      restaurant_max_capacity: 120,
      restaurant_currency: 'EUR',
      breakfast_price_per_person: 14.00,
      social_instagram: 'https://instagram.com/kroneammesso',
      social_facebook: 'https://facebook.com/kroneammesso',
      social_tripadvisor: 'https://tripadvisor.com/Hotel_Review-g188722-d1159097-Reviews-Krone-Langenburg-Langenburg_Baden_Wurttemberg_Hohenlohe_Region.html',
      slack_webhook_url_env_key: 'SLACK_WEBHOOK_URL',
      canonical_timezone: 'Europe/Berlin',
      super_admin_emails: ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'],
      is_live: true,
      maintenance_mode: false,
      last_verified_at: new Date().toISOString(),
      last_verified_by: user.email
    });

    // Create default opening hours
    const hourDefinitions = [
      { day: 0, closed: false, open: '12:00', close: '20:00', label: 'Sunday' }, // Sun: continuous
      { day: 1, closed: true, open: null, close: null, label: 'Monday' }, // Mon: closed
      { day: 2, closed: false, open: '12:00', close: '14:30', label: 'Tuesday-Sat Lunch' },
      { day: 3, closed: false, open: '12:00', close: '14:30', label: 'Wed' },
      { day: 4, closed: false, open: '12:00', close: '14:30', label: 'Thu' },
      { day: 5, closed: false, open: '12:00', close: '14:30', label: 'Fri' },
      { day: 6, closed: false, open: '12:00', close: '14:30', label: 'Sat' }
    ];

    const hours = [];
    for (const def of hourDefinitions) {
      const hourData = {
        entity_type: 'restaurant',
        day_of_week: def.day,
        is_closed: def.closed,
        notes_de: def.label,
        notes_en: def.label,
        notes_it: def.label,
        is_active: true
      };

      if (!def.closed) {
        hourData.opening_time = def.open;
        hourData.closing_time = def.close;
        // Add service windows for weekdays (lunch + dinner)
        if (def.day > 1) { // Tue-Sat
          hourData.service_windows = [
            { name: 'Lunch', start: '12:00', end: '14:30', is_bookable: true },
            { name: 'Dinner', start: '17:30', end: '22:00', is_bookable: true }
          ];
        } else if (def.day === 0) { // Sunday continuous
          hourData.service_windows = [
            { name: 'Service', start: '12:00', end: '20:00', is_bookable: true }
          ];
        }
      }

      const hourRecord = await base44.asServiceRole.entities.OpeningHour.create(hourData);
      hours.push(hourRecord);
    }

    return Response.json({
      success: true,
      settings_id: settings.id,
      hours_created: hours.length,
      message: 'System initialized with defaults'
    });
  } catch (error) {
    console.error('initializeSystemDefaults error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});