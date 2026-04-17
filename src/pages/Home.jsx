import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, UtensilsCrossed, BedDouble, Star, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1800&q=85",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
  room1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  room2: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  chef: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
  exterior: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const { tr, lang } = useLang();
  const s = SITE_DEFAULTS;
  const [heroLoaded, setHeroLoaded] = useState(false);

  const content = {
    de: {
      hero_title: "Wo Heimat schmeckt",
      hero_sub: "echt · herzlich · hausgemacht",
      hero_tagline: "Krone Langenburg by Ammesso",
      restaurant_title: "Kulinarium by Ammesso",
      restaurant_text: "Mediterrane Küche mit Herz und Persönlichkeit. Jedes Gericht erzählt eine Geschichte – mit Leidenschaft und hochwertigen Zutaten.",
      rooms_title: "Zimmer & Suiten",
      rooms_text: "Ruhige, stilvolle Unterkunft mitten im Herzen Hohenlohes. Erwachen Sie mit dem Charme eines historischen Hauses.",
      story_title: "Ein Traum, der seit Jahren köchelt",
      story_text: "Seit der ersten Idee bis heute – jede Zutat, jede Technik und jede Geschichte in unserem Restaurant ist mit Leidenschaft gewachsen.",
      reserve_cta: "Tisch reservieren",
      book_cta: "Zimmer buchen",
      menu_cta: "Speisekarte",
      story_cta: "Unsere Geschichte",
      direct_book: "Direktbucher-Preise garantiert",
      no_fees: "Keine Buchungsgebühren",
      hours_title: "Öffnungszeiten",
      closed: "Ruhetag",
      trust_title: "Bereit für einen unvergesslichen Abend?",
    },
    en: {
      hero_title: "Where Home Tastes Real",
      hero_sub: "genuine · warm · handcrafted",
      hero_tagline: "Krone Langenburg by Ammesso",
      restaurant_title: "Kulinarium by Ammesso",
      restaurant_text: "Mediterranean cuisine with heart and personality. Every dish tells a story — with passion and quality ingredients.",
      rooms_title: "Rooms & Suites",
      rooms_text: "Quiet, stylish accommodation in the heart of Hohenlohe. Wake up to the charm of a historic property.",
      story_title: "A Dream Years in the Making",
      story_text: "From the first idea to today — every ingredient, technique and story in our restaurant has grown with passion.",
      reserve_cta: "Reserve a Table",
      book_cta: "Book a Room",
      menu_cta: "View Menu",
      story_cta: "Our Story",
      direct_book: "Best Direct Booking Rates",
      no_fees: "No Booking Fees",
      hours_title: "Opening Hours",
      closed: "Closed",
      trust_title: "Ready for an unforgettable evening?",
    },
    it: {
      hero_title: "Dove il gusto è di casa",
      hero_sub: "autentico · caloroso · artigianale",
      hero_tagline: "Krone Langenburg by Ammesso",
      restaurant_title: "Kulinarium by Ammesso",
      restaurant_text: "Cucina mediterranea con cuore e personalità. Ogni piatto racconta una storia — con passione e ingredienti di qualità.",
      rooms_title: "Camere & Suite",
      rooms_text: "Alloggio tranquillo e raffinato nel cuore dell'Hohenlohe. Svegliatevi con il fascino di una proprietà storica.",
      story_title: "Un sogno cucinato per anni",
      story_text: "Dalla prima idea ad oggi — ogni ingrediente, tecnica e storia nel nostro ristorante è cresciuta con passione.",
      reserve_cta: "Prenota un tavolo",
      book_cta: "Prenota una camera",
      menu_cta: "Vedi il menu",
      story_cta: "La nostra storia",
      direct_book: "Prezzi diretti garantiti",
      no_fees: "Nessuna commissione",
      hours_title: "Orari di apertura",
      closed: "Chiuso",
      trust_title: "Pronto per una serata indimenticabile?",
    },
  };
  const c = content[lang] || content.de;

  return (
    <div className="bg-charcoal text-ivory pb-20 lg:pb-0">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <img src={IMAGES.hero} alt="Krone Langenburg by Ammesso"
          onLoad={() => setHeroLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="eager" />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 via-transparent to-charcoal/30" />

        {/* Content */}
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto pt-24">
          <div className={`transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body font-medium mb-6">
              {c.hero_tagline}
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-ivory leading-[1.05] tracking-tight mb-4">
              {c.hero_title}
            </h1>
          </div>
          <div className={`transition-all duration-1000 delay-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-ivory/50 text-sm sm:text-base tracking-[0.25em] uppercase font-body mb-10">
              {c.hero_sub}
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/reserve"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold shadow-gold-glow">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {c.reserve_cta}
              </Link>
              <Link to="/rooms"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                <BedDouble className="w-3.5 h-3.5" />
                {c.book_cta}
              </Link>
            </div>
          </div>

          {/* Location */}
          <div className={`mt-12 flex items-center justify-center gap-2 text-ivory/35 text-xs font-body transition-all duration-1000 delay-1200 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <MapPin className="w-3.5 h-3.5 text-gold/50" />
            <span className="tracking-wider">{s.address_street}, {s.address_zip} {s.address_city}</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-gold/40" />
        </div>
      </section>

      {/* ── BRAND STRIP ──────────────────────────────────────── */}
      <section className="py-16 px-5 border-y border-[#C9A96E]/10 bg-espresso">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-divider mb-8" />
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-ivory leading-relaxed italic">
              &ldquo;Wo Heimat schmeckt — echt, herzlich, hausgemacht.&rdquo;
            </p>
            <div className="section-divider mt-8" />
          </div>
        </AnimatedSection>
      </section>

      {/* ── HOURS ────────────────────────────────────────────── */}
      <section className="py-14 px-5 bg-charcoal">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-8">
              <Clock className="w-4 h-4 text-gold/60" />
              <span className="text-ivory/30 text-[10px] tracking-[0.4em] uppercase font-body">{c.hours_title}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { day: lang === 'de' ? 'Montag' : lang === 'en' ? 'Monday' : 'Lunedì', hours: c.closed, dim: true },
                { day: lang === 'de' ? 'Di – Sa' : lang === 'en' ? 'Tue – Sat' : 'Mar – Sab', hours: ['12:00 – 14:30', '17:30 – 22:00'] },
                { day: lang === 'de' ? 'Sonntag' : lang === 'en' ? 'Sunday' : 'Domenica', hours: ['12:00 – 20:00'] },
              ].map((item, i) => (
                <div key={i} className={`glass-card rounded-xl p-5 text-center ${item.dim ? 'opacity-40' : ''}`}>
                  <p className="text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-2">{item.day}</p>
                  {Array.isArray(item.hours)
                    ? item.hours.map((h, j) => <p key={j} className="text-ivory text-sm font-body">{h}</p>)
                    : <p className="text-ivory/60 text-sm font-body">{item.hours}</p>
                  }
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── RESTAURANT ───────────────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden h-80 md:h-[480px] shadow-premium hover-lift">
              <img src={IMAGES.dining} alt="Kulinarium by Ammesso" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="bg-gold/90 text-charcoal text-[10px] font-body font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
                  Kulinarium by Ammesso
                </span>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">{lang === 'de' ? 'Restaurant' : 'Restaurant'}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-5 leading-tight">{c.restaurant_title}</h2>
            <p className="text-ivory/55 leading-relaxed font-body mb-8">{c.restaurant_text}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve"
                className="flex items-center justify-center gap-2 px-6 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                {c.reserve_cta}
              </Link>
              <Link to="/menu"
                className="flex items-center justify-center gap-2 px-6 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                {c.menu_cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── ROOMS ─────────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-espresso">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <AnimatedSection className="order-2 md:order-1">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">
              {lang === 'de' ? 'Unterkunft' : lang === 'en' ? 'Accommodation' : 'Alloggio'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-5 leading-tight">{c.rooms_title}</h2>
            <p className="text-ivory/55 leading-relaxed font-body mb-6">{c.rooms_text}</p>
            <div className="flex items-center gap-2 text-xs text-ivory/40 font-body mb-8">
              <Star className="w-3.5 h-3.5 text-gold/60" />
              <span>{c.direct_book} · {c.no_fees}</span>
            </div>
            <Link to="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {c.book_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </AnimatedSection>
          <AnimatedSection className="order-1 md:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-xl overflow-hidden h-48 md:h-64 shadow-card hover-lift">
                <img src={IMAGES.room1} alt="Zimmer" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative rounded-xl overflow-hidden h-48 md:h-64 shadow-card hover-lift mt-8">
                <img src={IMAGES.room2} alt="Suite" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CHEF STORY ─────────────────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] shadow-premium hover-lift">
              <img src={IMAGES.chef} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-2xl text-ivory font-light">Omar Ammesso</p>
                <p className="text-gold text-xs tracking-widest font-body mt-0.5">Chef & Founder</p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">
              {lang === 'de' ? 'Unsere Geschichte' : lang === 'en' ? 'Our Story' : 'La nostra storia'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-5 leading-tight">{c.story_title}</h2>
            <p className="text-ivory/55 leading-relaxed font-body mb-4">{c.story_text}</p>
            <blockquote className="border-l-2 border-gold/40 pl-5 my-6 italic font-display text-xl text-ivory/70">
              {lang === 'de' && '"Ammesso bringt Gefühl auf den Teller – bei ihm schmeckt man Herz, Vergangenheit und Vision in jedem Bissen."'}
              {lang === 'en' && '"Ammesso brings feeling to the plate — in every bite you taste heart, history and vision."'}
              {lang === 'it' && '"Ammesso porta emozione nel piatto — in ogni boccone si sente cuore, passato e visione."'}
            </blockquote>
            <Link to="/story"
              className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase font-body hover:gap-3 transition-all">
              {c.story_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── WEDDINGS STRIP ─────────────────────────────────────── */}
      <section className="py-20 px-5 bg-espresso">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">
              {lang === 'de' ? 'Hochzeiten & Events' : lang === 'en' ? 'Weddings & Events' : 'Matrimoni & Eventi'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-6">
              {lang === 'de' ? 'Ihr besonderer Tag verdient einen besonderen Ort.' : lang === 'en' ? 'Your special day deserves a special place.' : 'Il tuo giorno speciale merita un luogo speciale.'}
            </h2>
            <p className="text-ivory/50 leading-relaxed font-body mb-8 max-w-xl mx-auto">
              {lang === 'de' && 'Hochzeiten, Feiern, Firmenevents — wir gestalten unvergessliche Momente mit Leidenschaft und Liebe zum Detail.'}
              {lang === 'en' && 'Weddings, celebrations, corporate events — we create unforgettable moments with passion and attention to detail.'}
              {lang === 'it' && 'Matrimoni, feste, eventi aziendali — creiamo momenti indimenticabili con passione e cura per i dettagli.'}
            </p>
            <Link to="/weddings"
              className="inline-flex items-center gap-2.5 px-8 py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Anfragen' : lang === 'en' ? 'Enquire' : 'Richiedi'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="relative py-24 px-5 overflow-hidden">
        <img src={IMAGES.exterior} alt="Krone Langenburg" className="absolute inset-0 w-full h-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 to-charcoal/95" />
        <AnimatedSection className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-4">Krone Langenburg by Ammesso</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-4">{c.trust_title}</h2>
            <div className="section-divider my-6" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/reserve"
                className="flex items-center justify-center gap-2.5 px-8 py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold shadow-gold-glow">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {c.reserve_cta}
              </Link>
              <a href={`tel:${s.phone}`}
                className="flex items-center justify-center gap-2.5 px-8 py-4 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                {s.phone}
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}