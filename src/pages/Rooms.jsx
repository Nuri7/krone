import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, ROOMS } from '@/lib/siteData';
import { CheckCircle, Star, Coffee, ExternalLink, ChevronRight, AlertCircle } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => format(addDays(new Date(), 1), 'yyyy-MM-dd');

export default function Rooms() {
  const { tr, lang } = useLang();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [breakfast, setBreakfast] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Check URL for return state
  const params = new URLSearchParams(window.location.search);
  const returnState = params.get('return');
  const intentRef = params.get('ref');

  async function handleBook() {
    setRedirecting(true);
    const ref = `INT-${Date.now().toString(36).toUpperCase()}`;
    const beds24Url = buildBeds24Url();
    await base44.entities.BookingIntent.create({
      intent_ref: ref,
      status: 'redirected',
      check_in: checkIn || null,
      check_out: checkOut || null,
      guests_adults: adults,
      guests_children: children,
      room_interest: roomId,
      language: lang,
      source_page: 'rooms',
      beds24_url_used: beds24Url,
      redirected_at: new Date().toISOString(),
    });
    setTimeout(() => {
      window.location.href = beds24Url;
    }, 800);
  }

  function buildBeds24Url() {
    const base = SITE_DEFAULTS.beds24_booking_url;
    const params = new URLSearchParams();
    if (checkIn) params.set('checkin', checkIn.replace(/-/g, ''));
    if (checkOut) params.set('checkout', checkOut.replace(/-/g, ''));
    params.set('adults', adults);
    params.set('children', children);
    if (lang !== 'de') params.set('lang', lang);
    return `${base}&${params.toString()}`;
  }

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-24">
      {/* Return state banner */}
      {returnState === 'confirmed' && (
        <div className="max-w-3xl mx-auto px-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">{tr('rooms', 'returning_confirmed')}</p>
              {intentRef && <p className="text-xs text-green-600 mt-1">Ref: {intentRef}</p>}
            </div>
          </div>
        </div>
      )}
      {returnState === 'pending' && (
        <div className="max-w-3xl mx-auto px-4 mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">{tr('rooms', 'returning_pending')}</p>
              <p className="text-xs text-amber-600 mt-1">info@krone-ammesso.de</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-2">Krone Langenburg</p>
          <h1 className="text-4xl font-light text-stone-800 mb-3">{tr('rooms', 'title')}</h1>
          <p className="text-stone-500">{tr('rooms', 'subtitle')}</p>
        </div>

        {/* Direct booking trust bar */}
        <div className="bg-amber-600 text-white rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-200 flex-shrink-0" />
            <div>
              <p className="font-semibold">{tr('rooms', 'book_direct')}</p>
              <p className="text-amber-200 text-sm">{tr('rooms', 'no_commission')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-amber-200 text-sm">
            <Coffee className="w-4 h-4" />
            {tr('rooms', 'breakfast_option')}
          </div>
        </div>

        {/* Booking form */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-10">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">{tr('hero', 'cta_book')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{tr('rooms', 'check_in')}</label>
              <input type="date" value={checkIn} min={today()} onChange={e => { setCheckIn(e.target.value); if (!checkOut || checkOut <= e.target.value) setCheckOut(format(addDays(new Date(e.target.value), 1), 'yyyy-MM-dd')); }}
                className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{tr('rooms', 'check_out')}</label>
              <input type="date" value={checkOut} min={checkIn || tomorrow()} onChange={e => setCheckOut(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{tr('rooms', 'adults')}</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setAdults(a => Math.max(1, a - 1))} className="w-9 h-9 rounded-lg border border-stone-200 hover:bg-stone-50 text-lg">−</button>
                <span className="w-8 text-center font-semibold">{adults}</span>
                <button onClick={() => setAdults(a => Math.min(6, a + 1))} className="w-9 h-9 rounded-lg border border-stone-200 hover:bg-stone-50 text-lg">+</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">{tr('rooms', 'children')}</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setChildren(c => Math.max(0, c - 1))} className="w-9 h-9 rounded-lg border border-stone-200 hover:bg-stone-50 text-lg">−</button>
                <span className="w-8 text-center font-semibold">{children}</span>
                <button onClick={() => setChildren(c => Math.min(4, c + 1))} className="w-9 h-9 rounded-lg border border-stone-200 hover:bg-stone-50 text-lg">+</button>
              </div>
            </div>
          </div>

          {/* Room interest */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-stone-600 mb-2">Zimmertyp</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ROOMS.map(r => (
                <button key={r.id} onClick={() => setRoomId(roomId === r.id ? '' : r.id)}
                  className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${roomId === r.id ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                  {lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                </button>
              ))}
            </div>
          </div>

          {/* Breakfast */}
          <label className="flex items-center gap-3 cursor-pointer mb-5">
            <input type="checkbox" checked={breakfast} onChange={e => setBreakfast(e.target.checked)}
              className="w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-400" />
            <span className="text-sm text-stone-700">{tr('rooms', 'breakfast_option')}</span>
          </label>

          {nights > 0 && (
            <p className="text-sm text-stone-500 mb-4">{nights} Nacht{nights > 1 ? 'e' : ''} · {adults} Erw. {children > 0 ? `· ${children} Kind${children > 1 ? 'er' : ''}` : ''}</p>
          )}

          <button
            onClick={handleBook}
            disabled={redirecting}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {redirecting ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{tr('rooms', 'handoff_text')}</>
            ) : (
              <>{tr('rooms', 'proceed')} <ExternalLink className="w-4 h-4" /></>
            )}
          </button>
          <p className="text-xs text-stone-400 text-center mt-2">{tr('rooms', 'handoff_text')}</p>
        </div>

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ROOMS.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all ${roomId === r.id ? 'border-amber-400' : 'border-transparent'}`}>
              <div className="relative h-52 overflow-hidden">
                <img src={r.image} alt={r.key_de} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-stone-800 mb-2">
                  {lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {lang === 'de' ? r.description_de : lang === 'en' ? r.description_en : r.description_it}
                </p>
                <button onClick={() => { setRoomId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="mt-4 w-full py-2.5 border border-amber-600 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-50 transition-colors">
                  {tr('hero', 'cta_book')} <ChevronRight className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Group / wedding info */}
        <div className="bg-stone-900 text-white rounded-2xl p-7 text-center">
          <h3 className="text-lg font-semibold mb-2">💍 {tr('nav', 'weddings')}</h3>
          <p className="text-stone-400 text-sm mb-4">{tr('rooms', 'group_info')}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">
            {tr('nav', 'contact')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}