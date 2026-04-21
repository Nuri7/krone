import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, ArrowUpRight } from 'lucide-react';
import { SITE, NAV_LINKS } from '@/lib/siteData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0907] text-ivory border-t border-[#C9A96E]/08">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <p className="font-display text-2xl font-light text-ivory">Krone Langenburg</p>
              <p className="text-gold text-[9px] tracking-[0.4em] uppercase font-body font-medium">by Ammesso</p>
            </Link>
            <p className="text-ivory/35 text-sm font-body leading-relaxed max-w-xs">
              Mediterranean cuisine with heart. Stylish rooms in the historic heart of Hohenlohe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-5">Explore</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.slice(0, 6).map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-ivory/40 hover:text-ivory text-sm font-body transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/faq"
                  className="text-ivory/40 hover:text-ivory text-sm font-body transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-5">Contact</h3>
            <ul className="space-y-3 text-sm font-body">
              <li className="flex gap-2.5 text-ivory/40">
                <MapPin className="w-4 h-4 text-gold/50 flex-shrink-0 mt-0.5" />
                <span>{SITE.address.street}<br />{SITE.address.zip} {SITE.address.city}<br />{SITE.address.country}</span>
              </li>
              <li>
                <a href={`tel:${SITE.phone}`} className="flex gap-2.5 text-ivory/40 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4 text-gold/50 flex-shrink-0 mt-0.5" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex gap-2.5 text-ivory/40 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4 text-gold/50 flex-shrink-0 mt-0.5" />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold mb-5">Opening Hours</h3>
            <ul className="space-y-2.5 text-sm font-body">
              <li className="text-ivory/25">Monday — Closed</li>
              <li>
                <span className="text-ivory/50">Tue – Sat</span>
                <br /><span className="text-ivory/30 text-xs">12:00–14:30 · 17:30–22:00</span>
              </li>
              <li>
                <span className="text-ivory/50">Sunday</span>
                <br /><span className="text-ivory/30 text-xs">12:00–20:00</span>
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-2 mt-6">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#C9A96E]/15 flex items-center justify-center text-ivory/30 hover:text-gold hover:border-gold/30 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#C9A96E]/15 flex items-center justify-center text-ivory/30 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all text-xs font-bold">
                💬
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#C9A96E]/06">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ivory/20 text-xs font-body">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-ivory/20 text-xs font-body">
            <Link to="/legal" className="hover:text-ivory/40 transition-colors">Legal & Privacy</Link>
            <Link to="/faq" className="hover:text-ivory/40 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
