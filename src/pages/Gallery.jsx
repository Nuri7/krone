import { useState } from 'react';
import { Grid3X3, Rows3, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeUp } from '@/components/shared/Animations';

const CATEGORIES = ['All', 'Restaurant', 'Food', 'Rooms', 'Events', 'Langenburg'];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", cat: "Food", alt: "Fine dining" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", cat: "Restaurant", alt: "Dining room" },
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", cat: "Rooms", alt: "Single room" },
  { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", cat: "Food", alt: "Appetiser" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", cat: "Events", alt: "Wedding" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", cat: "Restaurant", alt: "Bar" },
  { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", cat: "Rooms", alt: "Double room" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", cat: "Food", alt: "Mediterranean" },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", cat: "Rooms", alt: "Suite" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80", cat: "Food", alt: "Meat dish" },
  { src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80", cat: "Food", alt: "Pasta" },
  { src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", cat: "Langenburg", alt: "Town view" },
  { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", cat: "Food", alt: "Cooking" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80", cat: "Events", alt: "Reception" },
  { src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80", cat: "Langenburg", alt: "Historic" },
  { src: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=800&q=80", cat: "Food", alt: "Fresh pasta" },
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
