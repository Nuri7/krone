import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Star, UtensilsCrossed, BedDouble } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

const HERO_IMAGE = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=85";
const RESTAURANT_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80";
const ROOMS_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80";
const CHEF_IMAGE = "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp";

export default function Home() {
  const { tr, lang } = useLang();
  const s = SITE_DEFAULTS;

  return (
    <div className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Krone Langenburg by Ammesso"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20">
          <p className="text-amber-300 text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            Krone Langenburg
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-4">
            {tr('hero', 'tagline')}
          </h1>
          <p className="text-stone-300 text-base sm:text-lg tracking-wide mb-10">
            {tr('hero', 'sub')}
          </p>

          {/* Mobile-first CTA hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/reserve"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold rounded-xl text-base transition-colors shadow-lg"
            >
              <UtensilsCrossed className="w-4 h-4" />
              {tr('hero', 'cta_reserve')}
            </Link>
            <Link
              to="/rooms"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl text-base transition-colors border border-white/30"
            >
              <BedDouble className="w-4 h-4" />
              {tr('hero', 'cta_rooms')}
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-10 flex items-center justify-center gap-2 text-stone-400 text-sm">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{s.address_street}, {s.address_zip} {s.address_city}</span>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Welcome strip */}
      <section className="bg-amber-50 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light text-stone-800 mb-3">
            {tr('home', 'welcome_title')}
          </h2>
          <p className="text-stone-600 leading-relaxed">
            {tr('home', 'welcome_text')}
          </p>
        </div>
      </section>

      {/* Opening hours — mobile-first trust signal */}
      <section className="bg-stone-900 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-5 justify-center">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">{tr('home', 'hours_title')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-stone-800 rounded-xl p-4">
              <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">{tr('home', 'monday')}</p>
              <p className="text-stone-500 font-medium">{tr('home', 'closed')}</p>
            </div>
            <div className="bg-stone-800 rounded-xl p-4">
              <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">{tr('home', 'tue_sat')}</p>
              <p className="text-sm text-stone-300">{tr('home', 'lunch')}: 12:00–14:30</p>
              <p className="text-sm text-stone-300">{tr('home', 'dinner')}: 17:30–22:00</p>
            </div>
            <div className="bg-stone-800 rounded-xl p-4">
              <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">{tr('home', 'sunday')}</p>
              <p className="text-sm text-stone-300">12:00–20:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant feature */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 shadow-xl">
            <img src={RESTAURANT_IMAGE} alt="Restaurant Ammesso" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Kulinarium by Ammesso
              </span>
            </div>
          </div>
          <div>
            <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-3">
              {tr('nav', 'restaurant')}
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-4">{tr('home', 'restaurant_title')}</h2>
            <p className="text-stone-600 leading-relaxed mb-6">{tr('home', 'restaurant_text')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/reserve"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
              >
                {tr('hero', 'cta_reserve')}
              </Link>
              <Link
                to="/menu"
                className="flex items-center justify-center gap-2 px-6 py-3.5 border border-stone-300 hover:border-amber-600 text-stone-700 hover:text-amber-700 rounded-xl transition-colors"
              >
                {tr('nav', 'menu')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms feature */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-3">
              {tr('nav', 'rooms')}
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-4">{tr('home', 'rooms_title')}</h2>
            <p className="text-stone-600 leading-relaxed mb-4">{tr('home', 'rooms_text')}</p>
            <div className="flex items-start gap-2 text-sm text-stone-500 mb-6">
              <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>{lang === 'de' ? 'Direktbuchung — keine Buchungsprovisionen' : lang === 'en' ? 'Book direct — no booking fees' : 'Prenota diretto — nessuna commissione'}</span>
            </div>
            <Link
              to="/rooms"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-stone-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
            >
              {tr('hero', 'cta_book')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden h-72 md:h-96 shadow-xl">
            <img src={ROOMS_IMAGE} alt="Zimmer Krone Langenburg" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Chef story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden h-80 md:h-[28rem] shadow-xl">
            <img src={CHEF_IMAGE} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
          </div>
          <div>
            <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-3">
              {tr('story', 'chef_title')}
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-2">Omar Ammesso</h2>
            <p className="text-stone-400 text-sm italic mb-5">{tr('story', 'brand')}</p>
            <p className="text-stone-600 leading-relaxed mb-6">{tr('home', 'story_text')}</p>
            <Link
              to="/story"
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              {tr('home', 'read_more')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final conversion strip */}
      <section className="bg-amber-600 py-14 px-4 text-center text-white">
        <p className="text-amber-200 text-xs uppercase tracking-widest mb-3">Krone Langenburg by Ammesso</p>
        <h2 className="text-2xl sm:text-3xl font-light mb-6">
          {lang === 'de' && 'Reservieren Sie Ihren Tisch noch heute.'}
          {lang === 'en' && 'Reserve your table today.'}
          {lang === 'it' && 'Prenota il tuo tavolo oggi.'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto">
          <Link
            to="/reserve"
            className="w-full sm:w-auto px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
          >
            {tr('nav', 'reserve')}
          </Link>
          <a
            href={`tel:${s.phone}`}
            className="w-full sm:w-auto px-8 py-4 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            {s.phone}
          </a>
        </div>
      </section>
    </div>
  );
}