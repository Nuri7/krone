// No React hooks needed — simple presentational component
import { useSearchParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function BookingReturn() {
  const [params] = useSearchParams();
  const status = params.get('status') || 'success';

  return (
    <div className="bg-charcoal min-h-screen pt-32 px-5">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <Check className="w-7 h-7 text-gold" />
        </div>
        <h1 className="font-display text-4xl text-ivory mb-3">Booking Complete</h1>
        <p className="text-ivory/40 font-body text-sm mb-8">
          Thank you for your reservation. You should receive a confirmation email shortly.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
