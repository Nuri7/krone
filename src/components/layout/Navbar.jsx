import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLang } from '@/lib/useLang';

const FLAG = { de: '🇩🇪', en: '🇬🇧', it: '🇮🇹' };

export default function Navbar() {
  const { lang, setLang, tr, supported } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: tr('nav', 'home') },
    { to: '/restaurant', label: tr('nav', 'restaurant') },
    { to: '/menu', label: tr('nav', 'menu') },
    { to: '/rooms', label: tr('nav', 'rooms') },
    { to: '/story', label: tr('nav', 'story') },
    { to: '/contact', label: tr('nav', 'contact') },
  ];

  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
    : 'bg-transparent';
  const textColor = scrolled || !isHome ? 'text-stone-800' : 'text-white';
  const logoColor = scrolled || !isHome ? 'text-stone-900' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className={`font-semibold tracking-widest text-sm uppercase transition-colors ${logoColor}`}>
            <span className="hidden sm:inline">Krone Langenburg</span>
            <span className="sm:hidden">Ammesso</span>
            <span className={`text-xs ml-1 font-light tracking-wider transition-colors ${scrolled || !isHome ? 'text-amber-600' : 'text-amber-300'}`}>by Ammesso</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  location.pathname === l.to
                    ? (scrolled || !isHome ? 'text-amber-600' : 'text-amber-300')
                    : textColor
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(p => !p)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-amber-600 ${textColor}`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-stone-100 py-1 min-w-[100px]">
                  {supported.map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 flex items-center gap-2 ${lang === l ? 'text-amber-600 font-semibold' : 'text-stone-700'}`}
                    >
                      <span>{FLAG[l]}</span> <span className="uppercase">{l}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              to="/reserve"
              className="hidden md:inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {tr('nav', 'reserve')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(p => !p)}
              className={`md:hidden p-2 transition-colors ${textColor}`}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-stone-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors hover:bg-amber-50 hover:text-amber-700 ${
                  location.pathname === l.to ? 'text-amber-600 bg-amber-50' : 'text-stone-700'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-stone-100">
              <Link
                to="/reserve"
                className="block w-full text-center px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                {tr('nav', 'reserve')}
              </Link>
              <Link
                to="/rooms"
                className="block w-full text-center px-4 py-3 mt-2 border-2 border-amber-600 text-amber-700 font-semibold rounded-lg transition-colors hover:bg-amber-50"
              >
                {tr('nav', 'book')}
              </Link>
            </div>
            <div className="flex gap-3 pt-2 px-3">
              {supported.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg ${lang === l ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:bg-stone-50'}`}
                >
                  {FLAG[l]} <span className="uppercase">{l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}