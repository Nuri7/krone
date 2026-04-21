import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Wine, Sparkles, Leaf, AlertCircle } from 'lucide-react';
import { FOOD_MENU, DRINKS_MENU, SECTION_LABELS } from '@/lib/menuData';
import { formatPrice } from '@/lib/utils';
import { FadeUp } from '@/components/shared/Animations';

const FOOD_SECTIONS = ['starters', 'mains', 'meat_fish', 'sides', 'desserts'];
const DRINK_SECTIONS = ['aperitifs', 'white_wine', 'red_wine', 'beer', 'soft', 'digestifs'];

function MenuItem({ item }) {
  return (
    <div className="py-4 border-b border-[#C9A96E]/06 last:border-0 group">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="font-display text-lg text-ivory group-hover:text-gold transition-colors">
            {item.name}
          </h4>
          {item.desc && (
            <p className="text-ivory/30 font-body text-sm mt-1 leading-relaxed">{item.desc}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          {item.variants ? (
            <div className="space-y-0.5">
              {item.variants.map(v => (
                <div key={v.label} className="flex items-center gap-2">
                  <span className="text-ivory/20 text-xs font-body">{v.label}</span>
                  <span className="text-gold font-body text-sm font-medium">{formatPrice(v.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <span className="text-gold font-body text-sm font-medium">{formatPrice(item.price)}</span>
              {item.price_with && (
                <div className="text-ivory/20 text-xs font-body mt-0.5">
                  {item.option}: {formatPrice(item.price_with)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [tab, setTab] = useState('food');

  const sections = tab === 'food' ? FOOD_SECTIONS : DRINK_SECTIONS;
  const data = tab === 'food' ? FOOD_MENU : DRINKS_MENU;

  return (
    <div className="bg-charcoal pt-24 sm:pt-28">
      {/* Header */}
      <section className="px-5 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">
            Kulinarium by Ammesso
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mt-3 mb-4">
            Our Menu
          </h1>
          <p className="text-ivory/40 font-body text-base max-w-xl mx-auto">
            Authentic Mediterranean flavours, handcrafted with passion. All pasta, sauces and desserts are freshly prepared.
          </p>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="sticky top-16 md:top-20 z-20 bg-charcoal/95 backdrop-blur-xl border-y border-[#C9A96E]/08">
        <div className="max-w-4xl mx-auto px-5 flex">
          <button
            onClick={() => setTab('food')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-[0.15em] uppercase font-body font-semibold border-b-2 transition-all ${
              tab === 'food'
                ? 'text-gold border-gold'
                : 'text-ivory/30 border-transparent hover:text-ivory/50'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" /> Food
          </button>
          <button
            onClick={() => setTab('drinks')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-[0.15em] uppercase font-body font-semibold border-b-2 transition-all ${
              tab === 'drinks'
                ? 'text-gold border-gold'
                : 'text-ivory/30 border-transparent hover:text-ivory/50'
            }`}
          >
            <Wine className="w-3.5 h-3.5" /> Drinks
          </button>
        </div>
      </div>

      {/* Menu Sections */}
      <section className="py-12 sm:py-16 px-5">
        <div className="max-w-3xl mx-auto">
          {sections.map(section => (
            <FadeUp key={section}>
              <div className="mb-12 last:mb-0">
                <h2 className="font-display text-2xl sm:text-3xl text-ivory mb-1">
                  {SECTION_LABELS[section]}
                </h2>
                <div className="w-8 h-px bg-gradient-to-r from-gold to-transparent mb-6" />
                <div>
                  {data[section].map((item, i) => (
                    <MenuItem key={i} item={item} />
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 px-5 bg-espresso">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "Fresh Daily", desc: "All pasta and sauces made in-house" },
            { icon: Leaf, title: "Dietary Options", desc: "Vegetarian & gluten-free available" },
            { icon: AlertCircle, title: "Allergens", desc: "Please inform staff of any allergies" },
          ].map((card, i) => (
            <div key={i} className="glass-card rounded-xl p-5 text-center">
              <card.icon className="w-4 h-4 text-gold mx-auto mb-2" />
              <h3 className="text-ivory text-sm font-body font-medium">{card.title}</h3>
              <p className="text-ivory/30 text-xs font-body mt-1">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-display text-3xl text-ivory mb-2">Hungry?</h2>
            <p className="text-ivory/35 font-body text-sm mb-6">Reserve your table now</p>
            <Link to="/reserve"
              className="inline-flex items-center gap-2 px-8 py-4 btn-gold rounded-full text-[11px] tracking-[0.15em] uppercase font-body font-semibold">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Reserve a Table
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Legal note */}
      <div className="px-5 pb-8">
        <p className="text-center text-ivory/15 text-xs font-body max-w-lg mx-auto">
          All prices include VAT. Menu items and prices may change seasonally. 
          Images are for illustration purposes. Please inform our staff about allergies and intolerances.
        </p>
      </div>
    </div>
  );
}
