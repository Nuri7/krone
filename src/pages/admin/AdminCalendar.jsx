import { CalendarDays } from 'lucide-react';

export default function AdminCalendar() {
  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl text-ivory mb-8">Reservation Calendar</h1>
        <div className="glass-card rounded-2xl p-8 text-center">
          <CalendarDays className="w-10 h-10 text-gold/30 mx-auto mb-4" />
          <p className="text-ivory/40 font-body text-sm">Calendar view will load reservations from Supabase. Connect your database to see bookings here.</p>
        </div>
      </div>
    </div>
  );
}
