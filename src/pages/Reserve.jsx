import { useState, useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS, TIME_SLOTS_LUNCH, TIME_SLOTS_DINNER, TIME_SLOTS_SUNDAY } from '@/lib/siteData';
import { CheckCircle, AlertCircle, Clock, Users, Calendar, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';

const MAX_CAPACITY = SITE_DEFAULTS.restaurant_capacity;
const CLOSED_DAYS = SITE_DEFAULTS.restaurant_closed_days; // [1] = Monday

function getDaySlots(date) {
  const day = new Date(date).getDay(); // 0=Sun
  if (CLOSED_DAYS.includes(day)) return [];
  if (day === 0) return TIME_SLOTS_SUNDAY;
  return [...TIME_SLOTS_LUNCH, ...TIME_SLOTS_DINNER];
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Reserve() {
  const { tr, lang } = useLang();
  const [step, setStep] = useState(1); // 1=search, 2=slots, 3=details, 4=done
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [slots, setSlots] = useState([]);
  const [usedCapacity, setUsedCapacity] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', requests: '' });
  const [success, setSuccess] = useState(false);
  const [reservationRef, setReservationRef] = useState('');

  const today = getTodayStr();
  const maxDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  async function searchSlots() {
    if (!date) return;
    setLoading(true);
    setError('');
    const daySlots = getDaySlots(date);
    if (daySlots.length === 0) {
      setSlots([]);
      setUsedCapacity({});
      setStep(2);
      setLoading(false);
      return;
    }
    // Load reservations for this date
    const existing = await base44.entities.Reservation.filter({
      reservation_date: date,
      status: { $in: ['pending', 'confirmed'] }
    });
    const cap = {};
    daySlots.forEach(s => { cap[s] = 0; });
    existing.forEach(r => {
      if (cap[r.reservation_time] !== undefined) {
        cap[r.reservation_time] += (r.party_size || 0);
      }
    });
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
    // Duplicate check
    const dups = await base44.entities.Reservation.filter({ duplicate_check_key: dupKey });
    if (dups.length > 0) {
      setError(tr('reservation', 'error_duplicate'));
      setSubmitting(false);
      return;
    }
    // Capacity re-check server-side
    const existing = await base44.entities.Reservation.filter({
      reservation_date: date,
      reservation_time: time,
      status: { $in: ['pending', 'confirmed'] }
    });
    const used = existing.reduce((sum, r) => sum + (r.party_size || 0), 0);
    if (used + guests > MAX_CAPACITY) {
      setError(tr('reservation', 'error_full'));
      setSubmitting(false);
      return;
    }
    const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
    await base44.entities.Reservation.create({
      reservation_ref: ref,
      status: 'confirmed',
      guest_first_name: form.first_name,
      guest_last_name: form.last_name,
      guest_email: form.email,
      guest_phone: form.phone,
      reservation_date: date,
      reservation_time: time,
      party_size: guests,
      special_requests: form.requests,
      language: lang,
      source: 'website',
      duplicate_check_key: dupKey,
    });
    // Send confirmation via backend
    base44.functions.invoke('sendReservationEmail', {
      ref, first_name: form.first_name, last_name: form.last_name,
      email: form.email, date, time, guests, lang,
      requests: form.requests
    }).catch(() => {});
    base44.functions.invoke('notifySlack', {
      type: 'reservation', ref,
      name: `${form.first_name} ${form.last_name}`,
      date, time, guests, lang
    }).catch(() => {});
    setReservationRef(ref);
    setSuccess(true);
    setStep(4);
    setSubmitting(false);
  }

  const remaining = (t) => MAX_CAPACITY - (usedCapacity[t] || 0);
  const isFull = (t) => remaining(t) < guests;

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-24 pb-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-2">{tr('reservation', 'success_title')}</h1>
          <p className="text-stone-600 mb-4">{tr('reservation', 'success_text')}</p>
          <p className="text-sm text-stone-400 mb-2">Ref: <strong className="text-stone-600">{reservationRef}</strong></p>
          <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600 mb-6 text-left space-y-1">
            <div><span className="text-stone-400">{tr('reservation', 'date')}:</span> {date}</div>
            <div><span className="text-stone-400">{tr('reservation', 'time')}:</span> {time}</div>
            <div><span className="text-stone-400">{tr('reservation', 'guests')}:</span> {guests}</div>
          </div>
          <a href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">
            {tr('common', 'back')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-2">
            Krone Langenburg by Ammesso
          </p>
          <h1 className="text-3xl font-light text-stone-800">{tr('reservation', 'title')}</h1>
          <p className="text-stone-500 mt-2 text-sm">{tr('reservation', 'subtitle')}</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-400'}`}>{s}</div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-amber-600' : 'bg-stone-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Date + guests */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1" />{tr('reservation', 'date')}
                </label>
                <input
                  type="date" value={date} min={today} max={maxDate}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <Users className="w-4 h-4 inline mr-1" />{tr('reservation', 'guests')}
                </label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-11 h-11 rounded-xl border border-stone-200 text-xl font-light hover:bg-stone-50 active:bg-stone-100 transition-colors">−</button>
                  <span className="text-2xl font-semibold text-stone-800 w-8 text-center">{guests}</span>
                  <button type="button" onClick={() => setGuests(g => Math.min(10, g + 1))}
                    className="w-11 h-11 rounded-xl border border-stone-200 text-xl font-light hover:bg-stone-50 active:bg-stone-100 transition-colors">+</button>
                </div>
                {guests === 10 && (
                  <p className="mt-2 text-xs text-amber-600">{tr('reservation', 'max_party')}</p>
                )}
              </div>
            </div>
            <button
              onClick={searchSlots}
              disabled={!date || loading}
              className="mt-6 w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? tr('common', 'loading') : tr('reservation', 'search')}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Step 2: Time slot selection */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <button onClick={() => setStep(1)} className="text-sm text-stone-400 hover:text-stone-600 mb-4 flex items-center gap-1">
              ← {tr('common', 'back')}
            </button>
            <div className="flex items-center gap-2 mb-4 text-sm text-stone-600">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{date} · {guests} {tr('reservation', 'guests')}</span>
            </div>

            {slots.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                <p>{CLOSED_DAYS.includes(new Date(date).getDay()) ? tr('home', 'monday') + ': ' + tr('home', 'closed') : tr('reservation', 'no_slots')}</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">{tr('reservation', 'select_time')}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(slot => {
                    const rem = remaining(slot);
                    const full = rem < guests;
                    return (
                      <button
                        key={slot}
                        onClick={() => { if (!full) { setTime(slot); setStep(3); } }}
                        disabled={full}
                        className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          full
                            ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed'
                            : time === slot
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-stone-200 hover:border-amber-400 text-stone-700'
                        }`}
                      >
                        <div>{slot}</div>
                        {!full && rem <= 20 && (
                          <div className="text-xs text-amber-500 mt-0.5">{tr('reservation', 'capacity_warning', { n: rem })}</div>
                        )}
                        {full && <div className="text-xs mt-0.5">ausgebucht</div>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Guest details */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <button onClick={() => setStep(2)} className="text-sm text-stone-400 hover:text-stone-600 mb-4 flex items-center gap-1">
              ← {tr('common', 'back')}
            </button>
            <div className="flex items-center gap-2 mb-5 text-sm text-stone-600 bg-amber-50 rounded-xl p-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{date} · {time} · {guests} {tr('reservation', 'guests')}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">{tr('reservation', 'first_name')} *</label>
                  <input type="text" autoComplete="given-name" required
                    value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">{tr('reservation', 'last_name')} *</label>
                  <input type="text" autoComplete="family-name" required
                    value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full border border-stone-200 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{tr('reservation', 'email')} *</label>
                <input type="email" autoComplete="email" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{tr('reservation', 'phone')}</label>
                <input type="tel" autoComplete="tel"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{tr('reservation', 'requests')}</label>
                <textarea rows={3}
                  value={form.requests} onChange={e => setForm(f => ({ ...f, requests: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <p className="text-xs text-stone-400 leading-relaxed">{tr('reservation', 'policy')}</p>

              <button
                type="submit" disabled={submitting}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
              >
                {submitting ? tr('common', 'loading') : tr('reservation', 'confirm')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}