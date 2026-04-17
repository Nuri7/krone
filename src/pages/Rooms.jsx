import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS, ROOMS } from '@/lib/siteData';
import { Star, Coffee, ChevronRight, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const BEDS24_BASE = SITE_DEFAULTS.beds24_booking_url;

export default function Rooms() {
  const { tr, lang } = useLang();
  const [showBooking, setShowBooking] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const returnState = params.get('return');
  const intentRef = params.get('ref');

  // Build the Beds24 embed URL with language
  const beds24EmbedUrl = `${BEDS24_BASE}&lang=${lang}&iframe=1`;

  const c = {
    de: {
      title: 'Zimmer & Suiten',
      subtitle: 'Komfortabel übernachten in Langenburg',
      book_direct: 'Direktbucher-Preise garantiert',
      no_commission: 'Keine Buchungsgebühren',
      breakfast: 'Frühstück optional (€14 p.P.)',
      book_now: 'Jetzt buchen',
      book_close: 'Schließen',
      group_title: 'Hochzeiten & Gruppen',
      group_text: 'Für Hochzeiten und Gruppen erstellen wir gerne ein individuelles Angebot.',
      returning_confirmed: 'Ihre Buchung wurde bestätigt!',
      returning_pending: 'Ihre Buchung wird bearbeitet. Bei Fragen kontaktieren Sie uns bitte.',
      open_beds: 'Verfügbarkeit & Preise prüfen',
    },
    en: {
      title: 'Rooms & Suites',
      subtitle: 'Comfortable stays in Langenburg',
      book_direct: 'Best Direct Booking Rates',
      no_commission: 'No booking fees',
      breakfast: 'Breakfast available (€14 p.p.)',
      book_now: 'Book Now',
      book_close: 'Close',
      group_title: 'Weddings & Groups',
      group_text: 'For weddings and groups we are happy to create an individual offer.',
      returning_confirmed: 'Your booking has been confirmed!',
      returning_pending: 'Your booking is being processed. Please contact us if you have any questions.',
      open_beds: 'Check Availability & Prices',
    },
    it: {
      title: 'Camere & Suite',
      subtitle: 'Soggiorni confortevoli a Langenburg',
      book_direct: 'Prezzi diretti garantiti',
      no_commission: 'Nessuna commissione',
      breakfast: 'Colazione disponibile (€14 a persona)',
      book_now: 'Prenota ora',
      book_close: 'Chiudi',
      group_title: 'Matrimoni & Gruppi',
      group_text: "Per matrimoni e gruppi creiamo volentieri un'offerta individuale.",
      returning_confirmed: 'La tua prenotazione è confermata!',
      returning_pending: 'La tua prenotazione è in elaborazione. Contattateci per qualsiasi domanda.',
      open_beds: 'Verifica disponibilità e prezzi',
    },
  };
  const t = c[lang] || c.de;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-24">

      {/* Return banners */}
      {returnState === 'confirmed' && (
        <div className="max-w-5xl mx-auto px-5 pt-6">
          <div className="border border-gold/20 bg-gold/10 rounded-2xl p-4 flex gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ivory text-sm">{t.returning_confirmed}</p>
              {intentRef && <p className="text-xs text-gold/60 mt-0.5 font-body">Ref: {intentRef}</p>}
            </div>
          </div>
        </div>
      )}
      {returnState === 'pending' && (
        <div className="max-w-5xl mx-auto px-5 pt-6">
          <div className="border border-[#C9A96E]/15 bg-[#C9A96E]/05 rounded-2xl p-4 flex gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-gold/60 flex-shrink-0 mt-0.5" />
            <p className="text-ivory/60 text-sm font-body">{t.returning_pending}</p>
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

        {/* Direct booking trust strip */}
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

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ROOMS.map(r => (
            <div key={r.id} className="glass-card rounded-2xl overflow-hidden border border-[#C9A96E]/10 hover-lift transition-all group">
              <div className="relative h-52 overflow-hidden">
                <img src={r.image} alt={r.key_de} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-light text-ivory mb-2">
                  {lang === 'de' ? r.key_de : lang === 'en' ? r.key_en : r.key_it}
                </h3>
                <p className="text-ivory/45 text-sm font-body leading-relaxed mb-4">
                  {lang === 'de' ? r.description_de : lang === 'en' ? r.description_en : r.description_it}
                </p>
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full py-2.5 border border-[#C9A96E]/20 text-gold/70 hover:border-gold/40 hover:text-gold text-xs font-body tracking-widest uppercase rounded-xl transition-colors"
                >
                  {t.book_now} <ChevronRight className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Big Book Now CTA */}
        <div className="glass-card border border-[#C9A96E]/15 rounded-3xl p-8 text-center mb-10">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-3">Beds24 · Online Buchung</p>
          <h2 className="font-display text-3xl font-light text-ivory mb-3">{t.open_beds}</h2>
          <p className="text-ivory/40 font-body text-sm mb-7">
            {lang === 'de' ? 'Direkt online buchen — sicher, schnell und ohne Aufpreis.' : lang === 'en' ? 'Book directly online — secure, fast and without surcharges.' : 'Prenota direttamente online — sicuro, veloce e senza sovrapprezzi.'}
          </p>
          <button
            onClick={() => setShowBooking(true)}
            className="inline-flex items-center gap-2.5 px-10 py-4 btn-gold rounded-full text-sm font-body font-semibold tracking-wider shadow-gold-glow"
          >
            {t.book_now} <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Wedding / Group CTA */}
        <div className="bg-espresso border border-[#C9A96E]/10 rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl font-light text-ivory mb-2">💍 {t.group_title}</h3>
          <p className="text-ivory/40 text-sm font-body mb-5">{t.group_text}</p>
          <Link to="/weddings" className="inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
            {tr('nav', 'contact')} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Beds24 Booking Modal / Overlay ── */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex flex-col bg-charcoal">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-espresso border-b border-[#C9A96E]/15 flex-shrink-0">
            <div>
              <p className="font-display text-base font-light text-ivory">Krone Langenburg</p>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-body">Online Buchung · Beds24</p>
            </div>
            <button
              onClick={() => setShowBooking(false)}
              className="px-5 py-2 border border-[#C9A96E]/20 text-ivory/60 hover:text-ivory hover:border-[#C9A96E]/50 text-xs font-body tracking-widest uppercase rounded-full transition-colors"
            >
              ✕ {t.book_close}
            </button>
          </div>

          {/* Beds24 iframe */}
          <iframe
            src={beds24EmbedUrl}
            title="Beds24 Booking"
            className="flex-1 w-full border-0 bg-white"
            allow="payment"
          />
        </div>
      )}
    </div>
  );
}