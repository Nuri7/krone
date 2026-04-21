import { Link, useNavigate } from 'react-router-dom';
import { User, FileText, MessageSquare, CalendarDays, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { FadeUp } from '@/components/shared/Animations';

const ACCOUNT_LINKS = [
  { path: '/account/profile', icon: User, title: 'My Profile', desc: 'Manage your personal information' },
  { path: '/account/reservations', icon: CalendarDays, title: 'Reservations', desc: 'View your bookings and history' },
  { path: '/account/messages', icon: MessageSquare, title: 'Messages', desc: 'Chat with the hotel team' },
  { path: '/account/documents', icon: FileText, title: 'Documents', desc: 'Invoices, confirmations and uploads' },
];

export default function GuestAccount() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <span className="text-gold font-display text-2xl">{user.email?.[0]?.toUpperCase()}</span>
            </div>
            <h1 className="font-display text-4xl text-ivory mb-1">Welcome</h1>
            <p className="text-ivory/40 font-body text-sm">{user.email}</p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACCOUNT_LINKS.map((link, i) => (
            <FadeUp key={link.path} delay={i * 60}>
              <Link to={link.path} className="glass-card rounded-2xl p-6 hover-lift group block">
                <link.icon className="w-5 h-5 text-gold mb-3" />
                <h3 className="font-display text-xl text-ivory group-hover:text-gold transition-colors">{link.title}</h3>
                <p className="text-ivory/30 text-sm font-body mt-1">{link.desc}</p>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={300}>
          <div className="text-center mt-8">
            <button onClick={signOut}
              className="inline-flex items-center gap-2 text-ivory/30 text-sm font-body hover:text-ivory/50 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
