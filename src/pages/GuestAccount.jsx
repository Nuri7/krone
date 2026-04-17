import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { User, FileText, MessageSquare, UtensilsCrossed, BedDouble, LogOut, ChevronRight, Settings } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

export default function GuestAccount() {
  const { lang } = useLang();
  const navigate = useNavigate();
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
        base44.entities.GuestDocument.filter({ user_email: u.email }, '-created_date', 20).catch(() => []),
        base44.entities.GuestMessage.filter({ user_email: u.email }, '-created_date', 10).catch(() => []),
      ]);
      setReservations(res);
      setDocuments(docs);
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const t = {
    de: {
      title: 'Mein Konto', welcome: 'Willkommen zurück', logout: 'Abmelden',
      reservations: 'Reservierungen', documents: 'Dokumente', messages: 'Nachrichten',
      profile: 'Profil & Einstellungen', admin: 'Admin Dashboard',
      res_empty: 'Noch keine Reservierungen', doc_empty: 'Noch keine Dokumente',
      msg_empty: 'Noch keine Nachrichten',
      res_label: 'Tisch reservieren', rooms_label: 'Zimmer buchen',
    },
    en: {
      title: 'My Account', welcome: 'Welcome back', logout: 'Sign Out',
      reservations: 'Reservations', documents: 'Documents', messages: 'Messages',
      profile: 'Profile & Settings', admin: 'Admin Dashboard',
      res_empty: 'No reservations yet', doc_empty: 'No documents yet',
      msg_empty: 'No messages yet',
      res_label: 'Reserve a Table', rooms_label: 'Book a Room',
    },
    it: {
      title: 'Il mio account', welcome: 'Bentornato', logout: 'Esci',
      reservations: 'Prenotazioni', documents: 'Documenti', messages: 'Messaggi',
      profile: 'Profilo e impostazioni', admin: 'Admin Dashboard',
      res_empty: 'Nessuna prenotazione', doc_empty: 'Nessun documento',
      msg_empty: 'Nessun messaggio',
      res_label: 'Prenota un tavolo', rooms_label: 'Prenota una camera',
    },
  };
  const c = t[lang] || t.de;

  const STATUS_COLORS = {
    confirmed: 'text-emerald-400', pending: 'text-gold', cancelled: 'text-red-400', completed: 'text-ivory/30',
  };

  if (loading) return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  const isAdmin = user && (ADMIN_EMAILS.includes(user.email) || user.role === 'admin');

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-24 px-5">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="py-10 flex items-start justify-between">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">{c.welcome}</p>
            <h1 className="font-display text-4xl font-light text-ivory">{user?.full_name || user?.email}</h1>
            <p className="text-ivory/30 text-xs font-body mt-1">{user?.email}</p>
          </div>
          <button onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-2 text-ivory/30 hover:text-ivory text-xs font-body transition-colors">
            <LogOut className="w-4 h-4" /> {c.logout}
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link to="/reserve" className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 flex items-center gap-3 hover:border-[#C9A96E]/25 transition-all group">
            <UtensilsCrossed className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
            <span className="text-ivory/70 text-sm font-body">{c.res_label}</span>
          </Link>
          <Link to="/rooms" className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 flex items-center gap-3 hover:border-[#C9A96E]/25 transition-all group">
            <BedDouble className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
            <span className="text-ivory/70 text-sm font-body">{c.rooms_label}</span>
          </Link>
        </div>

        {/* Admin shortcut */}
        {isAdmin && (
          <Link to="/admin" className="block mb-6 border border-gold/20 bg-gold/5 rounded-2xl p-4 flex items-center justify-between hover:bg-gold/10 transition-colors">
            <span className="text-gold text-sm font-body font-medium">{c.admin}</span>
            <ChevronRight className="w-4 h-4 text-gold/50" />
          </Link>
        )}

        {/* Menu items */}
        <div className="space-y-2 mb-8">
          {[
            { to: '/account/profile', icon: Settings, label: c.profile },
            { to: '/account/messages', icon: MessageSquare, label: c.messages, count: messages.filter(m => m.status === 'new').length },
            { to: '/account/documents', icon: FileText, label: c.documents, count: documents.length },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 flex items-center justify-between hover:border-[#C9A96E]/20 transition-all">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gold/50" />
                <span className="text-ivory/70 text-sm font-body">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count > 0 && <span className="px-2 py-0.5 bg-gold/20 text-gold text-[10px] rounded-full font-body">{item.count}</span>}
                <ChevronRight className="w-4 h-4 text-ivory/20" />
              </div>
            </Link>
          ))}
        </div>

        {/* Reservations */}
        <div className="mb-8">
          <h2 className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-4">{c.reservations}</h2>
          {reservations.length === 0 ? (
            <div className="glass-card border border-[#C9A96E]/08 rounded-xl p-6 text-center text-ivory/30 text-sm font-body">{c.res_empty}</div>
          ) : (
            <div className="space-y-2">
              {reservations.slice(0, 5).map(r => (
                <div key={r.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="font-body text-sm text-ivory">{r.reservation_date} · {r.reservation_time}</span>
                    <div className="text-ivory/30 text-xs font-body mt-0.5">{r.party_size} {lang === 'de' ? 'Personen' : lang === 'en' ? 'guests' : 'persone'} · {r.reservation_ref}</div>
                  </div>
                  <span className={`text-xs font-body uppercase tracking-wider ${STATUS_COLORS[r.status] || 'text-ivory/40'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}