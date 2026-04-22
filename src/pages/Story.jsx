import { Link } from 'react-router-dom';
import { Heart, Flame, Users, Quote, ArrowRight } from 'lucide-react';
import { CHEF } from '@/lib/siteData';
import { FadeUp } from '@/components/shared/Animations';
import { asset } from '@/lib/assets';

const VALUES = [
  { icon: Flame, title: "Passion", desc: "Cooking is not a job — it's a calling. Every dish carries the fire that drives us." },
  { icon: Heart, title: "Warmth", desc: "We don't have customers — we have guests. You are part of the family the moment you walk in." },
  { icon: Users, title: "Community", desc: "A restaurant lives through its people. We bring Langenburg together, one meal at a time." },
];

export default function Story() {
  return (
    <div className="bg-charcoal">
      {/* Hero */}
      <section className="relative h-[55vh] sm:h-[65vh] overflow-hidden">
        <img
          src={asset("/images/hero-restaurant.png")}
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-14 px-5">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
              Our Story
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mt-2">
              Mediterranean Soul,<br />
              <span className="gold-text-gradient">Hohenlohe Heart</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Brand Quote */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <Quote className="w-8 h-8 text-gold/30 mx-auto mb-6" />
            <p className="font-display text-2xl sm:text-3xl text-ivory/80 italic leading-relaxed">
              "When someone asks where Krone Langenburg comes from — it comes from the kitchen. From a boy who grew up 
              between two worlds and found his home in cooking."
            </p>
            <p className="text-gold font-body text-sm font-medium mt-6">— {CHEF.name}</p>
          </FadeUp>
        </div>
      </section>

      {/* Story Text */}
      <section className="pb-20 sm:pb-28 px-5">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-ivory/50 font-body text-base leading-relaxed mb-6">
                Krone Langenburg is more than a hotel and restaurant — it is a declaration of love. To a town with a proud history, 
                to a cuisine that nourishes the soul, and to the belief that hospitality is not a service but a gift.
              </p>
              <p className="text-ivory/50 font-body text-base leading-relaxed mb-6">
                The historic Krone building stands in the heart of Langenburg, a medieval town perched above the Jagst valley 
                in the Hohenlohe region of Baden-Württemberg. When Omar Ammesso first stepped through these doors, he saw more 
                than walls and a kitchen — he saw a home.
              </p>
              <p className="text-ivory/50 font-body text-base leading-relaxed">
                Today, Krone Langenburg brings together the warmth of Mediterranean cuisine with the honesty and heart of Hohenlohe. 
                Every dish is a bridge between cultures, every guest is family, and every evening is a celebration of what food 
                was always meant to be: a way to bring people together.
              </p>
            </div>
          </FadeUp>
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
                The Man Behind the Kitchen
              </span>
              <h2 className="font-display text-4xl font-light text-ivory mt-2 mb-2">{CHEF.name}</h2>
              <p className="text-gold/50 font-body text-xs tracking-wider mb-6">{CHEF.full_name}</p>
              <p className="text-ivory/40 font-body text-base leading-relaxed mb-8">{CHEF.bio}</p>
              <div className="glass-card rounded-xl p-5 inline-block">
                <Quote className="w-4 h-4 text-gold mb-2" />
                <p className="font-display text-base text-ivory italic">"{CHEF.quote}"</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-ivory">What We Stand For</h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 60}>
                <div className="glass-card rounded-2xl p-7 text-center hover-lift">
                  <v.icon className="w-6 h-6 text-gold mx-auto mb-4" />
                  <h3 className="font-display text-xl text-ivory mb-2">{v.title}</h3>
                  <p className="text-ivory/35 text-sm font-body leading-relaxed">{v.desc}</p>
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
            <h2 className="font-display text-3xl text-ivory mb-6">Come See for Yourself</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/reserve"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                Reserve a Table
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-ghost-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
                Contact Us
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
