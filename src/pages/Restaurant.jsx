import { Link } from 'react-router-dom';
import { Clock, Leaf, UtensilsCrossed, Quote, ArrowRight, ChefHat, AlertCircle } from 'lucide-react';
import { SITE, CHEF } from '@/lib/siteData';
import { FadeUp } from '@/components/shared/Animations';

export default function Restaurant() {
  return (
    <div className="bg-charcoal">
      {/* Hero */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <img
          src="/images/hero-restaurant.png"
          alt="Kulinarium dining room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-16 px-5">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
              Kulinarium by Ammesso
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-ivory mt-2">
              The Restaurant
            </h1>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <Quote className="w-8 h-8 text-gold/30 mx-auto mb-6" />
            <blockquote className="font-display text-2xl sm:text-3xl text-ivory/80 italic leading-relaxed mb-6">
              "Cooking is emotion on a plate. I want you to taste where I come from — the warmth, the love, the stories around my grandmother's table."
            </blockquote>
            <p className="text-gold font-body text-sm font-medium">— {CHEF.name}, Head Chef</p>
          </FadeUp>
        </div>
      </section>

      {/* Opening Hours Card */}
      <section className="px-5 -mt-6">
        <div className="max-w-md mx-auto">
          <FadeUp>
            <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
              <Clock className="w-5 h-5 text-gold mx-auto mb-4" />
              <h3 className="font-display text-xl text-ivory mb-4">Opening Hours</h3>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-ivory/25">
                  <span>Monday</span><span>Closed</span>
                </div>
                <div className="flex justify-between text-ivory/50">
                  <span>Tue – Sat (Lunch)</span><span className="text-ivory/70">12:00 – 14:30</span>
                </div>
                <div className="flex justify-between text-ivory/50">
                  <span>Tue – Sat (Dinner)</span><span className="text-ivory/70">17:30 – 22:00</span>
                </div>
                <div className="flex justify-between text-ivory/50">
                  <span>Sunday</span><span className="text-ivory/70">12:00 – 20:00</span>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { src: "/images/hero-pasta.png", alt: "Fine dining plate" },
            { src: "/images/food-ingredients.png", alt: "Mediterranean spread" },
            { src: "/images/hero-restaurant.png", alt: "Restaurant interior" },
          ].map((img, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] group">
                <img src={img.src} alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-20 sm:py-28 px-5 bg-espresso">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeUp>
            <div className="rounded-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto shadow-premium">
              <img src={CHEF.image} alt={CHEF.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div>
              <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
                Your Host
              </span>
              <h2 className="font-display text-4xl font-light text-ivory mt-2 mb-2">{CHEF.name}</h2>
              <p className="text-gold/60 font-body text-xs tracking-wider mb-6">{CHEF.title}</p>
              <p className="text-ivory/40 font-body text-sm leading-relaxed mb-6">{CHEF.bio}</p>
              <Link to="/story" className="inline-flex items-center gap-2 text-gold text-sm font-body font-medium hover:text-gold-light transition-colors group">
                Our Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Experience Notes */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-ivory">Good to Know</h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ChefHat, title: "Fresh & Handmade", desc: "Every pasta, every sauce, every dessert — made fresh in our kitchen with love." },
              { icon: Leaf, title: "Dietary Needs", desc: "Vegetarian, vegan and gluten-free options available. Please let us know when booking." },
              { icon: AlertCircle, title: "Timing", desc: "Kitchen opens at the start of each service. Last orders 30 minutes before closing." },
            ].map((note, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="glass-card rounded-2xl p-6 text-center hover-lift">
                  <note.icon className="w-5 h-5 text-gold mx-auto mb-3" />
                  <h3 className="font-display text-lg text-ivory mb-2">{note.title}</h3>
                  <p className="text-ivory/35 text-sm font-body">{note.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 bg-espresso">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-display text-3xl text-ivory mb-6">Ready to Dine?</h2>
            <Link to="/reserve"
              className="inline-flex items-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Reserve a Table
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
