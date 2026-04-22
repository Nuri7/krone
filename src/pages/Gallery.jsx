import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeUp } from '@/components/shared/Animations';
import { asset } from '@/lib/assets';

const CATEGORIES = ['All', 'Restaurant', 'Food', 'Rooms', 'Events', 'Langenburg'];

const PHOTOS = [
  { src: asset("/images/hero-pasta.png"), cat: "Food", alt: "Fresh handmade pasta" },
  { src: asset("/images/hero-restaurant.png"), cat: "Restaurant", alt: "Dining room interior" },
  { src: asset("/images/room-single.png"), cat: "Rooms", alt: "Deluxe single room" },
  { src: asset("/images/food-ingredients.png"), cat: "Food", alt: "Fresh Mediterranean ingredients" },
  { src: asset("/images/hero-wedding.png"), cat: "Events", alt: "Wedding reception setup" },
  { src: asset("/images/hero-exterior.png"), cat: "Langenburg", alt: "Historic hotel exterior" },
  { src: asset("/images/room-double.png"), cat: "Rooms", alt: "Deluxe double room" },
  { src: asset("/images/hero-restaurant.png"), cat: "Restaurant", alt: "Warm restaurant ambiance" },
  { src: asset("/images/room-suite.png"), cat: "Rooms", alt: "King suite" },
  { src: asset("/images/langenburg-town.png"), cat: "Langenburg", alt: "Langenburg hilltop town" },
  { src: asset("/images/hero-pasta.png"), cat: "Food", alt: "Italian pasta dish" },
  { src: asset("/images/hero-wedding.png"), cat: "Events", alt: "Event dining setup" },
];

export default function Gallery() {
  const [cat, setCat] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = cat === 'All' ? PHOTOS : PHOTOS.filter(p => p.cat === cat);

  const openLightbox = (i) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const nextPhoto = () => setLightbox(i => (i + 1) % filtered.length);

  return (
    <div className="bg-charcoal pt-24 sm:pt-28 pb-20">
      <section className="px-5 mb-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mb-4">Gallery</h1>
          <p className="text-ivory/40 font-body text-base max-w-lg mx-auto">
            A glimpse into our world — the food, the spaces, the moments.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="px-5 mb-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-body font-medium transition-all ${
                cat === c ? 'bg-gold text-charcoal' : 'bg-ivory/5 text-ivory/40 hover:text-ivory/60 hover:bg-ivory/8'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((photo, i) => (
            <div key={i} className="rounded-xl overflow-hidden cursor-pointer group aspect-square"
              onClick={() => openLightbox(i)}>
              <img src={photo.src} alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="px-5 mt-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/reserve" className="glass-card rounded-2xl p-8 text-center hover-lift group">
            <h3 className="font-display text-2xl text-ivory mb-2 group-hover:text-gold transition-colors">Reserve a Table</h3>
            <p className="text-ivory/30 text-sm font-body">Taste it for yourself</p>
          </Link>
          <Link to="/rooms" className="glass-card rounded-2xl p-8 text-center hover-lift group">
            <h3 className="font-display text-2xl text-ivory mb-2 group-hover:text-gold transition-colors">Book a Room</h3>
            <p className="text-ivory/30 text-sm font-body">Stay in the heart of Langenburg</p>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <ChevronRight className="w-5 h-5" />
          </button>
          <img src={filtered[lightbox]?.src} alt={filtered[lightbox]?.alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
