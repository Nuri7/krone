import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { FadeUp } from '@/components/shared/Animations';

// Placeholder events — will be dynamic from Supabase
const SAMPLE_EVENTS = [
  { title: "Sunday Jazz Brunch", date: "Every Sunday", time: "12:00 – 15:00", desc: "Live jazz with Mediterranean brunch. Reservations recommended." },
  { title: "Wine Tasting Evening", date: "First Friday monthly", time: "19:00 – 22:00", desc: "Discover Italian wines paired with tapas by Chef Ammesso." },
  { title: "Seasonal Menu Launch", date: "Coming Soon", time: "", desc: "New spring menu featuring the freshest regional produce." },
];

export default function Events() {
  return (
    <div className="bg-charcoal pt-24 sm:pt-28 pb-20">
      <section className="px-5 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-light text-ivory mb-4">Events</h1>
          <p className="text-ivory/40 font-body text-base max-w-lg mx-auto">
            Special evenings, tastings, and celebrations at Krone Langenburg.
          </p>
        </div>
      </section>

      <section className="px-5">
        <div className="max-w-3xl mx-auto space-y-4">
          {SAMPLE_EVENTS.map((event, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div className="glass-card rounded-2xl p-6 sm:p-8 hover-lift">
                <h2 className="font-display text-2xl text-ivory mb-2">{event.title}</h2>
                <div className="flex flex-wrap gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-gold text-xs font-body">
                    <CalendarDays className="w-3 h-3" /> {event.date}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1.5 text-ivory/30 text-xs font-body">
                      <Clock className="w-3 h-3" /> {event.time}
                    </span>
                  )}
                </div>
                <p className="text-ivory/40 font-body text-sm">{event.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
