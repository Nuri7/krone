import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
  venue: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
};

export default function Weddings() {
  const { lang } = useLang();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    event_type: 'wedding', guest_count: '', preferred_date: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const EVENT_TYPES = [
    { id: 'wedding', de: '💍 Hochzeit', en: '💍 Wedding', it: '💍 Matrimonio' },
    { id: 'celebration', de: '🎉 Feier & Jubiläum', en: '🎉 Celebration', it: '🎉 Celebrazione' },
    { id: 'corporate', de: '🏢 Firmenevent', en: '🏢 Corporate Event', it: '🏢 Evento aziendale' },
    { id: 'private_dining', de: '🍽️ Private Dining', en: '🍽️ Private Dining', it: '🍽️ Cena privata' },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    await base44.entities.ContactInquiry.create({
      ...form,
      inquiry_type: form.event_type === 'wedding' ? 'wedding' : 'event',
      guest_count: parseInt(form.guest_count) || 0,
      language: lang,
      source: 'website',
    });
    base44.functions.invoke('notifySlack', {
      type: 'contact',
      name: `${form.first_name} ${form.last_name}`,
      email: form.email,
      inquiry_type: form.event_type,
      message: form.message.slice(0, 200),
    }).catch(() => {});
    base44.functions.invoke('sendContactEmail', {
      first_name: form.first_name, last_name: form.last_name,
      email: form.email, phone: form.phone,
      message: `[${form.event_type}] Gäste: ${form.guest_count} | Datum: ${form.preferred_date}\n\n${form.message}`,
      inquiry_type: form.event_type, lang,
    }).catch(() => {});
    setDone(true);
    setSubmitting(false);
  }

  const t = {
    de: {
      label: 'Hochzeiten & Events',
      title: 'Ihr besonderer Tag. Unsere ganze Leidenschaft.',
      sub: 'Wir gestalten unvergessliche Momente — von der ersten Anfrage bis zum letzten Gast.',
      features: [
        { icon: Heart, title: 'Hochzeiten', text: 'Intimes Ambiente mit Liebe zum Detail. Raumkontingente für Ihre Gäste.' },
        { icon: Users, title: 'Gruppen & Feiern', text: 'Geburtstage, Jubiläen, Firmenfeiern — wir gestalten Ihr Fest.' },
        { icon: Sparkles, title: 'Private Dining', text: 'Exklusives Abendessen für besondere Anlässe in privatem Rahmen.' },
      ],
      form_title: 'Anfrage senden',
      event_type: 'Art des Events',
      guests: 'Gästezahl',
      date: 'Wunschdatum',
      first: 'Vorname',
      last: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      message: 'Ihre Nachricht',
      submit: 'Anfrage senden',
      success_title: 'Anfrage erhalten!',
      success_text: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    },
    en: {
      label: 'Weddings & Events',
      title: 'Your Special Day. Our Whole Heart.',
      sub: 'We create unforgettable moments — from the first enquiry to the last guest.',
      features: [
        { icon: Heart, title: 'Weddings', text: 'Intimate atmosphere with attention to detail. Room contingents for your guests.' },
        { icon: Users, title: 'Groups & Celebrations', text: 'Birthdays, anniversaries, corporate parties — we make your event special.' },
        { icon: Sparkles, title: 'Private Dining', text: 'Exclusive dining for special occasions in a private setting.' },
      ],
      form_title: 'Send an Enquiry',
      event_type: 'Event Type',
      guests: 'Guest Count',
      date: 'Preferred Date',
      first: 'First Name',
      last: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Your Message',
      submit: 'Send Enquiry',
      success_title: 'Enquiry Received!',
      success_text: 'We will be in touch within 24 hours.',
    },
    it: {
      label: 'Matrimoni & Eventi',
      title: 'Il tuo giorno speciale. Tutta la nostra passione.',
      sub: 'Creiamo momenti indimenticabili — dalla prima richiesta all\'ultimo ospite.',
      features: [
        { icon: Heart, title: 'Matrimoni', text: 'Atmosfera intima con cura per i dettagli. Contingenti di camere per i vostri ospiti.' },
        { icon: Users, title: 'Gruppi & Feste', text: 'Compleanni, anniversari, feste aziendali — rendiamo il vostro evento speciale.' },
        { icon: Sparkles, title: 'Cena privata', text: 'Cena esclusiva per occasioni speciali in un ambiente privato.' },
      ],
      form_title: 'Invia una richiesta',
      event_type: 'Tipo di evento',
      guests: 'Numero di ospiti',
      date: 'Data preferita',
      first: 'Nome',
      last: 'Cognome',
      email: 'Email',
      phone: 'Telefono',
      message: 'Il tuo messaggio',
      submit: 'Invia richiesta',
      success_title: 'Richiesta ricevuta!',
      success_text: 'Vi risponderemo entro 24 ore.',
    },
  };
  const c = t[lang] || t.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-20 lg:pb-0">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img src={IMAGES.hero} alt="Weddings at Krone Langenburg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-12 px-5">
          <div className="max-w-3xl mx-auto w-full">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.label}</p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-ivory leading-tight">{c.title}</h1>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <section className="py-14 px-5 bg-espresso border-y border-[#C9A96E]/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-2xl font-light text-ivory/80 italic">{c.sub}</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.features.map((f, i) => (
            <div key={i} className="glass-card rounded-2xl p-7 border border-[#C9A96E]/10">
              <f.icon className="w-6 h-6 text-gold mb-4" />
              <h3 className="font-display text-xl font-light text-ivory mb-2">{f.title}</h3>
              <p className="text-ivory/50 text-sm font-body leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-5 bg-espresso">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">{c.label}</p>
            <h2 className="font-display text-4xl font-light text-ivory">{c.form_title}</h2>
          </div>

          {done ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-[#C9A96E]/15">
              <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl font-light text-ivory mb-2">{c.success_title}</h3>
              <p className="text-ivory/50 font-body text-sm">{c.success_text}</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 border border-[#C9A96E]/10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Event type */}
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-3">{c.event_type}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EVENT_TYPES.map(t => (
                      <button key={t.id} type="button"
                        onClick={() => setForm(f => ({ ...f, event_type: t.id }))}
                        className={`px-4 py-3 rounded-xl text-sm font-body text-left border transition-all ${
                          form.event_type === t.id
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-[#C9A96E]/15 text-ivory/50 hover:border-[#C9A96E]/30'
                        }`}>
                        {lang === 'de' ? t.de : lang === 'en' ? t.en : t.it}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.first} *</label>
                    <input type="text" required value={form.first_name}
                      onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                      className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body" />
                  </div>
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.last} *</label>
                    <input type="text" required value={form.last_name}
                      onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                      className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body" />
                  </div>
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.email} *</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.phone}</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body" />
                  </div>
                  <div>
                    <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.guests}</label>
                    <input type="number" min="1" value={form.guest_count}
                      onChange={e => setForm(f => ({ ...f, guest_count: e.target.value }))}
                      className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body" />
                  </div>
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.date}</label>
                  <input type="date" value={form.preferred_date}
                    onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))}
                    className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:border-gold/40 transition-colors font-body" />
                </div>
                <div>
                  <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{c.message} *</label>
                  <textarea rows={4} required value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-charcoal/60 border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/20 focus:outline-none focus:border-gold/40 transition-colors font-body resize-none" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50">
                  {submitting ? '...' : c.submit}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}