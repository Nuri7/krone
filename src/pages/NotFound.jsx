import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-charcoal min-h-screen pt-32 px-5">
      <div className="max-w-md mx-auto text-center">
        <p className="font-display text-8xl text-gold/20 mb-4">404</p>
        <h1 className="font-display text-4xl text-ivory mb-3">Page Not Found</h1>
        <p className="text-ivory/40 font-body text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
            <Home className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <Link to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-ghost-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
