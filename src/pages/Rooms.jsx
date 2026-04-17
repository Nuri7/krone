import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, ROOMS } from '@/lib/siteData';
import { CheckCircle, Star, Coffee, ExternalLink, ChevronRight, AlertCircle } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => format(addDays(new Date(), 1), 'yyyy-MM-dd');

const inputClass = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body";

export default function Rooms() {
  const { tr, lang } = useLang();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const returnState = params.get('return');
  const intentRef = params.get('ref');

  async function handleBook() {
    setRedirecting(true);
    const ref = `INT-${Date.now().toString(36).toUpperCase()}`;
    const beds24Url = buildBeds24Url();
    await base44.entities.BookingIntent.create({
      intent_ref: ref, status: 'redirected',
      check_in: checkIn || null, check_out: checkOut || null,
      guests_adults: adults, guests_children: children,
      room_interest: roomId, language: lang, source_page: 'rooms',
      beds24_url_used: beds24Url, redirected_at: new Date().toISOString(),
    });
    setTimeout(() => { window.location.href = beds24Url; }, 800);
  }

  function buildBeds24Url() {
    const base = SITE_DEFAULTS.beds24_booking_url;
    const p = new URLSearchParams();
    if (checkIn) p.set('checkin', checkIn.replace(/-/g, ''));
    if (checkOut) p.set('checkout', checkOut.replace(/-/g, ''));
    p.set('adults', adults);
    p.set('children', children);
    if (lang !== 'de') p.set('lang', lang);
    return `${base}&${p.toString()}`;
  }

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;

  const c = {
    de: { title: 'Zimmer & Suiten', subtitle: 'Komfortabel übernachten in Langenburg', book_direct: 'Direktbucher-Preise garantiert', no_commission: 'Keine Buchungsgebühren', breakfast: 'Frühstück optional (€14 p.P.)', proceed: 'Zur Buchung', handoff: 'Weiterleitung zum Buchungssystem...', room_type: 'Zimmertyp (optional)', check_in: 'Check-in', check_out: 'Check-out', adults: 'Erwachsene', children_label: 'Kinder', nights: 'Nacht', group_title: 'Hochzeiten & Gruppen' },
    en: { title: 'Rooms & Suites', subtitle: 'Comfortable stays in Langenburg', book_direct: 'Best Direct Booking Rates', no_commission: 'No booking fees', breakfast: 'Breakfast available (€14 p.p.)', proceed: 'Proceed to Booking', handoff: 'Redirecting to booking system...', room_type: 'Room Type (optional)', check_in: 'Check-in', check_out: 'Check-out', adults: 'Adults', children_label: 'Children', nights: 'Night', group_title: 'Weddings & Groups' },
    it: { title: 'Camere & Suite', subtitle: 'Soggiorni confortevoli a Langenburg', book_direct: 'Prezzi diretti garantiti', no_commission: 'Nessuna commissione', breakfast: 'Colazione disponibile (€14 a persona)', proceed: 'Procedi alla prenotazione', handoff: 'Reindirizzamento...', room_type: 'Tipo di camera (opzionale)', check_in: 'Check-in', check_out: 'Check-out', adults: 'Adulti', children_label: 'Bambini', nights: 'Notte', group_title: 'Matrimoni & Gruppi' },
  };
  const t = c[lang] || c.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-24">
      {/* Return banners */}
      {returnState === 'confirmed' && (
        <div className="max-w-4xl mx-auto px-5 pt-6">
          <div className="border border-gold/20 bg-gold/10 rounded-2xl p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div><p className="font-semibold text-ivory text-sm">{tr('rooms', 'returning_confirmed')}</p>
              {intentRef && <p className="text-xs text-gold/60 mt-0.5 font-body">Ref: {intentRef}</p>}</div>
          </div>
        </div>
      )}
      {returnState === 'pending' && (
        <div className="max-w-4xl mx-auto px-5 pt-6">
          <div className="border border-[#C9A96E]/15 bg-[#C9A96E]/05 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-gold/60 flex-shrink-0 mt-0.5" />
            <p className="text-ivory/60 text-sm font-body">{tr('rooms', 'returning_pending')}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center py-14 px-5">
        <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg</p>
        <h1 className="font-display text-5xl md:text-6xl font-light text-ivory mb-3">{t.title}</h1>
        <p className="text-ivory/40 font-body">{t.subtitle}</p>
      </div>

      <div className="max-w-5xl mx-auto px-5">
        {/* Direct booking trust */}
        <div className="border border-gold/20 bg-gold/5 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-gold" />
            <div>
              <p className="font-semibold text-ivory text-sm font-body">{t.book_direct}</p>
              <p className="text-gold/60 text-xs font-body">{t.no_commission}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-ivory/40 text-xs font-body">
            <Coffee className="w-4 h-4" /> {t.breakfast}
          </div>
        </div>

        {/* Booking form */}
        <div className="glass-card rounded-2xl p-7 border border-[#C9A96E]/10 mb-10">
          <h2 className="font-display text-2xl font-light text-ivory mb-6">{tr('hero', 'cta_book')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.check_in}</label>
              <input type="date" value={checkIn} min={today()}
                onChange={e => { setCheckIn(e.target.value); if (!checkOut || checkOut <= e.target.value) setCheckOut(format(addDays(new Date(e.target.value), 1), 'yyyy-MM-dd')); }}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.check_out}</label>
              <input type="date" value={checkOut} min={checkIn || tomorrow()}
                onChange={e => setCheckOut(e.target.value)}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.adults}</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))} className="w-9 h-9 rounded-lg border border-[#C9A96E]/15 text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors text-lg">−</button>
                <span className="w-8 text-center font-semibold text-ivory font-body">{adults}</span>
                <button onClick={() => setAdults(a => Math.min(6, a + 1))} className="w-9 h-9 rounded-lg border border-[#C9A96E]/15 text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors text-lg">+</button>
              </div>
            </div>
            <div>
              <label className="block text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.children_label}</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setChildren(c => Math.max(0, c - 1))} className="w-9 h-9 rounded-lg border border-[#C9A96E]/15 text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors text-lg">−</button>
                <span className="w-8 text-center font-semibold text-ivory font-body">{children}</span>
                <button onClick={() => setChildren(c => Math.min(4, c + 1))} className="w-9 h-9 rounded-lg border border-[#C9A96E]/15 text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors text-lg">+</button>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-ivory/30 text-[10px] tracking-[0.25em] uppercase font-body mb-2">{t.room_type}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ROOMS.map(r => (
                <button key={r.id} onClick={() => setRoomId(roomId === r.id ? '' : r.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-body transition-all ${roomId === r.id ? 'border-gold bg-gold/10 text-gold' : 'border-[#C9A96E]/15 text-ivory/50 hover:border-[#C9A96E]/30'}`}>
                  {lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                </button>
              ))}
            </div>
          </div>

          {nights > 0 && (
            <p className="text-ivory/30 text-sm font-body mb-4">
              {nights} {t.nights}{nights > 1 && lang === 'de' ? 'e' : ''} · {adults} {lang === 'de' ? 'Erw.' : lang === 'en' ? 'Adults' : 'Adulti'}
              {children > 0 ? ` · ${children} ${lang === 'de' ? 'Kinder' : 'Children'}` : ''}
            </p>
          )}

          <button onClick={handleBook} disabled={redirecting}
            className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {redirecting ? (
              <><div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />{t.handoff}</>
            ) : (
              <>{t.proceed} <ExternalLink className="w-4 h-4" /></>
            )}
          </button>
          <p className="text-xs text-ivory/25 text-center mt-2 font-body">{t.handoff}</p>
        </div>

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ROOMS.map(r => (
            <div key={r.id}
              className={`glass-card rounded-2xl overflow-hidden border-2 transition-all hover-lift ${roomId === r.id ? 'border-gold/40' : 'border-transparent'}`}>
              <div className="relative h-52 overflow-hidden">
                <img src={r.image} alt={r.key_de} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-light text-ivory mb-2">
                  {lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                </h3>
                <p className="text-ivory/45 text-sm font-body leading-relaxed mb-4">
                  {lang === 'de' ? r.description_de : lang === 'en' ? r.description_en : r.description_it}
                </p>
                <button onClick={() => { setRoomId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full py-2.5 border border-[#C9A96E]/20 text-gold/70 hover:border-gold/40 hover:text-gold text-xs font-body tracking-widest uppercase rounded-xl transition-colors">
                  {tr('hero', 'cta_book')} <ChevronRight className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wedding CTA */}
        <div className="bg-espresso border border-[#C9A96E]/10 rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl font-light text-ivory mb-2">💍 {t.group_title}</h3>
          <p className="text-ivory/40 text-sm font-body mb-5">
            {lang === 'de' ? 'Für Hochzeiten und Gruppen erstellen wir gerne ein individuelles Angebot.' : lang === 'en' ? 'For weddings and groups we are happy to create an individual offer.' : 'Per matrimoni e gruppi creiamo volentieri un\'offerta individuale.'}
          </p>
          <Link to="/weddings" className="inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
            {tr('nav', 'contact')} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}