import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Clock, XCircle, Home, Phone } from 'lucide-react';
import { SITE_DEFAULTS } from '@/lib/siteData';

export default function BookingReturn() {
  const { tr, lang } = useLang();
  const [state, setState] = useState('loading'); // loading | confirmed | pending | cancelled
  const [intentRef, setIntentRef] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || 'pending';
    const ref = params.get('ref') || '';
    setIntentRef(ref);

    // Map URL status to our states
    if (status === 'confirmed' || status === 'success' || status === 'completed') setState('confirmed');
    else if (status === 'cancelled' || status === 'cancel' || status === 'failed') setState('cancelled');
    else setState('pending');

    // Update booking intent if we have a ref
    if (ref) {
      const statusMap = { confirmed: 'returned_confirmed', pending: 'returned_pending', cancelled: 'returned_cancelled' };
      const s = status === 'confirmed' || status === 'success' ? 'returned_confirmed'
        : status === 'cancelled' || status === 'cancel' ? 'returned_cancelled' : 'returned_pending';
      base44.entities.BookingIntent.filter({ intent_ref: ref }).then(items => {
        if (items.length > 0) {
          base44.entities.BookingIntent.update(items[0].id, { status: s, returned_at: new Date().toISOString() });
        }
      }).catch(() => {});
    }
  }, []);

  const configs = {
    loading: {
      icon: <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />,
      color: 'bg-amber-50',
      title: tr('common', 'loading'),
      text: '',
    },
    confirmed: {
      icon: <CheckCircle className="w-14 h-14 text-green-600" />,
      color: 'bg-green-50',
      title: tr('rooms', 'returning_confirmed'),
      text: lang === 'de' ? 'Sie erhalten in Kürze eine Buchungsbestätigung per E-Mail.' : lang === 'en' ? 'You will receive a booking confirmation by email shortly.' : 'Riceverete a breve una conferma di prenotazione via email.',
    },
    pending: {
      icon: <Clock className="w-14 h-14 text-amber-500" />,
      color: 'bg-amber-50',
      title: tr('rooms', 'returning_pending'),
      text: lang === 'de' ? 'Falls Sie keine Bestätigung erhalten, kontaktieren Sie uns bitte.' : lang === 'en' ? 'If you do not receive a confirmation, please contact us.' : 'Se non ricevete una conferma, contattateci.',
    },
    cancelled: {
      icon: <XCircle className="w-14 h-14 text-red-400" />,
      color: 'bg-red-50',
      title: tr('rooms', 'returning_cancelled'),
      text: lang === 'de' ? 'Möchten Sie es erneut versuchen oder uns direkt kontaktieren?' : lang === 'en' ? 'Would you like to try again or contact us directly?' : 'Volete riprovare o contattarci direttamente?',
    },
  };

  const cfg = configs[state];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-20 pb-16">
      <div className="max-w-md w-full">
        <div className={`${cfg.color} rounded-2xl p-8 text-center shadow-sm border border-stone-100 mb-6`}>
          <div className="flex justify-center mb-5">{cfg.icon}</div>
          <h1 className="text-xl font-semibold text-stone-800 mb-3">{cfg.title}</h1>
          {cfg.text && <p className="text-stone-600 text-sm leading-relaxed">{cfg.text}</p>}
          {intentRef && (
            <p className="text-xs text-stone-400 mt-3">Ref: {intentRef}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/" className="flex items-center justify-center gap-2 py-3 bg-white border border-stone-200 rounded-xl text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            <Home className="w-4 h-4" />
            {lang === 'de' ? 'Startseite' : lang === 'en' ? 'Home' : 'Home'}
          </Link>
          <a href={`tel:${SITE_DEFAULTS.phone}`} className="flex items-center justify-center gap-2 py-3 bg-amber-600 rounded-xl text-white text-sm font-semibold hover:bg-amber-700 transition-colors">
            <Phone className="w-4 h-4" />
            {SITE_DEFAULTS.phone}
          </a>
        </div>

        {state !== 'confirmed' && (
          <div className="mt-4 text-center">
            <Link to="/rooms" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              {lang === 'de' ? 'Erneut versuchen →' : lang === 'en' ? 'Try again →' : 'Riprova →'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}