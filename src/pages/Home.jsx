import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Star, UtensilsCrossed, BedDouble, Clock, Users,
  Heart, Award, MapPin, Sparkles, ArrowRight, Quote
} from 'lucide-react';
import { SITE, CHEF, ROOMS } from '@/lib/siteData';
import { FadeUp, StaggerChildren } from '@/components/shared/Animations';
import { useIsMobile } from '@/hooks/useResponsive';
import { asset } from '@/lib/assets';

// Hero images
const HERO_IMAGES = [
  {
    url: asset("/images/hero-restaurant.png"),
    title: "Culinary Excellence",
    sub: "Mediterranean soul, German heart",
  },
  {
    url: asset("/images/hero-pasta.png"),
    title: "Handcrafted with Love",
    sub: "Every dish tells a story",
  },
  {
    url: asset("/images/hero-exterior.png"),
    title: "Historic Elegance",
    sub: "Rooms in the heart of Langenburg",
  },
  {
    url: asset("/images/hero-wedding.png"),
    title: "Unforgettable Moments",
    sub: "Weddings, events & celebrations",
  },
];

const GALLERY_STRIP = [
  asset("/images/hero-restaurant.png"),
  asset("/images/hero-pasta.png"),
  asset("/images/food-ingredients.png"),
  asset("/images/hero-exterior.png"),
  asset("/images/room-suite.png"),
  asset("/images/hero-wedding.png"),
];

const TRUST_PILLARS = [
  { icon: Heart, title: "Made with Love", desc: "Every dish is handcrafted with passion and the finest ingredients" },
  { icon: Award, title: "Authentic Recipes", desc: "Traditional Mediterranean recipes passed down through generations" },
  { icon: Users, title: "120 Seats", desc: "Intimate dining rooms plus a beautiful summer terrace" },
  { icon: MapPin, title: "Historic Location", desc: "In the heart of Langenburg, surrounded by Hohenlohe's beauty" },
];

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const isMobile = useIsMobile();

  // Auto-advance hero
  const nextHero = useCallback(() => {
    setHeroIndex(prev => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextHero, 5500);
    return () => clearInterval(timer);
  }, [nextHero]);

  return (
    <div className="bg-charcoal">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen overflow-hidden" id="hero">
        {/* Background images with crossfade */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              i === heroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover scale-[1.05]"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-charcoal/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-24 sm:pb-32 px-5">
          <div className="max-w-7xl mx-auto w-full">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-sm mb-6 animate-fade-in">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-gold text-[10px] tracking-[0.25em] uppercase font-body font-medium">
                {SITE.tagline}
              </span>
            </div>

            {/* Hero text with slide */}
            <div className="relative h-[120px] sm:h-[140px] mb-4 overflow-hidden">
              {HERO_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-[800ms] ease-out ${
                    i === heroIndex
                      ? 'opacity-100 translate-y-0'
                      : i < heroIndex || (heroIndex === 0 && i === HERO_IMAGES.length - 1)
                        ? 'opacity-0 -translate-y-8'
                        : 'opacity-0 translate-y-8'
                  }`}
                >
                  <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-ivory leading-[0.95]">
                    {img.title}
                  </h1>
                  <p className="font-display text-lg sm:text-xl text-ivory/50 italic mt-3">
                    {img.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link to="/reserve"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5" /> Reserve a Table
              </Link>
              <Link to="/rooms"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-ghost-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                <BedDouble className="w-3.5 h-3.5" /> Explore Rooms
              </Link>
            </div>

            {/* Hero indicators */}
            <div className="flex gap-2 mt-8">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    i === heroIndex ? 'w-8 bg-gold' : 'w-4 bg-ivory/15 hover:bg-ivory/30'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ OPENING HOURS BAR ═══════════════ */}
      <section className="bg-espresso border-y border-[#C9A96E]/10">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-ivory/50 text-sm font-body">
              <span className="text-ivory/30">Mon</span> Closed &nbsp;·&nbsp;
              <span className="text-ivory/30">Tue–Sat</span> 12:00–14:30 &amp; 17:30–22:00 &nbsp;·&nbsp;
              <span className="text-ivory/30">Sun</span> 12:00–20:00
            </span>
          </div>
          <a href={`tel:${SITE.phone}`} className="text-gold text-sm font-body hover:text-gold-light transition-colors">
            {SITE.phone}
          </a>
        </div>
      </section>

      {/* ═══════════════ DINING SECTION ═══════════════ */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
                Kulinarium by Ammesso
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory mt-3 mb-4">
                Where Home Tastes Real
              </h2>
              <div className="section-divider mb-6" />
              <p className="text-ivory/40 font-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Mediterranean cuisine with genuine warmth. Fresh ingredients, honest flavours,
                and recipes passed down through generations — served in the historic heart of Langenburg.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Large image */}
            <FadeUp className="md:row-span-2">
              <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] md:h-full">
                <img
                  src={asset("/images/hero-pasta.png")}
                  alt="Fresh pasta"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-2xl text-ivory mb-1">From the Kitchen</h3>
                  <p className="text-ivory/50 text-sm font-body">Handmade pasta, fresh daily</p>
                </div>
              </div>
            </FadeUp>
            {/* Two smaller images */}
            <FadeUp delay={100}>
              <div className="relative group rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src={asset("/images/food-ingredients.png")}
                  alt="Mediterranean dishes"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent" />
                <div className="absolute bottom-5 left-5">
                  <h3 className="font-display text-xl text-ivory">Mediterranean Flavours</h3>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="relative group rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src={asset("/images/hero-restaurant.png")}
                  alt="Restaurant ambiance"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent" />
                <div className="absolute bottom-5 left-5">
                  <h3 className="font-display text-xl text-ivory">Warm Ambiance</h3>
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp>
            <div className="text-center mt-10">
              <Link to="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                View Our Menu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════ ROOMS SECTION ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 bg-espresso relative">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
                Stay With Us
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory mt-3 mb-4">
                Rooms & Suites
              </h2>
              <div className="section-divider mb-6" />
              <p className="text-ivory/40 font-body text-base max-w-xl mx-auto">
                Wake up in the historic heart of Langenburg. Our individually designed rooms offer comfort, character and charm.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {ROOMS.map((room, i) => (
              <FadeUp key={room.id} delay={i * 80}>
                <div className="group glass-card rounded-2xl overflow-hidden hover-lift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-charcoal/80 backdrop-blur px-3 py-1 rounded-full">
                      <span className="text-gold text-xs font-body font-medium">{room.size_m2} m²</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-ivory mb-1">{room.name}</h3>
                    <p className="text-ivory/35 text-sm font-body mb-3">{room.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {room.features.slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] text-gold/70 bg-gold/8 px-2.5 py-1 rounded-full font-body">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="text-center mt-10">
              <Link to="/rooms"
                className="inline-flex items-center gap-2 px-8 py-4 btn-ghost-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                <BedDouble className="w-3.5 h-3.5" /> Explore All Rooms
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════ GALLERY STRIP ═══════════════ */}
      <section className="py-2 overflow-hidden">
        <div className="flex gap-2 w-max animate-[scroll_30s_linear_infinite]"
          style={{
            animation: 'scroll 30s linear infinite',
          }}>
          {[...GALLERY_STRIP, ...GALLERY_STRIP].map((img, i) => (
            <div key={i} className="w-48 sm:w-64 aspect-square rounded-xl overflow-hidden flex-shrink-0">
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ═══════════════ TRUST PILLARS ═══════════════ */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_PILLARS.map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-6 sm:p-7 text-center hover-lift group">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gold/8 flex items-center justify-center mb-4 group-hover:bg-gold/15 transition-colors">
                  <p.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-lg text-ivory mb-2">{p.title}</h3>
                <p className="text-ivory/35 text-sm font-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════════════ CHEF & STORY ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 bg-espresso">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-premium">
                  <img
                    src={CHEF.image}
                    alt={CHEF.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent" />
                </div>
                {/* Floating quote card */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 glass-card rounded-xl p-4 sm:p-5 max-w-[240px] shadow-card">
                  <Quote className="w-4 h-4 text-gold mb-2" />
                  <p className="font-display text-sm text-ivory italic leading-relaxed">
                    "{CHEF.quote}"
                  </p>
                  <p className="text-gold text-xs font-body mt-2 font-medium">{CHEF.name}</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div>
                <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
                  Meet the Chef
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory mt-3 mb-4">
                  {CHEF.name}
                </h2>
                <div className="w-10 h-px bg-gradient-to-r from-gold to-transparent mb-6" />
                <p className="text-ivory/40 font-body text-base leading-relaxed mb-6">
                  {CHEF.bio}
                </p>
                <Link to="/story"
                  className="inline-flex items-center gap-2 text-gold font-body text-sm font-medium hover:text-gold-light transition-colors group">
                  Read Our Story <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════ WEDDINGS CTA ═══════════════ */}
      <section className="relative py-28 sm:py-36 px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={asset("/images/hero-wedding.png")}
            alt="Wedding setup"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-charcoal/75" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
              Celebrate with Us
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory mt-4 mb-6">
              Your Dream Event<br />
              <span className="gold-text-gradient">Starts Here</span>
            </h2>
            <p className="text-ivory/50 font-body text-lg max-w-lg mx-auto mb-8">
              From intimate weddings to corporate dinners — let us create something
              unforgettable in our historic venue.
            </p>
            <Link to="/weddings"
              className="inline-flex items-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
              Plan Your Event <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════ REVIEWS ═══════════════ */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
                Guest Reviews
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory mt-3">
                What Our Guests Say
              </h2>
            </div>
          </FadeUp>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Michael H.", text: "Absolutely outstanding pasta. The Carbonara is the best I've ever had outside of Rome. The atmosphere is perfect — candlelit, intimate, and welcoming.", stars: 5 },
              { name: "Julia R.", text: "We celebrated our anniversary here and were blown away. The food, the service, the room — everything was perfect. Chef Ammesso even came to our table!", stars: 5 },
              { name: "Thomas W.", text: "What a gem in Langenburg! The Mediterranean flavors are authentic, the wine selection is excellent, and the historic building adds such charm.", stars: 5 },
            ].map((review, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 sm:p-7 hover-lift">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.stars }, (_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-ivory/50 font-body text-sm leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <p className="text-gold text-sm font-body font-medium">{review.name}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-20 sm:py-28 px-5 bg-espresso">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory mb-4">
              Ready to Experience <span className="gold-text-gradient">Krone Langenburg</span>?
            </h2>
            <p className="text-ivory/40 font-body text-base mb-8 max-w-lg mx-auto">
              Reserve your table, book a room, or simply say hello. We look forward to welcoming you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/reserve"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5" /> Reserve a Table
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-ghost-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                Get in Touch
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
