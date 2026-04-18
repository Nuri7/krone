import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-5 pt-20 pb-16">
      <div className="max-w-md w-full text-center">
        <p className="font-display text-[120px] sm:text-[160px] font-light text-ivory/5 leading-none select-none">404</p>
        <div className="-mt-8 sm:-mt-12">
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body mb-4">Krone Langenburg</p>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-3">
            Seite nicht gefunden
          </h1>
          <p className="text-ivory/40 text-sm font-body leading-relaxed mb-8">
            Die Seite <span className="text-ivory/60">"{location.pathname}"</span> existiert nicht.<br />
            Vielleicht hilft Ihnen eines der folgenden Links weiter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/"
              className="flex items-center justify-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              Startseite
            </Link>
            <Link to="/reserve"
              className="flex items-center justify-center gap-2 px-7 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              Tisch reservieren
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-body text-ivory/25">
            <Link to="/rooms" className="hover:text-gold transition-colors">Zimmer</Link>
            <Link to="/restaurant" className="hover:text-gold transition-colors">Restaurant</Link>
            <Link to="/contact" className="hover:text-gold transition-colors">Kontakt</Link>
            <Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}