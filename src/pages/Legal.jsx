import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function Legal() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-light text-stone-800 mb-8">
          {lang === 'de' ? 'Impressum & Datenschutz' : lang === 'en' ? 'Legal & Privacy' : 'Note legali & Privacy'}
        </h1>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Impressum</h2>
          <div className="text-stone-600 text-sm leading-relaxed space-y-2">
            <p><strong>{s.hotel_name}</strong></p>
            <p>{s.address_street}<br />{s.address_zip} {s.address_city}<br />{s.address_country}</p>
            <p>Tel: <a href={`tel:${s.phone}`} className="text-amber-600">{s.phone}</a></p>
            <p>E-Mail: <a href={`mailto:${s.email_info}`} className="text-amber-600">{s.email_info}</a></p>
            <p className="mt-4 text-stone-500 text-xs">
              Verantwortlich für den Inhalt: Omar Ouardaoui (Inhaber)<br />
              {s.address_street}, {s.address_zip} {s.address_city}
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">
            {lang === 'de' ? 'Datenschutzerklärung' : lang === 'en' ? 'Privacy Policy' : 'Informativa sulla Privacy'}
          </h2>
          <div className="text-stone-600 text-sm leading-relaxed space-y-4">
            <p>
              {lang === 'de' && 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden von uns nur auf Grundlage der gesetzlichen Bestimmungen verarbeitet. Im Folgenden informieren wir Sie über Art, Umfang und Zweck der Erhebung und Verwendung personenbezogener Daten auf unserer Website.'}
              {lang === 'en' && 'We take the protection of your personal data very seriously. Personal data is processed by us only on the basis of legal provisions. Below we inform you about the type, scope and purpose of the collection and use of personal data on our website.'}
              {lang === 'it' && 'Prendiamo molto sul serio la protezione dei vostri dati personali. I dati personali vengono da noi trattati solo sulla base delle disposizioni legali.'}
            </p>
            <p>
              {lang === 'de' && 'Daten, die Sie uns über Kontaktformulare, Reservierungsanfragen oder ähnliche Wege übermitteln, werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.'}
              {lang === 'en' && 'Data submitted to us via contact forms, reservation requests or similar means is used exclusively to process your enquiry and is not passed on to third parties.'}
              {lang === 'it' && 'I dati trasmessi tramite moduli di contatto o richieste di prenotazione vengono utilizzati esclusivamente per elaborare la vostra richiesta e non vengono trasmessi a terzi.'}
            </p>
            <p className="text-stone-400 text-xs">
              {lang === 'de' && 'Bei Fragen zum Datenschutz wenden Sie sich bitte an: ' + s.email_info}
              {lang === 'en' && 'For data protection enquiries please contact: ' + s.email_info}
              {lang === 'it' && 'Per domande sulla privacy contattare: ' + s.email_info}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">
            {lang === 'de' ? 'Reservierungsrichtlinie' : lang === 'en' ? 'Reservation Policy' : 'Politica di prenotazione'}
          </h2>
          <div className="text-stone-600 text-sm leading-relaxed">
            <p>
              {lang === 'de' && 'Reservierungen gelten ab Bestätigung als verbindlich. Bei Nichterscheinen ohne Stornierung behalten wir uns vor, zukünftige Reservierungen einzuschränken. Für Gruppen ab 10 Personen bitten wir um direkte Kontaktaufnahme.'}
              {lang === 'en' && 'Reservations are binding from confirmation. In case of no-show without cancellation we reserve the right to restrict future bookings. For groups of 10 or more please contact us directly.'}
              {lang === 'it' && 'Le prenotazioni sono vincolanti dalla conferma. In caso di mancata presentazione senza cancellazione, ci riserviamo il diritto di limitare le prenotazioni future. Per gruppi di 10 o più persone contattarci direttamente.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}