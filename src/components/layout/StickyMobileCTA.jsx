import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, BedDouble } from 'lucide-react';

export default function StickyMobileCTA() {
  const location = useLocation();
  
  // Hide on pages that have their own CTAs or admin pages
  const hidden = ['/reserve', '/rooms', '/booking-return', '/admin', '/dashboard', '/activity-log'].some(
    p => location.pathname.startsWith(p)
  );
  const isAccount = location.pathname.startsWith('/account');

  if (hidden || isAccount) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal/95 backdrop-blur-xl border-t border-[#C9A96E]/15 px-4 py-3 safe-area-bottom">
      <div className="flex gap-2">
        <Link to="/reserve"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 btn-gold rounded-xl text-[10px] tracking-[0.12em] uppercase font-body font-semibold">
          <UtensilsCrossed className="w-3 h-3" /> Reserve Table
        </Link>
        <Link to="/rooms"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 btn-ghost-gold rounded-xl text-[10px] tracking-[0.12em] uppercase font-body font-semibold">
          <BedDouble className="w-3 h-3" /> Book Room
        </Link>
      </div>
    </div>
  );
}
