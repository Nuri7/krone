import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function Footer() {
  const { tr, lang } = useLang();
  const s = SITE_DEFAULTS;

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <p className="text-white font-semibold tracking-widest text-sm uppercase mb-1">
            Krone Langenburg
          </p>
          <p className="text-amber-500 text-xs tracking-widest uppercase mb-4">by Ammesso</p>
          <p className="text-stone-400 text-sm leading-relaxed">
            {lang === 'de' && 'Mediterrane Küche mit Herz. Stilvolle Unterkunft im Herzen Hohenlohes.'}
            {lang === 'en' && 'Mediterranean cuisine with heart. Stylish accommodation in the heart of Hohenlohe.'}
            {lang === 'it' && 'Cucina mediterranea con cuore. Alloggio raffinato nel cuore dell\'Hohenlohe.'}
          </p>
          <div className="flex gap-3 mt-5">
            <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
            {tr('contact', 'address_title')}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>{s.address_street}, {s.address_zip} {s.address_city}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <a href={`tel:${s.phone}`} className="hover:text-white transition-colors">{s.phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <a href={`mailto:${s.email_info}`} className="hover:text-white transition-colors">{s.email_info}</a>
            </li>
          </ul>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
            target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            {tr('contact', 'directions')} →
          </a>
        </div>

        {/* Opening hours */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
            {tr('home', 'hours_title')}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>{tr('home', 'monday')}</span>
              <span className="text-stone-500">{tr('home', 'closed')}</span>
            </li>
            <li>
              <span className="text-stone-400">{tr('home', 'tue_sat')}</span>
              <div className="text-stone-500 text-xs mt-0.5">
                {tr('home', 'lunch')}: 12:00–14:30<br />
                {tr('home', 'dinner')}: 17:30–22:00
              </div>
            </li>
            <li>
              <span className="text-stone-400">{tr('home', 'sunday')}</span>
              <div className="text-stone-500 text-xs mt-0.5">12:00–20:00</div>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
            Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/menu', label: tr('nav', 'menu') },
              { to: '/rooms', label: tr('nav', 'rooms') },
              { to: '/reserve', label: tr('nav', 'reserve') },
              { to: '/story', label: tr('nav', 'story') },
              { to: '/contact', label: tr('nav', 'contact') },
              { to: '/legal', label: tr('footer', 'legal') },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Krone Langenburg by Ammesso. {tr('footer', 'rights')}.</span>
          <Link to="/legal" className="hover:text-stone-300 transition-colors">{tr('footer', 'legal')}</Link>
        </div>
      </div>
    </footer>
  );
}