import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, BedDouble } from 'lucide-react';

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", cat: 'dining', de: 'Kulinarium — Abendstimmung', en: 'Kulinarium — Evening atmosphere', it: 'Kulinarium — Atmosfera serale' },
  { src: "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1551183053-bf91798d792e?w=600&q=80", cat: 'dining', de: 'Handgemachte Pasta', en: 'Handmade Pasta', it: 'Pasta fatta a mano' },
  { src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80", cat: 'dining', de: 'Mediterrane Küche', en: 'Mediterranean cuisine', it: 'Cucina mediterranea' },
  { src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80", cat: 'dining', de: 'Frische Zutaten', en: 'Fresh ingredients', it: 'Ingredienti freschi' },
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", cat: 'rooms', de: 'Deluxe Einzelzimmer', en: 'Deluxe Single Room', it: 'Camera Singola Deluxe' },
  { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80", cat: 'rooms', de: 'Deluxe Doppelzimmer', en: 'Deluxe Double Room', it: 'Camera Doppia Deluxe' },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80", cat: 'rooms', de: 'King Suite', en: 'King Suite', it: 'King Suite' },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80", cat: 'events', de: 'Hochzeit & Feiern', en: 'Weddings & Events', it: 'Matrimoni & eventi' },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", cat: 'events', de: 'Festlich gedeckte Tafel', en: 'Festive table setting', it: 'Tavola imbandita' },
  { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", cat: 'property', de: 'Krone Langenburg', en: 'Krone Langenburg', it: 'Krone Langenburg' },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", cat: 'property', de: 'Hohenlohe Landschaft', en: 'Hohenlohe landscape', it: 'Paesaggio Hohenlohe' },
  { src: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp", thumb: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp", cat: 'team', de: 'Chef Omar Ammesso', en: 'Chef Omar Ammesso', it: 'Chef Omar Ammesso' },
];

const CAT_LABELS = {
  de: { all: 'Alle', dining: 'Restaurant', rooms: 'Zimmer', events: 'Events', property: 'Das Haus', team: 'Team' },
  en: { all: 'All', dining: 'Restaurant', rooms: 'Rooms', events: 'Events', property: 'The Property', team: 'Team' },
  it: { all: 'Tutto', dining: 'Ristorante', rooms: 'Camere', events: 'Eventi', property: 'La struttura', team: 'Team' },
};

export default function Gallery() {
  const { lang } = useLang();
  const [activecat, setActiveCat] = useState('all');
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const labels = CAT_LABELS[lang] || CAT_LABELS.de;
  const cats = ['all', 'dining', 'rooms', 'events', 'property', 'team'];
  const filtered = activecat === 'all' ? GALLERY : GALLERY.filter(g => g.cat === activecat);

  function openLightbox(idx) { setLightboxIdx(idx); }
  function closeLightbox() { setLightboxIdx(null); }
  function prev() { setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length); }
  function next() { setLightboxIdx(i => (i + 1) % filtered.length); }

  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, filtered.length]);

  const currentImg = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-24 lg:pb-10">

      {/* Header */}
      <div className="bg-espresso pt-20 sm:pt-24 pb-10 sm:pb-14 px-5 border-b border-[#C9A96E]/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/40" />
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-body">Krone Langenburg by Ammesso</p>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ivory mb-3 sm:mb-4">
            {lang === 'de' ? 'Galerie' : lang === 'en' ? 'Gallery' : 'Galleria'}
          </h1>
          <p className="text-ivory/40 font-body text-sm max-w-md mx-auto">
            {lang === 'de' ? 'Eindrücke aus unserem Restaurant, unseren Zimmern und besonderen Momenten.' : lang === 'en' ? 'Impressions from our restaurant, rooms and special moments.' : 'Impressioni dal nostro ristorante, le nostre camere e i momenti speciali.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {cats.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-body tracking-wider uppercase border transition-all ${activecat === cat ? 'border-gold bg-gold/10 text-gold' : 'border-[#C9A96E]/15 text-ivory/40 hover:border-[#C9A96E]/30 hover:text-ivory/60'}`}>
              {labels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          {filtered.map((img, i) => (
            <div key={i}
              className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer hover-lift"
              onClick={() => openLightbox(i)}>
              <img src={img.thumb} alt={img[lang] || img.de}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-ivory text-xs font-body">{img[lang] || img.de}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-7 text-center">
            <UtensilsCrossed className="w-6 h-6 text-gold/60 mx-auto mb-3" />
            <h3 className="font-display text-xl font-light text-ivory mb-2">
              {lang === 'de' ? 'Erleben Sie das Kulinarium' : lang === 'en' ? 'Experience the Kulinarium' : 'Scopri il Kulinarium'}
            </h3>
            <p className="text-ivory/40 text-xs font-body mb-4">
              {lang === 'de' ? 'Mediterrane Küche mit Herz und Seele.' : lang === 'en' ? 'Mediterranean cuisine with heart and soul.' : 'Cucina mediterranea con cuore e anima.'}
            </p>
            <Link to="/reserve" className="inline-flex items-center gap-1.5 px-5 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve Table' : 'Prenota tavolo'}
            </Link>
          </div>
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-7 text-center">
            <BedDouble className="w-6 h-6 text-gold/60 mx-auto mb-3" />
            <h3 className="font-display text-xl font-light text-ivory mb-2">
              {lang === 'de' ? 'Komfortabel übernachten' : lang === 'en' ? 'Stay in comfort' : 'Soggiorno confortevole'}
            </h3>
            <p className="text-ivory/40 text-xs font-body mb-4">
              {lang === 'de' ? 'Stilvoll schlafen im Herzen Hohenlohes.' : lang === 'en' ? 'Sleep stylishly in the heart of Hohenlohe.' : 'Dormire con stile nel cuore dell\'Hohenlohe.'}
            </p>
            <Link to="/rooms" className="inline-flex items-center gap-1.5 px-5 py-2.5 btn-gold rounded-full text-xs tracking-widest uppercase font-body font-semibold">
              {lang === 'de' ? 'Zimmer ansehen' : lang === 'en' ? 'View Rooms' : 'Vedi camere'}
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {currentImg && (
        <div className="fixed inset-0 z-50 bg-charcoal/97 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-ivory/50 hover:text-ivory transition-colors bg-charcoal/50 rounded-full" onClick={closeLightbox}>
            <X className="w-5 h-5" />
          </button>
          <button className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-ivory/50 hover:text-ivory transition-colors bg-charcoal/50 rounded-full" onClick={e => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-ivory/50 hover:text-ivory transition-colors bg-charcoal/50 rounded-full" onClick={e => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <img src={currentImg.src} alt={currentImg[lang] || currentImg.de}
              className="max-h-[75vh] w-auto max-w-full rounded-xl sm:rounded-2xl object-contain shadow-premium" />
            <p className="text-ivory/40 text-sm font-body mt-3 sm:mt-4 text-center px-4">{currentImg[lang] || currentImg.de}</p>
            <p className="text-ivory/20 text-xs font-body mt-1">{lightboxIdx + 1} / {filtered.length}</p>
            <p className="text-ivory/15 text-[10px] font-body mt-2 sm:hidden">← Wischen zum Navigieren →</p>
          </div>
        </div>
      )}
    </div>
  );
}