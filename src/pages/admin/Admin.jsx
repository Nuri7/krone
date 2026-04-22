import { Link } from 'react-router-dom';
import { CalendarDays, UtensilsCrossed, CalendarPlus, BarChart3, Activity, Shield } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { FadeUp } from '@/components/shared/Animations';

const ADMIN_LINKS = [
  { path: '/admin/calendar', icon: CalendarDays, title: 'Reservation Calendar', desc: 'View and manage all bookings' },
  { path: '/admin/menu', icon: UtensilsCrossed, title: 'Menu Management', desc: 'Edit dishes, prices and categories' },
  { path: '/admin/events', icon: CalendarPlus, title: 'Events', desc: 'Create and manage events' },
  { path: '/admin/dashboard', icon: BarChart3, title: 'Dashboard', desc: 'Analytics and business overview' },
  { path: '/admin/activity-log', icon: Activity, title: 'Activity Log', desc: 'System activity and audit trail' },
];

export default function Admin() {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="bg-charcoal min-h-screen pt-32 px-5 text-center">
        <Shield className="w-10 h-10 text-gold/30 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-ivory mb-2">Admin Access Required</h1>
        <p className="text-ivory/40 font-body text-sm">Please sign in with an admin account.</p>
      </div>
    );
  }

  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-ivory mb-2">Admin Dashboard</h1>
        <p className="text-ivory/40 font-body text-sm mb-10">Manage your restaurant, rooms, and events.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_LINKS.map((link, i) => (
            <FadeUp key={link.path} delay={i * 50}>
              <Link to={link.path} className="glass-card rounded-2xl p-6 hover-lift group block h-full">
                <link.icon className="w-6 h-6 text-gold mb-3" />
                <h3 className="font-display text-xl text-ivory group-hover:text-gold transition-colors">{link.title}</h3>
                <p className="text-ivory/30 text-sm font-body mt-1">{link.desc}</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
