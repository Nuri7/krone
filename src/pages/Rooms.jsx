import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Wifi, Wind, Bath, Star, MapPin, Check, ExternalLink, Users, Ruler } from 'lucide-react';
import { SITE, ROOMS, AMENITIES } from '@/lib/siteData';
import { FadeUp } from '@/components/shared/Animations';

export default function Rooms() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="bg-charcoal">
      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1800&q=80"
          alt="Hotel room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-14 px-5">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
              Krone Langenburg
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mt-2">
              Rooms & Suites
            </h1>
          </div>
        </div>
      </section>

      {/* Room Cards */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="text-ivory/40 font-body text-base max-w-xl mx-auto">
                Wake up in the historic heart of Langenburg. Each room is individually designed
                with a blend of historic charm and modern comfort.
              </p>
            </div>
          </FadeUp>

          <div className="space-y-6">
            {ROOMS.map((room, i) => (
              <FadeUp key={room.id} delay={i * 80}>
                <div className="glass-card rounded-2xl overflow-hidden lg:flex group">
                  {/* Image */}
                  <div className="lg:w-[45%] relative overflow-hidden">
                    <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-charcoal/80 backdrop-blur px-3 py-1 rounded-full text-gold text-xs font-body font-medium flex items-center gap-1">
                        <Ruler className="w-3 h-3" /> {room.size_m2} m²
                      </span>
                      <span className="bg-charcoal/80 backdrop-blur px-3 py-1 rounded-full text-gold text-xs font-body font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" /> {room.max_guests}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-[55%] p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl text-ivory mb-2">{room.name}</h2>
                      <p className="text-ivory/35 font-body text-sm mb-1">{room.description}</p>
                      <p className="text-ivory/25 font-body text-xs mb-5">🛏 {room.bed}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {room.features.map(f => (
                          <span key={f} className="flex items-center gap-1 text-xs text-ivory/50 bg-ivory/5 px-3 py-1.5 rounded-lg font-body">
                            <Check className="w-3 h-3 text-gold" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 btn-gold rounded-full text-[10px] tracking-[0.15em] uppercase font-body font-semibold"
                    >
                      <BedDouble className="w-3.5 h-3.5" /> Check Availability
                    </button>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 px-5 bg-espresso">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl text-ivory">All Rooms Include</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {AMENITIES.map(a => (
                <div key={a} className="glass-card rounded-xl p-4 text-center">
                  <Check className="w-4 h-4 text-gold mx-auto mb-2" />
                  <span className="text-ivory/50 text-xs font-body">{a}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-ivory/30 font-body text-sm mt-6">
              Breakfast available: €{SITE.breakfast_price} per person
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Location & Map */}
      <section className="py-16 sm:py-24 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <FadeUp>
            <div>
              <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
                Location
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ivory mt-2 mb-4">
                Discover Langenburg
              </h2>
              <p className="text-ivory/40 font-body text-sm leading-relaxed mb-6">
                Langenburg is a jewel in the Hohenlohe region of Baden-Württemberg. Perched above the Jagst valley, 
                this medieval town is home to a magnificent Renaissance castle, charming half-timbered houses, 
                and some of Germany's most beautiful countryside.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Langenburg Castle & Classic Car Museum",
                  "Hohenlohe Nature Park — hiking & cycling",
                  "Historic old town with artisan shops",
                  "Wine tasting in the Jagst valley",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-ivory/40 text-sm font-body">
                    <MapPin className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <a href={SITE.maps_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold text-sm font-body font-medium hover:text-gold-light transition-colors">
                Get Directions <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-espresso">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${SITE.maps_embed_key}&q=Hauptstra%C3%9Fe+24%2C+74595+Langenburg&maptype=roadmap`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="Krone Langenburg location"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/90 backdrop-blur" onClick={() => setShowBooking(false)} />
          <div className="relative w-full max-w-3xl h-[80vh] glass-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-charcoal/80 flex items-center justify-center text-ivory/50 hover:text-ivory"
            >
              ✕
            </button>
            <iframe
              src={`${SITE.beds24_booking_url}&lang=en`}
              className="w-full h-full border-0"
              title="Book a room"
            />
          </div>
        </div>
      )}
    </div>
  );
}
