import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ChevronDown, UtensilsCrossed, BedDouble, ArrowRight } from 'lucide-react';

const FAQS = {
  de: [
    { cat: 'restaurant', q: 'Wie kann ich einen Tisch reservieren?', a: 'Über unsere Online-Reservierung unter /reserve, per E-Mail an info@krone-ammesso.de oder telefonisch unter +49 7905 41770. Gruppen ab 10 Personen bitten wir um direkte Kontaktaufnahme.' },
    { cat: 'restaurant', q: 'Wann ist das Restaurant geöffnet?', a: 'Dienstag bis Samstag: 12:00–14:30 Uhr und 17:30–22:00 Uhr. Sonntag: 12:00–20:00 Uhr. Montag: Ruhetag.' },
    { cat: 'restaurant', q: 'Gibt es vegetarische oder vegane Optionen?', a: 'Ja, wir haben vegetarische Gerichte auf der Karte. Bitte teilen Sie uns Ihre Ernährungsanforderungen oder Allergien bei der Reservierung mit — wir berücksichtigen diese gerne.' },
    { cat: 'restaurant', q: 'Kann ich für eine Hochzeit oder ein Event reservieren?', a: 'Ja! Für Hochzeiten, Firmenfeiern und Gruppenevents kontaktieren Sie uns bitte direkt über unser Hochzeiten & Events Formular.' },
    { cat: 'rooms', q: 'Wie buche ich ein Zimmer?', a: 'Zimmer werden über unser sicheres Buchungssystem (Beds24) gebucht. Klicken Sie auf "Zimmer buchen" und wählen Sie Ihren gewünschten Zeitraum.' },
    { cat: 'rooms', q: 'Ist Frühstück inklusive?', a: 'Frühstück ist optional zubuchbar für €14 pro Person. Bei der Buchung oder per E-Mail anfragen.' },
    { cat: 'rooms', q: 'Wie lauten die Check-in/Check-out Zeiten?', a: 'Check-in: ab 15:00 Uhr. Check-out: bis 11:00 Uhr. Früh-Check-in oder Späte Abreise auf Anfrage möglich.' },
    { cat: 'booking', q: 'Kann ich meine Reservierung stornieren?', a: 'Reservierungen können bis 24 Stunden vor dem Termin kostenfrei storniert werden. Bitte kontaktieren Sie uns per E-Mail oder Telefon.' },
    { cat: 'booking', q: 'Gibt es Direktbucher-Vorteile?', a: 'Ja! Bei Direktbuchung über unsere Website erhalten Sie die besten verfügbaren Preise ohne Buchungsgebühren.' },
    { cat: 'general', q: 'Gibt es Parkplätze?', a: 'Ja, kostenlose Parkplätze stehen in direkter Nähe zur Verfügung.' },
    { cat: 'general', q: 'Ist das Restaurant barrierefrei?', a: 'Bitte kontaktieren Sie uns direkt, damit wir Ihnen alle Details zu Barrierefreiheit mitteilen können.' },
  ],
  en: [
    { cat: 'restaurant', q: 'How can I reserve a table?', a: 'Via our online reservation at /reserve, by email at info@krone-ammesso.de, or by phone at +49 7905 41770. For groups of 10+ please contact us directly.' },
    { cat: 'restaurant', q: 'When is the restaurant open?', a: 'Tuesday to Saturday: 12:00–14:30 and 17:30–22:00. Sunday: 12:00–20:00. Monday: closed.' },
    { cat: 'restaurant', q: 'Are there vegetarian or vegan options?', a: 'Yes, we have vegetarian dishes on the menu. Please let us know your dietary requirements or allergies at booking — we are happy to accommodate.' },
    { cat: 'restaurant', q: 'Can I book for a wedding or event?', a: 'Yes! For weddings, corporate events and group celebrations, please contact us through our Weddings & Events form.' },
    { cat: 'rooms', q: 'How do I book a room?', a: 'Rooms are booked via our secure booking system (Beds24). Click "Book a Room" and select your preferred dates.' },
    { cat: 'rooms', q: 'Is breakfast included?', a: 'Breakfast is optionally available for €14 per person. Request at booking or by email.' },
    { cat: 'rooms', q: 'What are the check-in/check-out times?', a: 'Check-in: from 3pm. Check-out: by 11am. Early check-in or late checkout on request.' },
    { cat: 'booking', q: 'Can I cancel my reservation?', a: 'Reservations can be cancelled free of charge up to 24 hours before the appointment. Please contact us by email or phone.' },
    { cat: 'booking', q: 'Are there direct booking benefits?', a: 'Yes! Booking directly through our website gives you the best available rates with no booking fees.' },
    { cat: 'general', q: 'Is there parking available?', a: 'Yes, free parking is available nearby.' },
    { cat: 'general', q: 'Is the restaurant accessible?', a: 'Please contact us directly for full details about accessibility.' },
  ],
  it: [
    { cat: 'restaurant', q: 'Come posso prenotare un tavolo?', a: 'Tramite la prenotazione online su /reserve, via email a info@krone-ammesso.de o per telefono al +49 7905 41770.' },
    { cat: 'restaurant', q: 'Quando è aperto il ristorante?', a: 'Martedì–Sabato: 12:00–14:30 e 17:30–22:00. Domenica: 12:00–20:00. Lunedì: chiuso.' },
    { cat: 'restaurant', q: 'Ci sono opzioni vegetariane?', a: 'Sì, abbiamo piatti vegetariani nel menu. Comunicateci le vostre esigenze alimentari o allergie alla prenotazione.' },
    { cat: 'rooms', q: 'Come prenoto una camera?', a: 'Le camere si prenotano tramite il nostro sistema sicuro (Beds24). Clicca su "Prenota una camera" e scegli le date.' },
    { cat: 'rooms', q: 'La colazione è inclusa?', a: 'La colazione è disponibile a €14 a persona. Richiedetela alla prenotazione o via email.' },
    { cat: 'booking', q: 'Posso cancellare la prenotazione?', a: 'Le prenotazioni possono essere cancellate gratuitamente fino a 24 ore prima. Contattaci per email o telefono.' },
    { cat: 'general', q: 'C\'è parcheggio disponibile?', a: 'Sì, parcheggio gratuito disponibile nelle vicinanze.' },
  ],
};

const CAT_LABELS = {
  de: { restaurant: 'Restaurant', rooms: 'Zimmer', booking: 'Buchung & Reservierung', general: 'Allgemein' },
  en: { restaurant: 'Restaurant', rooms: 'Rooms', booking: 'Booking & Reservations', general: 'General' },
  it: { restaurant: 'Ristorante', rooms: 'Camere', booking: 'Prenotazioni', general: 'Generale' },
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`glass-card border rounded-xl transition-all ${open ? 'border-gold/20' : 'border-[#C9A96E]/08'}`}>
      <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setOpen(o => !o)}>
        <span className="font-body text-sm text-ivory leading-relaxed">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gold/50 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="h-px bg-[#C9A96E]/10 mb-4" />
          <p className="text-ivory/55 text-sm font-body leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { lang } = useLang();
  const [activecat, setActiveCat] = useState('all');
  const items = FAQS[lang] || FAQS.de;
  const labels = CAT_LABELS[lang] || CAT_LABELS.de;
  const categories = ['all', ...Object.keys(labels)];
  const filtered = activecat === 'all' ? items : items.filter(f => f.cat === activecat);

  const allLabel = { de: 'Alle', en: 'All', it: 'Tutti' };

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-espresso pt-24 pb-12 px-5 border-b border-[#C9A96E]/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Krone Langenburg by Ammesso</p>
          <h1 className="font-display text-5xl font-light text-ivory mb-3">FAQ</h1>
          <p className="text-ivory/40 font-body text-sm">
            {lang === 'de' ? 'Häufig gestellte Fragen' : lang === 'en' ? 'Frequently Asked Questions' : 'Domande frequenti'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-body tracking-wider uppercase border transition-all ${activecat === cat ? 'border-gold bg-gold/10 text-gold' : 'border-[#C9A96E]/15 text-ivory/40 hover:border-[#C9A96E]/30'}`}>
              {cat === 'all' ? allLabel[lang] || allLabel.de : labels[cat]}
            </button>
          ))}
        </div>

        <div className="space-y-2 mb-12">
          {filtered.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>

        {/* Still have questions */}
        <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-light text-ivory mb-3">
            {lang === 'de' ? 'Noch eine Frage?' : lang === 'en' ? 'Still have a question?' : 'Hai ancora domande?'}
          </h2>
          <p className="text-ivory/40 text-sm font-body mb-6">
            {lang === 'de' ? 'Wir helfen gerne persönlich weiter.' : lang === 'en' ? 'We are happy to help personally.' : 'Siamo felici di aiutarti personalmente.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="flex items-center justify-center gap-2 px-6 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Kontakt aufnehmen' : lang === 'en' ? 'Get in Touch' : 'Contattaci'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/reserve" className="flex items-center justify-center gap-2 px-6 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}