import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UtensilsCrossed, BedDouble, Phone } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/siteData';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal/95 backdrop-blur-xl border-b border-[#C9A96E]/10 shadow-lg'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex flex-col items-start group">
              <span className="font-display text-xl md:text-2xl font-light text-ivory tracking-tight group-hover:text-gold transition-colors">
                Krone Langenburg
              </span>
              <span className="text-gold text-[8px] md:text-[9px] tracking-[0.4em] uppercase font-body font-medium -mt-0.5">
                by Ammesso
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-[11px] tracking-[0.15em] uppercase font-body font-medium transition-all rounded-lg ${
                    isActive(link.path)
                      ? 'text-gold bg-gold/8'
                      : 'text-ivory/50 hover:text-ivory hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/reserve"
                className="flex items-center gap-1.5 px-5 py-2.5 btn-gold rounded-full text-[10px] tracking-[0.15em] uppercase font-body font-semibold">
                <UtensilsCrossed className="w-3 h-3" /> Reserve
              </Link>
              <Link to="/rooms"
                className="flex items-center gap-1.5 px-5 py-2.5 btn-ghost-gold rounded-full text-[10px] tracking-[0.15em] uppercase font-body font-semibold">
                <BedDouble className="w-3 h-3" /> Book Room
              </Link>
              {user && (
                <Link to={isAdmin ? "/admin" : "/account"}
                  className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-body font-semibold">
                  {user.email?.[0]?.toUpperCase() || '?'}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        isOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-charcoal/98 backdrop-blur-xl transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu content */}
        <div className={`relative z-10 flex flex-col h-full pt-20 pb-8 px-6 transition-all duration-500 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-3 text-2xl font-display font-light transition-all ${
                  isActive(link.path) ? 'text-gold' : 'text-ivory/70 hover:text-ivory'
                }`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to={isAdmin ? "/admin" : "/account"}
                className="py-3 text-2xl font-display font-light text-gold/70 hover:text-gold transition-colors"
              >
                {isAdmin ? 'Admin Dashboard' : 'My Account'}
              </Link>
            )}
          </div>

          {/* Mobile CTAs */}
          <div className="space-y-3 pt-6 border-t border-[#C9A96E]/15">
            <Link to="/reserve"
              className="flex items-center justify-center gap-2 w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Reserve a Table
            </Link>
            <Link to="/rooms"
              className="flex items-center justify-center gap-2 w-full py-4 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              <BedDouble className="w-3.5 h-3.5" /> Book a Room
            </Link>
            <a href={`tel:${SITE.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 text-ivory/40 text-xs font-body tracking-wider">
              <Phone className="w-3 h-3" /> {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
