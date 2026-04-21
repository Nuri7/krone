import { useState, useMemo } from 'react';
import { CalendarDays, Users, Clock, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { format, addDays, isBefore, isToday, startOfDay, getDay, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { SITE, TIME_SLOTS } from '@/lib/siteData';
import { FadeUp } from '@/components/shared/Animations';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';
import { toast } from 'sonner';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Reserve() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

  // Calendar
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1; // Mon=0

  const isClosedDay = (d) => SITE.closed_days.includes(getDay(d)); // Monday
  const isPast = (d) => isBefore(d, today) && !isToday(d);

  // Time slots for selected date
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dow = getDay(selectedDate);
    if (dow === 0) return TIME_SLOTS.sunday;
    return { lunch: TIME_SLOTS.lunch, dinner: TIME_SLOTS.dinner };
  }, [selectedDate]);

  const isSunday = selectedDate && getDay(selectedDate) === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Please fill in your name and email');
      return;
    }
    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('reservations').insert({
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          guests,
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          status: 'confirmed',
        });
      }
      setDone(true);
      toast.success('Reservation confirmed!');
    } catch (err) {
      toast.error('Something went wrong. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-charcoal min-h-screen pt-32 px-5">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
            <Check className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display text-4xl text-ivory mb-3">Reservation Confirmed!</h1>
          <p className="text-ivory/40 font-body text-sm mb-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime} for {guests} {guests === 1 ? 'guest' : 'guests'}
          </p>
          <p className="text-ivory/30 font-body text-xs mb-8">
            A confirmation has been sent to <span className="text-ivory/50">{form.email}</span>
          </p>
          <a href={`tel:${SITE.phone}`} className="text-gold font-body text-sm hover:underline">
            Need to change? Call us: {SITE.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20">
      <section className="px-5">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
              Kulinarium by Ammesso
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-ivory mt-2">
              Reserve a Table
            </h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-semibold transition-all ${
                  step >= s ? 'bg-gold text-charcoal' : 'bg-[#C9A96E]/10 text-ivory/30'
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`w-10 h-px ${step > s ? 'bg-gold' : 'bg-ivory/10'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Date & Guests */}
          {step === 1 && (
            <FadeUp>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="font-display text-2xl text-ivory mb-6 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-gold" /> Choose Date & Guests
                </h2>

                {/* Guest selector */}
                <div className="mb-8">
                  <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-3 block">
                    <Users className="w-3 h-3 inline mr-1" /> Number of Guests
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {GUEST_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setGuests(n)}
                        className={`w-11 h-11 rounded-xl text-sm font-body font-medium transition-all ${
                          guests === n
                            ? 'bg-gold text-charcoal shadow-gold-glow'
                            : 'bg-[#C9A96E]/08 text-ivory/40 hover:bg-[#C9A96E]/15 hover:text-ivory/60'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {guests >= 7 && (
                    <p className="text-gold/60 text-xs font-body mt-2">
                      For groups of 8+, please <a href={`tel:${SITE.phone}`} className="underline">call us</a>.
                    </p>
                  )}
                </div>

                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setCalMonth(addMonths(calMonth, -1))}
                      className="w-8 h-8 rounded-lg bg-ivory/5 flex items-center justify-center text-ivory/40 hover:text-ivory">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-display text-lg text-ivory">
                      {format(calMonth, 'MMMM yyyy')}
                    </h3>
                    <button onClick={() => setCalMonth(addMonths(calMonth, 1))}
                      className="w-8 h-8 rounded-lg bg-ivory/5 flex items-center justify-center text-ivory/40 hover:text-ivory">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                      <div key={d} className="text-center text-ivory/20 text-xs font-body py-1">{d}</div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startPad }, (_, i) => (
                      <div key={`pad-${i}`} />
                    ))}
                    {days.map(day => {
                      const closed = isClosedDay(day);
                      const past = isPast(day);
                      const selected = selectedDate && isSameDay(day, selectedDate);
                      const disabled = closed || past;

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !disabled && setSelectedDate(day)}
                          disabled={disabled}
                          className={`h-10 rounded-lg text-sm font-body transition-all ${
                            selected
                              ? 'bg-gold text-charcoal font-semibold shadow-gold-glow'
                              : disabled
                                ? 'text-ivory/10 cursor-not-allowed'
                                : isToday(day)
                                  ? 'text-gold border border-gold/30 hover:bg-gold/10'
                                  : 'text-ivory/50 hover:bg-ivory/5 hover:text-ivory'
                          }`}
                        >
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex gap-4 mt-4 text-xs font-body text-ivory/20">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-ivory/10" /> Closed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full border border-gold/40" /> Today
                    </span>
                  </div>
                </div>

                {/* Next button */}
                <button
                  onClick={() => selectedDate && setStep(2)}
                  disabled={!selectedDate}
                  className={`w-full mt-8 py-4 rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all ${
                    selectedDate ? 'btn-gold' : 'bg-ivory/5 text-ivory/20 cursor-not-allowed'
                  }`}
                >
                  {selectedDate ? `Continue — ${format(selectedDate, 'EEE, MMM d')}` : 'Select a date'}
                </button>
              </div>
            </FadeUp>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <FadeUp>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-ivory/30 text-xs font-body mb-4 hover:text-ivory/50">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <h2 className="font-display text-2xl text-ivory mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold" /> Choose Time
                </h2>
                <p className="text-ivory/30 font-body text-sm mb-6">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')} · {guests} {guests === 1 ? 'guest' : 'guests'}
                </p>

                {isSunday ? (
                  <div>
                    <h3 className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-3">All Day (12:00 – 20:00)</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {TIME_SLOTS.sunday.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2.5 rounded-lg text-sm font-body transition-all ${
                            selectedTime === t
                              ? 'bg-gold text-charcoal font-semibold'
                              : 'bg-[#C9A96E]/08 text-ivory/40 hover:bg-[#C9A96E]/15'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-3">Lunch (12:00 – 14:30)</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.lunch.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2.5 rounded-lg text-sm font-body transition-all ${
                              selectedTime === t
                                ? 'bg-gold text-charcoal font-semibold'
                                : 'bg-[#C9A96E]/08 text-ivory/40 hover:bg-[#C9A96E]/15'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-3">Dinner (17:30 – 22:00)</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {TIME_SLOTS.dinner.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2.5 rounded-lg text-sm font-body transition-all ${
                              selectedTime === t
                                ? 'bg-gold text-charcoal font-semibold'
                                : 'bg-[#C9A96E]/08 text-ivory/40 hover:bg-[#C9A96E]/15'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={() => selectedTime && setStep(3)}
                  disabled={!selectedTime}
                  className={`w-full mt-8 py-4 rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold transition-all ${
                    selectedTime ? 'btn-gold' : 'bg-ivory/5 text-ivory/20 cursor-not-allowed'
                  }`}
                >
                  {selectedTime ? `Continue — ${selectedTime}` : 'Select a time'}
                </button>
              </div>
            </FadeUp>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <FadeUp>
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-ivory/30 text-xs font-body mb-4 hover:text-ivory/50">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <h2 className="font-display text-2xl text-ivory mb-2">Your Details</h2>
                <p className="text-ivory/30 font-body text-sm mb-6">
                  {format(selectedDate, 'EEE, MMM d')} at {selectedTime} · {guests} {guests === 1 ? 'guest' : 'guests'}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="input-dark" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="input-dark" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      className="input-dark" placeholder="+49 ..." />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Special Requests</label>
                    <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                      className="input-dark min-h-[80px] resize-none" placeholder="Allergies, celebrations, seating preferences..." />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
                  ) : (
                    <><Check className="w-3.5 h-3.5" /> Confirm Reservation</>
                  )}
                </button>
              </form>
            </FadeUp>
          )}
        </div>
      </section>
    </div>
  );
}
