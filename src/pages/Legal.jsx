import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function Legal() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-24 pb-24 lg:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-5">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory mb-8 sm:mb-10 mt-6 sm:mt-0">
          {lang === 'de' ? 'Impressum & Datenschutz' : lang === 'en' ? 'Legal & Privacy' : 'Note legali & Privacy'}
        </h1>

        <section className="mb-10">
          <h2 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-5">Impressum</h2>
          <div className="glass-card rounded-2xl p-7 border border-[#C9A96E]/10 text-ivory/60 text-sm font-body leading-relaxed space-y-2">
            <p><strong className="text-ivory/80">{s.hotel_name}</strong></p>
            <p>{s.address_street}<br />{s.address_zip} {s.address_city}<br />{s.address_country}</p>
            <p>Tel: <a href={`tel:${s.phone}`} className="text-gold/70 hover:text-gold transition-colors">{s.phone}</a></p>
            <p>E-Mail: <a href={`mailto:${s.email_info}`} className="text-gold/70 hover:text-gold transition-colors">{s.email_info}</a></p>
            <p className="mt-4 text-ivory/35 text-xs">Verantwortlich: Omar Ouardaoui (Inhaber)<br />{s.address_street}, {s.address_zip} {s.address_city}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-5">
            {lang === 'de' ? 'Datenschutzerklärung' : lang === 'en' ? 'Privacy Policy' : 'Informativa sulla Privacy'}
          </h2>
          <div className="glass-card rounded-2xl p-7 border border-[#C9A96E]/10 text-ivory/60 text-sm font-body leading-relaxed space-y-4">
            <p>
              {lang === 'de' && 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden nur auf Grundlage der gesetzlichen Bestimmungen verarbeitet.'}
              {lang === 'en' && 'We take the protection of your personal data very seriously. Personal data is processed only on the basis of legal provisions.'}
              {lang === 'it' && 'Prendiamo molto sul serio la protezione dei vostri dati personali. I dati vengono trattati solo sulla base delle disposizioni legali.'}
            </p>
            <p>
              {lang === 'de' && 'Daten, die Sie uns über Formulare übermitteln, werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.'}
              {lang === 'en' && 'Data submitted via forms is used exclusively to process your request and not passed to third parties.'}
              {lang === 'it' && 'I dati trasmessi tramite moduli vengono utilizzati esclusivamente per elaborare la richiesta e non trasmessi a terzi.'}
            </p>
            <p className="text-ivory/35 text-xs">
              {lang === 'de' ? `Datenschutzanfragen: ${s.email_info}` : lang === 'en' ? `Privacy enquiries: ${s.email_info}` : `Privacy: ${s.email_info}`}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-5">
            {lang === 'de' ? 'Reservierungsrichtlinie' : lang === 'en' ? 'Reservation Policy' : 'Politica di prenotazione'}
          </h2>
          <div className="glass-card rounded-2xl p-7 border border-[#C9A96E]/10 text-ivory/60 text-sm font-body leading-relaxed">
            <p>
              {lang === 'de' && 'Reservierungen gelten ab Bestätigung als verbindlich. Bei Nichterscheinen ohne Stornierung behalten wir uns vor, zukünftige Reservierungen einzuschränken. Für Gruppen ab 10 Personen bitten wir um direkte Kontaktaufnahme.'}
              {lang === 'en' && 'Reservations are binding from confirmation. In case of no-show without cancellation we reserve the right to restrict future bookings. For groups of 10+ please contact us directly.'}
              {lang === 'it' && 'Le prenotazioni sono vincolanti dalla conferma. In caso di mancata presentazione senza cancellazione, ci riserviamo il diritto di limitare le prenotazioni future.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}