import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, TIME_SLOTS_LUNCH, TIME_SLOTS_DINNER, TIME_SLOTS_SUNDAY } from '@/lib/siteData';
import { CheckCircle, AlertCircle, Clock, Users, Calendar, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';

const MAX_CAPACITY = SITE_DEFAULTS.restaurant_capacity;
const CLOSED_DAYS = SITE_DEFAULTS.restaurant_closed_days;

function getDaySlots(date) {
  const day = new Date(date).getDay();
  if (CLOSED_DAYS.includes(day)) return [];
  if (day === 0) return TIME_SLOTS_SUNDAY;
  return [...TIME_SLOTS_LUNCH, ...TIME_SLOTS_DINNER];
}

const inputClass = "w-full bg-[#1A1410] border border-[#C9A96E]/15 rounded-xl px-4 py-3.5 text-sm text-ivory placeholder-ivory/25 focus:outline-none focus:border-gold/40 transition-colors font-body";

export default function Reserve() {
  const { tr, lang } = useLang();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [slots, setSlots] = useState([]);
  const [usedCapacity, setUsedCapacity] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', requests: '' });
  const [reservationRef, setReservationRef] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  async function searchSlots() {
    if (!date) return;
    setLoading(true);
    setError('');
    const daySlots = getDaySlots(date);
    if (daySlots.length === 0) { setSlots([]); setUsedCapacity({}); setStep(2); setLoading(false); return; }
    const existing = await base44.entities.Reservation.filter({ reservation_date: date, status: { $in: ['pending', 'confirmed'] } });
    const cap = {};
    daySlots.forEach(s => { cap[s] = 0; });
    existing.forEach(r => { if (cap[r.reservation_time] !== undefined) cap[r.reservation_time] += (r.party_size || 0); });
    setUsedCapacity(cap);
    setSlots(daySlots);
    setStep(2);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) return;
    setSubmitting(true);
    setError('');
    const dupKey = `${form.email}|${date}|${time}`;
    const dups = await base44.entities.Reservation.filter({ duplicate_check_key: dupKey });
    if (dups.length > 0) { setError(tr('reservation', 'error_duplicate')); setSubmitting(false); return; }
    const existing = await base44.entities.Reservation.filter({ reservation_date: date, reservation_time: time, status: { $in: ['pending', 'confirmed'] } });
    const used = existing.reduce((sum, r) => sum + (r.party_size || 0), 0);
    if (used + guests > MAX_CAPACITY) { setError(tr('reservation', 'error_full')); setSubmitting(false); return; }
    const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
    await base44.entities.Reservation.create({
      reservation_ref: ref, status: 'confirmed',
      guest_first_name: form.first_name, guest_last_name: form.last_name,
      guest_email: form.email, guest_phone: form.phone,
      reservation_date: date, reservation_time: time,
      party_size: guests, special_requests: form.requests,
      language: lang, source: 'website', duplicate_check_key: dupKey,
    });
    base44.functions.invoke('sendReservationEmail', { ref, first_name: form.first_name, last_name: form.last_name, email: form.email, date, time, guests, lang, requests: form.requests }).catch(() => {});
    base44.functions.invoke('notifySlack', { type: 'reservation', ref, name: `${form.first_name} ${form.last_name}`, date, time, guests, lang }).catch(() => {});
    setReservationRef(ref);
    setSuccess(true);
    setSubmitting(false);
  }

  const remaining = (t) => MAX_CAPACITY - (usedCapacity[t] || 0);
  const isFull = (t) => remaining(t) < guests;

  if (success) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-5 pt-24 pb-20">
        <div className="max-w-md w-full glass-card border border-[#C9A96E]/15 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-gold" />
          </div>
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg</p>
          <h1 className="font-display text-3xl font-light text-ivory mb-3">{tr('reservation', 'success_title')}</h1>
          <p className="text-ivory/50 font-body text-sm mb-5">{tr('reservation', 'success_text')}</p>
          <p className="text-xs text-ivory/30 font-body mb-6">Ref: <strong className="text-ivory/50">{reservationRef}</strong></p>
          <div className="bg-[#1A1410] rounded-xl p-5 text-sm font-body text-left space-y-2 mb-7 border border-[#C9A96E]/10">
            <div className="flex justify-between"><span className="text-ivory/40">{tr('reservation', 'date')}</span><span className="text-ivory">{date}</span></div>
            <div className="flex justify-between"><span className="text-ivory/40">{tr('reservation', 'time')}</span><span className="text-ivory">{time}</span></div>
            <div className="flex justify-between"><span className="text-ivory/40">{tr('reservation', 'guests')}</span><span className="text-ivory">{guests}</span></div>
          </div>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
            {tr('common', 'back')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-24 pb-28 px-5">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg by Ammesso</p>
          <h1 className="font-display text-5xl font-light text-ivory mb-2">{tr('reservation', 'title')}</h1>
          <p className="text-ivory/40 font-body text-sm">{tr('reservation', 'subtitle')}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-medium border transition-all ${step >= s ? 'border-gold bg-gold text-charcoal' : 'border-[#C9A96E]/20 text-ivory/30'}`}>{s}</div>
              {s < 3 && <div className={`w-10 h-px ${step > s ? 'bg-gold/50' : 'bg-[#C9A96E]/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-7">
            <div className="space-y-6">
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-2">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />{tr('reservation', 'date')} *
                </label>
                <input type="date" value={date} min={today} max={maxDate}
                  onChange={e => setDate(e.target.value)}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-3">
                  <Users className="w-3.5 h-3.5 inline mr-1" />{tr('reservation', 'guests')}
                </label>
                <div className="flex items-center gap-5">
                  <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-11 h-11 rounded-full border border-[#C9A96E]/20 text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors text-xl">−</button>
                  <span className="font-display text-3xl text-ivory w-8 text-center">{guests}</span>
                  <button type="button" onClick={() => setGuests(g => Math.min(10, g + 1))}
                    className="w-11 h-11 rounded-full border border-[#C9A96E]/20 text-ivory/60 hover:border-gold/40 hover:text-gold transition-colors text-xl">+</button>
                </div>
                {guests === 10 && (
                  <p className="text-gold/70 text-xs font-body mt-2">{tr('reservation', 'max_party')}</p>
                )}
              </div>
            </div>
            <button onClick={searchSlots} disabled={!date || loading}
              className="mt-8 w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : null}
              {loading ? '' : tr('reservation', 'search')}
              {!loading && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-7">
            <button onClick={() => setStep(1)} className="text-ivory/30 hover:text-ivory/60 text-xs font-body tracking-widest uppercase mb-5 flex items-center gap-1 transition-colors">
              ← {tr('common', 'back')}
            </button>
            <div className="flex items-center gap-2 mb-6 text-sm font-body text-ivory/50">
              <Clock className="w-4 h-4 text-gold/50" />
              <span>{date} · {guests} {tr('reservation', 'guests')}</span>
            </div>

            {slots.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 text-ivory/20" />
                <p className="text-ivory/40 font-body text-sm">
                  {CLOSED_DAYS.includes(new Date(date).getDay())
                    ? (lang === 'de' ? 'Montag ist unser Ruhetag.' : lang === 'en' ? 'Monday is our day off.' : 'Lunedì siamo chiusi.')
                    : tr('reservation', 'no_slots')}
                </p>
              </div>
            ) : (
              <>
                <p className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-4">{tr('reservation', 'select_time')}</p>
                {/* Lunch slots */}
                {TIME_SLOTS_LUNCH.some(s => slots.includes(s)) && (
                  <div className="mb-5">
                    <p className="text-ivory/25 text-[10px] tracking-[0.25em] uppercase font-body mb-3">{lang === 'de' ? 'Mittagessen' : lang === 'en' ? 'Lunch' : 'Pranzo'} · 12:00–14:30</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {TIME_SLOTS_LUNCH.filter(s => slots.includes(s)).map(slot => {
                        const full = isFull(slot);
                        return (
                          <button key={slot} onClick={() => { if (!full) { setTime(slot); setStep(3); } }} disabled={full}
                            className={`py-3 rounded-xl text-xs font-body border transition-all ${full ? 'border-[#C9A96E]/05 text-ivory/15 cursor-not-allowed' : time === slot ? 'border-gold bg-gold text-charcoal' : 'border-[#C9A96E]/15 text-ivory/60 hover:border-gold/40 hover:text-ivory'}`}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Dinner slots */}
                {TIME_SLOTS_DINNER.some(s => slots.includes(s)) && (
                  <div>
                    <p className="text-ivory/25 text-[10px] tracking-[0.25em] uppercase font-body mb-3">{lang === 'de' ? 'Abendessen' : lang === 'en' ? 'Dinner' : 'Cena'} · 17:30–22:00</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {TIME_SLOTS_DINNER.filter(s => slots.includes(s)).map(slot => {
                        const full = isFull(slot);
                        return (
                          <button key={slot} onClick={() => { if (!full) { setTime(slot); setStep(3); } }} disabled={full}
                            className={`py-3 rounded-xl text-xs font-body border transition-all ${full ? 'border-[#C9A96E]/05 text-ivory/15 cursor-not-allowed' : time === slot ? 'border-gold bg-gold text-charcoal' : 'border-[#C9A96E]/15 text-ivory/60 hover:border-gold/40 hover:text-ivory'}`}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-7">
            <button onClick={() => setStep(2)} className="text-ivory/30 hover:text-ivory/60 text-xs font-body tracking-widest uppercase mb-5 flex items-center gap-1 transition-colors">
              ← {tr('common', 'back')}
            </button>
            <div className="flex items-center gap-2 mb-6 text-sm font-body bg-gold/10 border border-gold/20 rounded-xl p-3">
              <Clock className="w-4 h-4 text-gold" />
              <span className="text-ivory">{date} · <strong>{time}</strong> · {guests} {tr('reservation', 'guests')}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{tr('reservation', 'first_name')} *</label>
                  <input type="text" autoComplete="given-name" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{tr('reservation', 'last_name')} *</label>
                  <input type="text" autoComplete="family-name" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{tr('reservation', 'email')} *</label>
                <input type="email" autoComplete="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{tr('reservation', 'phone')}</label>
                <input type="tel" autoComplete="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{tr('reservation', 'requests')}</label>
                <textarea rows={3} value={form.requests} onChange={e => setForm(f => ({ ...f, requests: e.target.value }))} className={`${inputClass} resize-none`} />
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800/30 rounded-xl p-3 flex gap-2 text-sm text-red-300 font-body">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <p className="text-xs text-ivory/25 font-body leading-relaxed">{tr('reservation', 'policy')}</p>

              <button type="submit" disabled={submitting}
                className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50">
                {submitting ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin mx-auto" /> : tr('reservation', 'confirm')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}