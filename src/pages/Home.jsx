import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, UtensilsCrossed, BedDouble, Star, ChevronDown, Phone, MessageCircle, Send } from 'lucide-react';
import { useLang } from '@/lib/useLang';
import { SITE_DEFAULTS } from '@/lib/siteData';

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1800&q=85",
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=800&q=80",
  room1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  room2: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  room3: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  chef: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
  exterior: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
  wedding: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
  hohenlohe: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
};

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
}

const REVIEWS = [
  { name: 'Maria K.', stars: 5, de: 'Außergewöhnliches Erlebnis — das Essen war auf einem anderen Niveau. Wir kommen definitiv wieder.', en: 'An extraordinary experience — the food was on another level. We will definitely come back.', it: 'Un\'esperienza straordinaria — il cibo era a un altro livello. Torneremo sicuramente.' },
  { name: 'Thomas B.', stars: 5, de: 'Das schönste Restaurant in der Region. Authentisch, herzlich, und jedes Gericht eine Offenbarung.', en: 'The most beautiful restaurant in the region. Authentic, warm, and every dish a revelation.', it: 'Il ristorante più bello della regione. Autentico, caloroso, ogni piatto una rivelazione.' },
  { name: 'Sophie L.', stars: 5, de: 'Wir haben unsere Hochzeit hier gefeiert. Alles war perfekt — das Ambiente, das Essen, das Team.', en: 'We celebrated our wedding here. Everything was perfect — the atmosphere, the food, the team.', it: 'Abbiamo celebrato il nostro matrimonio qui. Tutto era perfetto.' },
];

export default function Home() {
  const { lang } = useLang();
  const s = SITE_DEFAULTS;
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(r => (r + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const C = {
    de: {
      hero_eyebrow: 'Krone Langenburg by Ammesso',
      hero_title: 'Wo Heimat schmeckt.',
      hero_sub: 'Mediterrane Küche mit Herz. Stilvolle Zimmer im historischen Herz Hohenlohes.',
      reserve: 'Tisch reservieren',
      book_room: 'Zimmer buchen',
      scroll: 'Entdecken',
      hours_title: 'Öffnungszeiten',
      closed: 'Ruhetag',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Mediterrane Seele. Hohenloher Herz.',
      dining_p1: 'Im Kulinarium by Ammesso begegnen sich zwei Welten: die lebendige Aromenvielfalt des Mittelmeerraums und die ehrliche Bodenständigkeit Hohenlohes. Chef Omar Ammesso kocht nicht für den Trend — er kocht für den Moment.',
      dining_p2: 'Handgemachte Pasta, langsam geschmorte Fleischgerichte, saisonale Zutaten vom Wochenmarkt. Jedes Gericht ist eine persönliche Geschichte — ausgedrückt in Geschmack.',
      menu_cta: 'Zur Speisekarte',
      rooms_eyebrow: 'Unterkunft',
      rooms_title: 'Schlafen, wo Geschichte wohnt.',
      rooms_p: 'Unsere Zimmer und Suiten verbinden historisches Flair mit modernem Komfort. Wachen Sie auf im Herzen von Langenburg — still, warm, vollständig.',
      rooms_trust: 'Direktbucher-Preise · Keine Gebühren · Frühstück auf Anfrage',
      rooms_cta: 'Zimmer & Preise',
      story_eyebrow: 'Unsere Geschichte',
      story_title: 'Ein Traum, der schmeckt.',
      story_p: 'Omar Ammesso ist kein gelernter Koch — er ist ein Besessener. Aufgewachsen zwischen zwei Kulturen, destilliert er in jedem Gericht das Beste aus beiden Welten. Die Krone Langenburg ist sein Zuhause. Und wenn Sie bei uns essen, sind Sie Teil davon.',
      story_cta: 'Die Geschichte lesen',
      weddings_eyebrow: 'Hochzeiten & Events',
      weddings_title: 'Ihr besonderer Tag. Unser ganzes Herz.',
      weddings_p: 'Von der Traumhochzeit bis zum Firmenevent — wir schaffen unvergessliche Momente mit Leidenschaft und Liebe zum Detail. Raumkontingente, Private Dining, exklusive Abende.',
      weddings_cta: 'Jetzt anfragen',
      trust_eyebrow: 'Warum die Krone?',
      trust_1_title: 'Authentisch',
      trust_1: 'Kein Franchise, kein Konzept. Echte Küche, echte Menschen, echtes Hohenlohe.',
      trust_2_title: 'Persönlich',
      trust_2: 'Vom ersten Tisch bis zur letzten Suite kennen wir jeden Gast beim Namen.',
      trust_3_title: 'Historisch',
      trust_3: 'Ein Haus mit Geschichte — restauriert mit Respekt für das Original.',
      trust_4_title: 'Leidenschaftlich',
      trust_4: 'Hinter jedem Gericht steckt ein Mensch mit einer Geschichte.',
      review_title: 'Was Gäste sagen',
      cta_title: 'Bereit für einen Abend, den Sie nicht vergessen?',
      cta_sub: 'Reservieren Sie Ihren Tisch oder buchen Sie Ihr Zimmer — direkt, ohne Aufpreis.',
      phone_cta: 'Anrufen',
      location_label: 'Langenburg, Hohenlohe',
    },
    en: {
      hero_eyebrow: 'Krone Langenburg by Ammesso',
      hero_title: 'Where Home Tastes Real.',
      hero_sub: 'Mediterranean cuisine with heart. Stylish rooms in the historic heart of Hohenlohe.',
      reserve: 'Reserve a Table',
      book_room: 'Book a Room',
      scroll: 'Discover',
      hours_title: 'Opening Hours',
      closed: 'Closed',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Mediterranean Soul. Hohenlohe Heart.',
      dining_p1: 'At Kulinarium by Ammesso, two worlds meet: the vibrant flavors of the Mediterranean and the honest groundedness of Hohenlohe. Chef Omar Ammesso doesn\'t cook for trends — he cooks for the moment.',
      dining_p2: 'Handmade pasta, slow-braised meats, seasonal ingredients from the market. Every dish is a personal story — expressed in taste.',
      menu_cta: 'View Menu',
      rooms_eyebrow: 'Accommodation',
      rooms_title: 'Sleep Where History Lives.',
      rooms_p: 'Our rooms and suites combine historic character with modern comfort. Wake up in the heart of Langenburg — quiet, warm, complete.',
      rooms_trust: 'Direct rates · No fees · Breakfast on request',
      rooms_cta: 'Rooms & Rates',
      story_eyebrow: 'Our Story',
      story_title: 'A Dream That Tastes.',
      story_p: 'Omar Ammesso is not a trained chef — he is an obsessive. Raised between two cultures, he distills the best of both worlds into every dish. Krone Langenburg is his home. And when you dine with us, you become part of it.',
      story_cta: 'Read the Story',
      weddings_eyebrow: 'Weddings & Events',
      weddings_title: 'Your Special Day. Our Whole Heart.',
      weddings_p: 'From dream weddings to corporate events — we create unforgettable moments with passion and attention to detail. Room contingents, private dining, exclusive evenings.',
      weddings_cta: 'Enquire Now',
      trust_eyebrow: 'Why the Krone?',
      trust_1_title: 'Authentic',
      trust_1: 'No franchise, no concept. Real food, real people, real Hohenlohe.',
      trust_2_title: 'Personal',
      trust_2: 'From the first table to the last suite, we know every guest by name.',
      trust_3_title: 'Historic',
      trust_3: 'A house with history — restored with respect for the original.',
      trust_4_title: 'Passionate',
      trust_4: 'Behind every dish is a person with a story.',
      review_title: 'What Guests Say',
      cta_title: 'Ready for an evening you won\'t forget?',
      cta_sub: 'Reserve your table or book your room — directly, without fees.',
      phone_cta: 'Call Us',
      location_label: 'Langenburg, Hohenlohe',
    },
    it: {
      hero_eyebrow: 'Krone Langenburg by Ammesso',
      hero_title: 'Dove il gusto è di casa.',
      hero_sub: 'Cucina mediterranea con cuore. Camere eleganti nel cuore storico dell\'Hohenlohe.',
      reserve: 'Prenota un tavolo',
      book_room: 'Prenota una camera',
      scroll: 'Scopri',
      hours_title: 'Orari di apertura',
      closed: 'Chiuso',
      dining_eyebrow: 'Kulinarium by Ammesso',
      dining_title: 'Anima mediterranea. Cuore dell\'Hohenlohe.',
      dining_p1: 'Al Kulinarium by Ammesso si incontrano due mondi: la vivace varietà di sapori del Mediterraneo e l\'onesta concretezza dell\'Hohenlohe. Lo chef Omar Ammesso non cucina per le tendenze — cucina per il momento.',
      dining_p2: 'Pasta fatta a mano, carni a cottura lenta, ingredienti stagionali dal mercato. Ogni piatto è una storia personale — espressa nel sapore.',
      menu_cta: 'Vedi il menu',
      rooms_eyebrow: 'Alloggio',
      rooms_title: 'Dormire dove vive la storia.',
      rooms_p: 'Le nostre camere e suite combinano il fascino storico con il comfort moderno. Svegliatevi nel cuore di Langenburg — tranquillo, caldo, completo.',
      rooms_trust: 'Prezzi diretti · Nessuna commissione · Colazione su richiesta',
      rooms_cta: 'Camere e prezzi',
      story_eyebrow: 'La nostra storia',
      story_title: 'Un sogno che sa di buono.',
      story_p: 'Omar Ammesso non è uno chef di formazione — è un ossessionato. Cresciuto tra due culture, distilla il meglio di entrambi i mondi in ogni piatto. Krone Langenburg è la sua casa. E quando cenate con noi, ne fate parte.',
      story_cta: 'Leggi la storia',
      weddings_eyebrow: 'Matrimoni & eventi',
      weddings_title: 'Il vostro giorno speciale. Tutto il nostro cuore.',
      weddings_p: 'Dal matrimonio dei sogni agli eventi aziendali — creiamo momenti indimenticabili con passione e cura per i dettagli.',
      weddings_cta: 'Richiedi ora',
      trust_eyebrow: 'Perché la Krone?',
      trust_1_title: 'Autentico',
      trust_1: 'Nessun franchising, nessun concept. Cibo vero, persone vere, Hohenlohe vero.',
      trust_2_title: 'Personale',
      trust_2: 'Dal primo tavolo all\'ultima suite, conosciamo ogni ospite per nome.',
      trust_3_title: 'Storico',
      trust_3: 'Una casa con storia — restaurata con rispetto per l\'originale.',
      trust_4_title: 'Appassionato',
      trust_4: 'Dietro ogni piatto c\'è una persona con una storia.',
      review_title: 'Cosa dicono gli ospiti',
      cta_title: 'Pronto per una serata che non dimenticherete?',
      cta_sub: 'Prenotate il vostro tavolo o la vostra camera — direttamente, senza commissioni.',
      phone_cta: 'Chiama',
      location_label: 'Langenburg, Hohenlohe',
    },
  };
  const c = C[lang] || C.de;

  return (
    <div className="bg-charcoal text-ivory overflow-x-hidden pb-20 lg:pb-0">

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <img src={IMAGES.hero} alt="Krone Langenburg"
          onLoad={() => setHeroLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-[2s] ${heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          loading="eager" />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-charcoal/35 to-charcoal/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-charcoal to-transparent" />

        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24">
          <div className={`transition-all duration-1000 delay-200 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-8">
              <div className="h-px w-8 sm:w-10 bg-gold/40" />
              <p className="text-gold text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase font-body font-medium">{c.hero_eyebrow}</p>
              <div className="h-px w-8 sm:w-10 bg-gold/40" />
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="font-display text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[108px] font-light text-ivory leading-[0.95] tracking-tight mb-4 sm:mb-6">
              {c.hero_title}
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-600 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-ivory/55 text-xs sm:text-sm md:text-base font-body font-light leading-relaxed max-w-lg sm:max-w-2xl mb-7 sm:mb-10 px-2">
              {c.hero_sub}
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-800 w-full max-w-sm sm:max-w-none ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center mb-3">
              <Link to="/reserve"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 sm:px-9 py-4 btn-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold shadow-gold-glow">
                <UtensilsCrossed className="w-3.5 h-3.5 flex-shrink-0" />
                {c.reserve}
              </Link>
              <Link to="/rooms"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 sm:px-9 py-4 btn-ghost-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold">
                <BedDouble className="w-3.5 h-3.5 flex-shrink-0" />
                {c.book_room}
              </Link>
            </div>
            {/* WhatsApp - secondary on mobile */}
            <a href={`https://wa.me/${s.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hallo%20Krone%20Langenburg`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-ivory/40 hover:text-gold text-[10px] tracking-[0.25em] uppercase font-body transition-colors">
              <Send className="w-3 h-3" />
              WhatsApp
            </a>

            {/* Location */}
            <div className="mt-5 sm:mt-8 flex items-center justify-center gap-2 text-ivory/25 text-[10px] sm:text-xs font-body">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold/40 flex-shrink-0" />
              <span className="tracking-wider truncate">{s.address_street} · {s.address_zip} {s.address_city}</span>
            </div>
          </div>
        </div>

        {/* Hours strip */}
        <div className={`relative z-10 w-full mt-auto transition-all duration-1000 delay-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="border-t border-[#C9A96E]/15 bg-charcoal/60 backdrop-blur-md">
            <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 sm:py-4 grid grid-cols-3 divide-x divide-[#C9A96E]/15">
              {[
                { d: lang === 'de' ? 'Mo' : 'Mon', h: lang === 'de' ? 'Ruhetag' : 'Closed', dim: true },
                { d: lang === 'de' ? 'Di–Sa' : lang === 'en' ? 'Tue–Sat' : 'Mar–Sab', h: '12–14:30 · 17:30–22' },
                { d: lang === 'de' ? 'So' : lang === 'en' ? 'Sun' : 'Dom', h: '12:00–20:00' },
              ].map((item, i) => (
                <div key={i} className={`px-2 sm:px-4 text-center ${item.dim ? 'opacity-30' : ''}`}>
                  <p className="text-ivory/35 text-[9px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-body mb-0.5">{item.d}</p>
                  <p className="text-ivory/70 text-[10px] sm:text-xs font-body">{item.h}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ivory/25">
          <span className="text-[9px] tracking-[0.4em] uppercase font-body">{c.scroll}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ── DINING ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp>
            <div className="relative">
              {/* Stacked images for depth */}
              <div className="absolute -top-4 -right-4 w-2/5 h-48 rounded-xl overflow-hidden shadow-premium opacity-70">
                <img src={IMAGES.pasta} alt="Pasta" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[520px] shadow-premium">
                <img src={IMAGES.dining} alt="Kulinarium Dining" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-gold text-charcoal text-[9px] font-body font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                    Kulinarium by Ammesso
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.dining_eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-ivory mb-6 leading-[1.05]">{c.dining_title}</h2>
            <p className="text-ivory/60 leading-relaxed font-body mb-4">{c.dining_p1}</p>
            <p className="text-ivory/45 leading-relaxed font-body text-sm mb-10">{c.dining_p2}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve"
                className="flex items-center justify-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {c.reserve}
              </Link>
              <Link to="/menu"
                className="flex items-center justify-center gap-2 px-7 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
                {c.menu_cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ROOMS ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-5 bg-espresso">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp className="order-2 lg:order-1">
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.rooms_eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-ivory mb-6 leading-[1.05]">{c.rooms_title}</h2>
            <p className="text-ivory/60 leading-relaxed font-body mb-6">{c.rooms_p}</p>
            <div className="flex items-center gap-2 text-ivory/35 text-xs font-body mb-10">
              <Star className="w-3.5 h-3.5 text-gold/50 fill-gold/20" />
              <span>{c.rooms_trust}</span>
            </div>
            <Link to="/rooms"
              className="inline-flex items-center gap-2 px-7 py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {c.rooms_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>

          <FadeUp delay={150} className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-60 shadow-card hover-lift">
                  <img src={IMAGES.room1} alt="Deluxe Zimmer" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:h-40 shadow-card hover-lift opacity-70">
                  <img src={IMAGES.hohenlohe} alt="Hohenlohe" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:h-40 shadow-card hover-lift opacity-70">
                  <img src={IMAGES.room3} alt="Suite" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:h-60 shadow-card hover-lift">
                  <img src={IMAGES.room2} alt="Doppelzimmer" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TRUST PILLARS ───────────────────────────────── */}
      <section className="py-14 px-5">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-3">{c.trust_eyebrow}</p>
              <div className="section-divider" />
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: c.trust_1_title, text: c.trust_1, icon: '✦' },
              { title: c.trust_2_title, text: c.trust_2, icon: '◇' },
              { title: c.trust_3_title, text: c.trust_3, icon: '◆' },
              { title: c.trust_4_title, text: c.trust_4, icon: '✦' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6 h-full flex sm:flex-col gap-4 sm:gap-0 items-start">
                  <p className="text-gold/60 text-xl sm:mb-4 flex-shrink-0">{item.icon}</p>
                  <div>
                    <h3 className="font-display text-xl font-light text-ivory mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-ivory/40 text-sm font-body leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHEF & STORY ────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-5 bg-espresso border-y border-[#C9A96E]/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeUp>
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 lg:h-[460px] shadow-premium">
              <img src={IMAGES.chef} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-7 left-7">
                <p className="font-display text-2xl text-ivory font-light leading-tight">Omar Ammesso</p>
                <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-body mt-1">Chef & Founder · Krone Langenburg</p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.story_eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ivory mb-6 leading-[1.05]">{c.story_title}</h2>
            <p className="text-ivory/60 leading-relaxed font-body mb-7">{c.story_p}</p>
            <blockquote className="border-l-2 border-gold/40 pl-5 italic font-display text-xl text-ivory/60 mb-8 leading-relaxed">
              {lang === 'de' && '"Ich koche nicht für den Michelin-Stern. Ich koche dafür, dass du morgen wieder kommst."'}
              {lang === 'en' && '"I don\'t cook for the Michelin star. I cook so you come back tomorrow."'}
              {lang === 'it' && '"Non cucino per la stella Michelin. Cucino affinché tu torni domani."'}
            </blockquote>
            <Link to="/story"
              className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase font-body hover:gap-3 transition-all">
              {c.story_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-8 sm:mb-10">{c.review_title}</p>
            <div className="relative min-h-[160px] sm:min-h-[140px]">
              {REVIEWS.map((r, i) => (
                <div key={i}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === activeReview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gold text-gold" />)}
                  </div>
                  <p className="font-display text-lg sm:text-xl md:text-2xl font-light text-ivory/80 italic leading-relaxed mb-3 sm:mb-4 max-w-2xl px-2">
                    &ldquo;{lang === 'de' ? r.de : lang === 'en' ? r.en : r.it}&rdquo;
                  </p>
                  <p className="text-ivory/30 text-xs font-body tracking-widest uppercase">— {r.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2.5 mt-8">
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setActiveReview(i)}
                  className={`w-8 h-1.5 rounded-full transition-all ${i === activeReview ? 'bg-gold' : 'bg-gold/20'}`} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── WEDDINGS ────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-5 overflow-hidden">
        <img src={IMAGES.wedding} alt="Weddings & Events" className="absolute inset-0 w-full h-full object-cover opacity-20" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/90 to-charcoal/95" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-5">{c.weddings_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-ivory mb-4 sm:mb-6 leading-[1.05]">{c.weddings_title}</h2>
            <p className="text-ivory/50 leading-relaxed font-body mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">{c.weddings_p}</p>
            <Link to="/weddings"
              className="inline-flex items-center gap-2.5 px-9 py-4 btn-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold shadow-gold-glow">
              {c.weddings_cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ TEASER ──────────────────────────────────── */}
      <section className="py-10 sm:py-14 px-5 border-t border-[#C9A96E]/08">
        <FadeUp>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-2">
                {lang === 'de' ? 'Häufige Fragen' : lang === 'en' ? 'Frequently Asked' : 'Domande frequenti'}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory">
                {lang === 'de' ? 'Noch Fragen?' : lang === 'en' ? 'Still have questions?' : 'Avete domande?'}
              </h3>
              <p className="text-ivory/40 text-sm font-body mt-1">
                {lang === 'de' ? 'Reservierungen, Zimmer, Öffnungszeiten und Events.' : lang === 'en' ? 'Reservations, rooms, hours and events.' : 'Prenotazioni, camere, orari ed eventi.'}
              </p>
            </div>
            <Link to="/faq" className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 btn-ghost-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold">
              {lang === 'de' ? 'Zur FAQ' : lang === 'en' ? 'View FAQ' : 'Leggi FAQ'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-5 bg-espresso border-t border-[#C9A96E]/10">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gold text-[10px] tracking-[0.45em] uppercase font-body mb-4">Krone Langenburg by Ammesso</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory mb-3 leading-[1.05]">{c.cta_title}</h2>
            <p className="text-ivory/40 font-body text-sm mb-8 sm:mb-10 max-w-sm mx-auto">{c.cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/reserve"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 btn-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold shadow-gold-glow">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {c.reserve}
              </Link>
              <a href={`tel:${s.phone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 btn-ghost-gold rounded-full text-xs tracking-[0.2em] uppercase font-body font-semibold">
                <Phone className="w-3.5 h-3.5" /> {c.phone_cta}
              </a>
            </div>
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-ivory/25 text-xs font-body flex-wrap">
              <MapPin className="w-3 h-3" />
              <span>{s.address_street} · {s.address_zip} {s.address_city}</span>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}