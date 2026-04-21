import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_MAP = {
  de: { new: 'Neu', pending: 'Ausstehend', confirmed: 'Bestätigt', seated: 'Eingecheckt', completed: 'Abgeschlossen', cancelled_by_guest: 'Gast abgesagt', cancelled_by_staff: 'Storniert', no_show: 'Nicht erschienen', archived: 'Archiviert' },
  en: { new: 'New', pending: 'Pending', confirmed: 'Confirmed', seated: 'Seated', completed: 'Completed', cancelled_by_guest: 'Cancelled by guest', cancelled_by_staff: 'Cancelled', no_show: 'No show', archived: 'Archived' },
  it: { new: 'Nuovo', pending: 'In attesa', confirmed: 'Confermato', seated: 'Seduto', completed: 'Completato', cancelled_by_guest: 'Cancellato da ospite', cancelled_by_staff: 'Cancellato', no_show: 'Non presentato', archived: 'Archiviato' },
};

const STATUS_COLORS = {
  new: 'text-gold/80 bg-gold/10 border-gold/20',
  pending: 'text-gold/80 bg-gold/10 border-gold/20',
  confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  seated: 'text-blue-400 bg-blue-950/40 border-blue-800/30',
  completed: 'text-ivory/40 bg-ivory/5 border-ivory/10',
  cancelled_by_guest: 'text-red-400 bg-red-950/40 border-red-800/30',
  cancelled_by_staff: 'text-red-400 bg-red-950/40 border-red-800/30',
  no_show: 'text-red-400/60 bg-red-950/20 border-red-900/20',
  archived: 'text-ivory/20 bg-ivory/5 border-ivory/10',
};

export default function GuestReservations() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (auth) => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      const res = await base44.entities.RestaurantReservation.filter(
        { guest_email: u.email },
        '-reservation_date',
        50
      ).catch(() => []);
      setReservations(res);
      setLoading(false);
    });
  }, []);

  const C = {
    de: {
      title: 'Meine Reservierungen',
      back: 'Zurück zum Konto',
      empty: 'Noch keine Reservierungen.',
      empty_cta: 'Jetzt Tisch reservieren',
      details: 'Details anzeigen',
    },
    en: {
      title: 'My Reservations',
      back: 'Back to Account',
      empty: 'No reservations yet.',
      empty_cta: 'Make a reservation',
      details: 'View details',
    },
    it: {
      title: 'Le mie prenotazioni',
      back: 'Torna al profilo',
      empty: 'Nessuna prenotazione.',
      empty_cta: 'Prenota un tavolo',
      details: 'Visualizza dettagli',
    },
  };
  const c = C[lang] || C.de;
  const statusMap = STATUS_MAP[lang] || STATUS_MAP.de;

  if (loading) return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-28 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-2xl mx-auto">
        <Link to="/account" className="flex items-center gap-2 text-ivory/30 hover:text-ivory text-xs font-body tracking-widest uppercase mb-6 sm:mb-8 transition-colors mt-4">
          <ArrowLeft className="w-3.5 h-3.5" /> {c.back}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-6 sm:mb-8">{c.title}</h1>

        {reservations.length === 0 ? (
          <div className="glass-card border border-[#C9A96E]/08 rounded-2xl p-8 text-center">
            <p className="text-ivory/30 text-sm font-body mb-4">{c.empty}</p>
            <Link to="/reserve" className="inline-flex items-center gap-1.5 text-gold/60 hover:text-gold text-xs font-body tracking-wider transition-colors">
              {c.empty_cta} →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map(r => (
              <div key={r.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 sm:p-5 hover:border-[#C9A96E]/20 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <p className="font-body text-sm sm:text-base text-ivory font-medium">{r.reservation_ref}</p>
                      <span className={`text-[10px] font-body font-medium px-2 py-1 rounded-full border ${STATUS_COLORS[r.status] || 'text-ivory/30 bg-ivory/5 border-ivory/10'}`}>
                        {statusMap[r.status] || r.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-ivory/50 text-xs sm:text-sm font-body flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold/40" />
                        {format(new Date(r.reservation_date), 'dd.MM.yyyy', )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold/40" />
                        {r.reservation_time} Uhr
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold/40" />
                        {r.party_size} Gäste
                      </span>
                    </div>
                    {r.notes && (
                      <p className="text-ivory/35 text-xs font-body mt-2">
                        <span className="text-ivory/40 font-medium">Sonderwünsche:</span> {r.notes}
                      </p>
                    )}
                    {r.dietary_notes && (
                      <p className="text-ivory/35 text-xs font-body mt-1">
                        <span className="text-ivory/40 font-medium">Ernährung:</span> {r.dietary_notes}
                      </p>
                    )}
                  </div>
                  <a href={`mailto:info@krone-ammesso.de?subject=Anfrage zu Reservierung ${r.reservation_ref}`} className="text-gold/60 hover:text-gold text-xs font-body tracking-wider uppercase whitespace-nowrap flex-shrink-0 transition-colors">
                    {c.details} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}