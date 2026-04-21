import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { ArrowLeft, Calendar, Clock, Users, XCircle, AlertTriangle } from 'lucide-react';
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

const NON_CANCELLABLE = ['cancelled_by_guest', 'cancelled_by_staff', 'no_show', 'archived', 'completed'];

export default function GuestReservations() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState({});
  const [cancelSuccess, setCancelSuccess] = useState({});
  const [confirmCancel, setConfirmCancel] = useState(null); // reservation id to confirm

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

  async function handleCancel(reservationId) {
    setCancellingId(reservationId);
    setCancelError(prev => ({ ...prev, [reservationId]: null }));
    const res = await base44.functions.invoke('cancelReservation', { reservation_id: reservationId });
    if (res.data?.success) {
      setCancelSuccess(prev => ({ ...prev, [reservationId]: true }));
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled_by_guest' } : r));
    } else {
      const err = res.data?.error;
      let msg;
      if (err === 'too_late') {
        msg = lang === 'de' ? 'Stornierung nicht mehr möglich (< 24h vor der Reservierung). Bitte rufen Sie uns an.' : lang === 'en' ? 'Cannot cancel less than 24h before the reservation. Please call us.' : 'Impossibile annullare meno di 24h prima. Chiamateci.';
      } else if (err === 'already_cancelled') {
        msg = lang === 'de' ? 'Diese Reservierung wurde bereits storniert.' : lang === 'en' ? 'This reservation is already cancelled.' : 'Questa prenotazione è già annullata.';
      } else {
        msg = lang === 'de' ? 'Fehler beim Stornieren. Bitte kontaktieren Sie uns direkt.' : lang === 'en' ? 'Could not cancel. Please contact us directly.' : 'Impossibile annullare. Contattateci.';
      }
      setCancelError(prev => ({ ...prev, [reservationId]: msg }));
    }
    setCancellingId(null);
    setConfirmCancel(null);
  }

  const C = {
    de: {
      title: 'Meine Reservierungen',
      back: 'Zurück zum Konto',
      empty: 'Noch keine Reservierungen.',
      empty_cta: 'Jetzt Tisch reservieren',
      cancel_btn: 'Stornieren',
      cancel_confirm: 'Reservierung wirklich stornieren?',
      cancel_yes: 'Ja, stornieren',
      cancel_no: 'Abbrechen',
      cancel_policy: 'Stornierung kostenlos bis 24h vor dem Termin.',
    },
    en: {
      title: 'My Reservations',
      back: 'Back to Account',
      empty: 'No reservations yet.',
      empty_cta: 'Make a reservation',
      cancel_btn: 'Cancel',
      cancel_confirm: 'Really cancel this reservation?',
      cancel_yes: 'Yes, cancel',
      cancel_no: 'Keep it',
      cancel_policy: 'Free cancellation up to 24h before.',
    },
    it: {
      title: 'Le mie prenotazioni',
      back: 'Torna al profilo',
      empty: 'Nessuna prenotazione.',
      empty_cta: 'Prenota un tavolo',
      cancel_btn: 'Annulla',
      cancel_confirm: 'Annullare questa prenotazione?',
      cancel_yes: 'Sì, annulla',
      cancel_no: 'Torna indietro',
      cancel_policy: 'Annullamento gratuito fino a 24h prima.',
    },
  };
  const c = C[lang] || C.de;
  const statusMap = STATUS_MAP[lang] || STATUS_MAP.de;

  const canCancel = (r) => {
    if (NON_CANCELLABLE.includes(r.status)) return false;
    const resDateTime = new Date(`${r.reservation_date}T${r.reservation_time}:00`);
    return (resDateTime - new Date()) / (1000 * 60 * 60) >= 24;
  };

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
                <div className="flex items-start justify-between gap-3 mb-3">
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
                        {format(new Date(r.reservation_date), 'dd.MM.yyyy')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold/40" />
                        {r.reservation_time} Uhr
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold/40" />
                        {r.party_size} {lang === 'de' ? 'Gäste' : lang === 'en' ? 'guests' : 'ospiti'}
                      </span>
                    </div>
                    {r.notes && (
                      <p className="text-ivory/35 text-xs font-body mt-2">
                        <span className="text-ivory/40 font-medium">{lang === 'de' ? 'Sonderwünsche:' : lang === 'en' ? 'Requests:' : 'Richieste:'}</span> {r.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cancel success */}
                {cancelSuccess[r.id] && (
                  <p className="text-emerald-400 text-xs font-body mt-2">
                    ✓ {lang === 'de' ? 'Storniert. Sie erhalten eine Bestätigung per E-Mail.' : lang === 'en' ? 'Cancelled. You will receive a confirmation email.' : 'Annullato. Riceverete una conferma via email.'}
                  </p>
                )}

                {/* Cancel error */}
                {cancelError[r.id] && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-red-400 font-body">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{cancelError[r.id]}</span>
                  </div>
                )}

                {/* Confirm cancel dialog */}
                {confirmCancel === r.id && (
                  <div className="mt-3 border border-red-900/30 bg-red-950/20 rounded-xl p-4">
                    <p className="text-ivory/70 text-sm font-body mb-1">{c.cancel_confirm}</p>
                    <p className="text-ivory/30 text-xs font-body mb-3">{c.cancel_policy}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="flex-1 py-2 bg-red-950/60 border border-red-900/40 text-red-400 text-xs font-body rounded-lg hover:bg-red-950/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {cancellingId === r.id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          : <><XCircle className="w-3.5 h-3.5" /> {c.cancel_yes}</>
                        }
                      </button>
                      <button
                        onClick={() => setConfirmCancel(null)}
                        className="flex-1 py-2 glass-card border border-[#C9A96E]/15 text-ivory/40 text-xs font-body rounded-lg hover:text-ivory transition-colors"
                      >
                        {c.cancel_no}
                      </button>
                    </div>
                  </div>
                )}

                {/* Cancel button */}
                {canCancel(r) && confirmCancel !== r.id && !cancelSuccess[r.id] && (
                  <button
                    onClick={() => { setConfirmCancel(r.id); setCancelError(prev => ({ ...prev, [r.id]: null })); }}
                    className="mt-3 flex items-center gap-1.5 text-red-400/50 hover:text-red-400 text-[10px] font-body uppercase tracking-widest transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {c.cancel_btn}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}