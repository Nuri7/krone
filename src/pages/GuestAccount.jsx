import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { User, FileText, MessageSquare, UtensilsCrossed, BedDouble, LogOut, ChevronRight, Settings, LayoutDashboard, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const STATUS_MAP = {
  de: { confirmed: 'Bestätigt', pending: 'Ausstehend', cancelled: 'Abgesagt', completed: 'Abgeschlossen', no_show: 'Nicht erschienen' },
  en: { confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled', completed: 'Completed', no_show: 'No Show' },
  it: { confirmed: 'Confermato', pending: 'In attesa', cancelled: 'Annullato', completed: 'Completato', no_show: 'Non presentato' },
};
const STATUS_COLORS = {
  confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  pending: 'text-gold bg-gold/10 border-gold/25',
  cancelled: 'text-red-400 bg-red-950/30 border-red-800/20',
  completed: 'text-ivory/30 bg-ivory/5 border-ivory/10',
  no_show: 'text-red-400/60 bg-red-950/20 border-red-900/15',
};

export default function GuestAccount() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (auth) => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      const [res, docs, msgs] = await Promise.all([
        base44.entities.Reservation.filter({ guest_email: u.email }, '-reservation_date', 20).catch(() => []),
        base44.entities.GuestDocument.filter({ user_email: u.email }, '-created_date', 10).catch(() => []),
        base44.entities.GuestMessage.filter({ user_email: u.email }, '-created_date', 10).catch(() => []),
      ]);
      setReservations(res);
      setDocuments(docs);
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const C = {
    de: {
      welcome: 'Willkommen zurück',
      subtitle: 'Ihr persönlicher Bereich bei Krone Langenburg',
      logout: 'Abmelden',
      admin_label: 'Admin Dashboard öffnen',
      sections: {
        profile: { label: 'Profil & Einstellungen', desc: 'Name, Adresse, Ernährungshinweise' },
        messages: { label: 'Nachrichten & Anfragen', desc: 'Mitteilungen an das Team' },
        documents: { label: 'Dokumente', desc: 'Sicher hochladen & verwalten' },
      },
      quick_reserve: 'Tisch reservieren',
      quick_rooms: 'Zimmer buchen',
      res_title: 'Ihre Reservierungen',
      res_empty: 'Noch keine Tischreservierungen vorhanden.',
      res_empty_cta: 'Jetzt Ihren nächsten Tisch reservieren',
      guests_label: 'Personen',
      new_badge: 'Neu',
    },
    en: {
      welcome: 'Welcome back',
      subtitle: 'Your personal area at Krone Langenburg',
      logout: 'Sign Out',
      admin_label: 'Open Admin Dashboard',
      sections: {
        profile: { label: 'Profile & Settings', desc: 'Name, address, dietary notes' },
        messages: { label: 'Messages & Requests', desc: 'Communications with the team' },
        documents: { label: 'Documents', desc: 'Securely upload & manage' },
      },
      quick_reserve: 'Reserve a Table',
      quick_rooms: 'Book a Room',
      res_title: 'Your Reservations',
      res_empty: 'No table reservations yet.',
      res_empty_cta: 'Reserve your next table',
      guests_label: 'Guests',
      new_badge: 'New',
    },
    it: {
      welcome: 'Bentornato',
      subtitle: 'La tua area personale presso Krone Langenburg',
      logout: 'Esci',
      admin_label: 'Apri Admin Dashboard',
      sections: {
        profile: { label: 'Profilo e impostazioni', desc: 'Nome, indirizzo, note alimentari' },
        messages: { label: 'Messaggi e richieste', desc: 'Comunicazioni con il team' },
        documents: { label: 'Documenti', desc: 'Carica e gestisci in sicurezza' },
      },
      quick_reserve: 'Prenota un tavolo',
      quick_rooms: 'Prenota una camera',
      res_title: 'Le tue prenotazioni',
      res_empty: 'Nessuna prenotazione ancora.',
      res_empty_cta: 'Prenota il tuo prossimo tavolo',
      guests_label: 'Ospiti',
      new_badge: 'Nuovo',
    },
  };
  const c = C[lang] || C.de;
  const statusMap = STATUS_MAP[lang] || STATUS_MAP.de;

  if (loading) return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ivory/30 text-sm font-body">…</p>
      </div>
    </div>
  );

  const isAdmin = user && (ADMIN_EMAILS.includes(user.email) || user.role === 'admin');
  const newMessages = messages.filter(m => m.status === 'new').length;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-28 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="py-7 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-1 sm:mb-2">{c.welcome}</p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-ivory leading-tight">
                {user?.full_name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-ivory/30 text-xs font-body mt-1 truncate max-w-[200px] sm:max-w-none">{user?.email}</p>
            </div>
            <button
              onClick={() => base44.auth.logout('/')}
              className="flex items-center gap-1.5 text-ivory/25 hover:text-ivory/60 text-xs font-body transition-colors mt-1 flex-shrink-0 py-2 px-3 rounded-lg border border-transparent hover:border-ivory/10">
              <LogOut className="w-3.5 h-3.5" /> {c.logout}
            </button>
          </div>
          <p className="text-ivory/35 text-xs sm:text-sm font-body mt-2 sm:mt-3">{c.subtitle}</p>
        </div>

        {/* Admin shortcut */}
        {isAdmin && (
          <Link to="/admin"
            className="block mb-5 border border-gold/20 bg-gold/6 rounded-2xl p-4 flex items-center justify-between hover:bg-gold/10 transition-colors group">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-gold/70" />
              <span className="text-gold text-sm font-body font-medium">{c.admin_label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gold/40 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
          <Link to="/reserve"
            className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 flex items-center gap-3 hover:border-[#C9A96E]/25 transition-all group">
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-gold/70 group-hover:text-gold transition-colors" />
            </div>
            <span className="text-ivory/60 text-sm font-body group-hover:text-ivory/80 transition-colors">{c.quick_reserve}</span>
          </Link>
          <Link to="/rooms"
            className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 flex items-center gap-3 hover:border-[#C9A96E]/25 transition-all group">
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <BedDouble className="w-4 h-4 text-gold/70 group-hover:text-gold transition-colors" />
            </div>
            <span className="text-ivory/60 text-sm font-body group-hover:text-ivory/80 transition-colors">{c.quick_rooms}</span>
          </Link>
        </div>

        {/* Account sections */}
        <div className="space-y-2 mb-6 sm:mb-8">
          {[
            { to: '/account/profile', icon: Settings, ...c.sections.profile },
            { to: '/account/messages', icon: MessageSquare, ...c.sections.messages, badge: newMessages > 0 ? newMessages : null },
            { to: '/account/documents', icon: FileText, ...c.sections.documents, badge: documents.length > 0 ? documents.length : null },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="glass-card border border-[#C9A96E]/08 rounded-2xl p-4 flex items-center justify-between hover:border-[#C9A96E]/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1A1410] border border-[#C9A96E]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-gold/50 group-hover:text-gold/70 transition-colors" />
                </div>
                <div>
                  <p className="text-ivory/75 text-sm font-body font-medium">{item.label}</p>
                  <p className="text-ivory/30 text-xs font-body mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-gold/20 text-gold text-[10px] rounded-full font-body font-medium">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-ivory/15 group-hover:text-ivory/30 transition-colors group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Documents Widget */}
        {documents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-ivory/30 text-[10px] tracking-[0.35em] uppercase font-body mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> {lang === 'de' ? 'Meine Dokumente' : lang === 'en' ? 'My Documents' : 'I miei documenti'}
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {documents.slice(0, 5).map(d => (
                <div key={d.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="text-ivory/70 truncate">{d.original_filename}</p>
                    <p className="text-ivory/30 text-[10px] mt-0.5">{d.created_date ? format(new Date(d.created_date), 'dd.MM.yy HH:mm') : ''}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-body whitespace-nowrap flex-shrink-0 border ${
                    d.status === 'approved' ? 'text-emerald-400 bg-emerald-950/30 border-emerald-700/20' :
                    d.status === 'rejected' ? 'text-red-400 bg-red-950/20 border-red-800/20' :
                    d.status === 'under_review' ? 'text-gold/70 bg-gold/10 border-gold/20' :
                    'text-ivory/40 bg-ivory/5 border-ivory/10'
                  }`}>
                    {d.status === 'approved' && '✓ ' + (lang === 'de' ? 'Genehmigt' : lang === 'en' ? 'Approved' : 'Approvato')}
                    {d.status === 'rejected' && '✕ ' + (lang === 'de' ? 'Abgelehnt' : lang === 'en' ? 'Rejected' : 'Rifiutato')}
                    {d.status === 'under_review' && '⧖ ' + (lang === 'de' ? 'In Prüfung' : lang === 'en' ? 'Reviewing' : 'In revisione')}
                    {d.status === 'uploaded' && '📤 ' + (lang === 'de' ? 'Hochgeladen' : lang === 'en' ? 'Uploaded' : 'Caricato')}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/account/documents"
              className="inline-flex items-center gap-1.5 text-gold/60 hover:text-gold text-xs font-body tracking-wider transition-colors mt-3">
              {lang === 'de' ? 'Zum Dokumenten-Manager →' : lang === 'en' ? 'Go to Documents →' : 'Vai ai documenti →'}
            </Link>
          </div>
        )}

        {/* Reservations */}
        <div>
          <h2 className="text-ivory/30 text-[10px] tracking-[0.35em] uppercase font-body mb-4 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> {c.res_title}
          </h2>
          {reservations.length === 0 ? (
            <div className="glass-card border border-[#C9A96E]/08 rounded-2xl p-8 text-center">
              <p className="text-ivory/25 text-sm font-body mb-4">{c.res_empty}</p>
              <Link to="/reserve" className="inline-flex items-center gap-1.5 text-gold/60 hover:text-gold text-xs font-body tracking-wider transition-colors">
                {c.res_empty_cta} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {reservations.slice(0, 6).map(r => (
                <div key={r.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A1410] border border-[#C9A96E]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold/40" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-xs sm:text-sm text-ivory/80 font-medium truncate">
                        {r.reservation_date} · {r.reservation_time}
                      </p>
                      <p className="text-ivory/30 text-[10px] sm:text-xs font-body mt-0.5 truncate">
                        {r.party_size} {c.guests_label} · <span className="hidden sm:inline">{r.reservation_ref}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-body font-medium px-2 sm:px-2.5 py-1 rounded-full border flex-shrink-0 whitespace-nowrap ${STATUS_COLORS[r.status] || 'text-ivory/30 bg-ivory/5 border-ivory/10'}`}>
                    {statusMap[r.status] || r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}