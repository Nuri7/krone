import { Link, useLocation } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function StickyMobileCTA() {
  const { tr } = useLang();
  const location = useLocation();

  // Hide on reservation and rooms pages to avoid doubling CTAs
  const hide = ['/reserve', '/rooms'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-stone-200 safe-area-inset-bottom">
      <div className="grid grid-cols-2 gap-0">
        <Link
          to="/reserve"
          className="flex items-center justify-center py-4 bg-amber-600 text-white font-semibold text-sm active:bg-amber-700 transition-colors"
        >
          {tr('nav', 'reserve')}
        </Link>
        <a
          href={`https://wa.me/${SITE_DEFAULTS.whatsapp_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center py-4 bg-green-600 text-white font-semibold text-sm active:bg-green-700 transition-colors gap-2"
        >
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}