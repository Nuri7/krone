import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { Calendar, Clock, Users, ArrowRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS, it } from 'date-fns/locale';

const LOCALE_MAP = { de, en: enUS, it };

const TYPE_LABELS = {
  de: { dinner: 'Dinner Event', brunch: 'Brunch', wine_evening: 'Weinabend', live_music: 'Live Musik', private: 'Privat', seasonal: 'Saisonal', other: 'Sonstiges' },
  en: { dinner: 'Dinner Event', brunch: 'Brunch', wine_evening: 'Wine Evening', live_music: 'Live Music', private: 'Private', seasonal: 'Seasonal', other: 'Other' },
  it: { dinner: 'Dinner Event', brunch: 'Brunch', wine_evening: 'Serata del Vino', live_music: 'Musica dal Vivo', private: 'Privato', seasonal: 'Stagionale', other: 'Altro' },
};

export default function Events() {
  const { lang } = useLang();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    base44.entities.Event.filter({ is_published: true }, 'event_date', 50)
      .then(data => {
        setEvents((data || []).filter(e => e.event_date >= today));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const typeLabels = TYPE_LABELS[lang] || TYPE_LABELS.de;
  const locale = LOCALE_MAP[lang] || de;

  const C = {
    de: {
      eyebrow: 'Veranstaltungen',
      title: 'Events & Abende',
      sub: 'Besondere Abende, Weinevents, Live-Musik und kulinarische Erlebnisse.',
      empty: 'Derzeit keine geplanten Events.',
      empty_sub: 'Schauen Sie bald wieder vorbei — wir planen regelmäßig besondere Abende.',
      reserve: 'Tisch reservieren',
      contact: 'Anfragen',
      per_person: 'pro Person',
      soldout: 'Ausgebucht',
      free: 'Kostenlos',
      location: 'Kulinarium by Ammesso, Langenburg',
    },
    en: {
      eyebrow: 'Events',
      title: 'Events & Evenings',
      sub: 'Special evenings, wine events, live music and culinary experiences.',
      empty: 'No upcoming events at this time.',
      empty_sub: 'Check back soon — we regularly host special evenings.',
      reserve: 'Reserve a Table',
      contact: 'Enquire',
      per_person: 'per person',
      soldout: 'Sold Out',
      free: 'Free Entry',
      location: 'Kulinarium by Ammesso, Langenburg',
    },
    it: {
      eyebrow: 'Eventi',
      title: 'Eventi & Serate',
      sub: 'Serate speciali, serate del vino, musica dal vivo ed esperienze culinarie.',
      empty: 'Nessun evento in programma.',
      empty_sub: 'Ritorna presto — organizziamo regolarmente serate speciali.',
      reserve: 'Prenota un tavolo',
      contact: 'Richiedi',
      per_person: 'a persona',
      soldout: 'Esaurito',
      free: 'Ingresso libero',
      location: 'Kulinarium by Ammesso, Langenburg',
    },
  };
  const c = C[lang] || C.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-10">
      {/* Hero */}
      <div className="relative bg-espresso pt-20 sm:pt-24 pb-12 sm:pb-16 px-5 border-b border-[#C9A96E]/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/40" />
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body">{c.eyebrow}</p>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory mb-3 leading-[0.95]">{c.title}</h1>
          <p className="text-ivory/40 font-body text-sm max-w-md mx-auto mt-3">{c.sub}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-12 sm:py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-espresso border border-[#C9A96E]/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-7 h-7 text-gold/40" />
            </div>
            <h2 className="font-display text-2xl font-light text-ivory mb-3">{c.empty}</h2>
            <p className="text-ivory/40 text-sm font-body max-w-sm mx-auto mb-8">{c.empty_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/reserve" className="inline-flex items-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
                {c.reserve}
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
                {c.contact}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map(event => {
              const dateFormatted = event.event_date
                ? format(new Date(event.event_date), 'EEEE, d. MMMM yyyy', { locale })
                : '';
              return (
                <div key={event.id} className="glass-card border border-[#C9A96E]/10 rounded-2xl overflow-hidden hover:border-[#C9A96E]/25 transition-all group">
                  <div className="grid grid-cols-1 sm:grid-cols-3">
                    {/* Image / Date panel */}
                    <div className="relative h-48 sm:h-auto sm:min-h-[200px] overflow-hidden">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title_de} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-espresso flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-gold/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="font-display text-3xl font-light text-ivory">{event.event_date ? format(new Date(event.event_date), 'd', { locale }) : ''}</p>
                        <p className="text-gold text-xs tracking-widest uppercase font-body">{event.event_date ? format(new Date(event.event_date), 'MMM', { locale }) : ''}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="sm:col-span-2 p-5 sm:p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-gold text-[10px] tracking-widest uppercase font-body mb-1">{typeLabels[event.event_type] || event.event_type}</p>
                            <h2 className="font-display text-xl sm:text-2xl font-light text-ivory">
                              {lang === 'de' ? event.title_de : lang === 'en' ? (event.title_en || event.title_de) : (event.title_it || event.title_de)}
                            </h2>
                          </div>
                          {event.is_sold_out && (
                            <span className="flex-shrink-0 text-[10px] font-body text-red-400 border border-red-800/30 px-2.5 py-1 rounded-full">{c.soldout}</span>
                          )}
                        </div>

                        {(event.description_de || event.description_en || event.description_it) && (
                          <p className="text-ivory/50 text-sm font-body leading-relaxed mb-4 line-clamp-3">
                            {lang === 'de' ? event.description_de : lang === 'en' ? (event.description_en || event.description_de) : (event.description_it || event.description_de)}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-xs font-body text-ivory/40 mb-5">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gold/40" />{dateFormatted}</span>
                          {event.event_time && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold/40" />{event.event_time}{event.event_end_time ? ` – ${event.event_end_time}` : ''}</span>}
                          {event.max_guests > 0 && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gold/40" />{event.current_guests || 0} / {event.max_guests}</span>}
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold/40" />{c.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          {event.price_per_person > 0 ? (
                            <p className="text-ivory font-body font-medium">{event.price_per_person?.toFixed(2)} € <span className="text-ivory/40 font-normal">{c.per_person}</span></p>
                          ) : (
                            <p className="text-emerald-400 font-body text-sm">{c.free}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {event.booking_required && !event.is_sold_out && (
                            <Link to="/contact" className="flex items-center gap-1.5 px-5 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
                              {c.contact} <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                          <Link to="/reserve" className="flex items-center gap-1.5 px-5 py-2.5 btn-ghost-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
                            {c.reserve}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}