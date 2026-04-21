import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeUp } from '@/components/shared/Animations';

const FAQ_SECTIONS = [
  {
    title: "Restaurant & Dining",
    items: [
      { q: "Do I need a reservation?", a: "We highly recommend reservations, especially for dinner and weekends. Walk-ins are welcome but subject to availability." },
      { q: "What cuisine do you serve?", a: "We serve authentic Mediterranean cuisine with Italian and Southern European influences, using fresh, seasonal ingredients." },
      { q: "Do you accommodate dietary restrictions?", a: "Yes! We offer vegetarian, vegan, and gluten-free options. Please mention any allergies when booking." },
      { q: "Can I see the menu before visiting?", a: "Absolutely — our full menu with current prices is available on our Menu page." },
      { q: "Is the kitchen open all day?", a: "Tue–Sat: lunch 12:00–14:30, dinner 17:30–22:00. Sunday: 12:00–20:00 (continuous). We're closed on Mondays." },
    ]
  },
  {
    title: "Hotel & Rooms",
    items: [
      { q: "What room types do you offer?", a: "We have three room categories: Deluxe Single (18m²), Deluxe Double (26m²), and King Suite (42m²)." },
      { q: "Is breakfast included?", a: "Breakfast is available as an add-on for €14 per person per night." },
      { q: "What's the check-in / check-out time?", a: "Check-in from 15:00, check-out by 11:00. Early/late arrangements possible on request." },
      { q: "Is parking available?", a: "Free parking is available nearby. We'll share directions upon booking confirmation." },
    ]
  },
  {
    title: "Events & Weddings",
    items: [
      { q: "Can I host a wedding at Krone?", a: "Yes! We host weddings from intimate ceremonies to celebrations of up to 120 guests. Contact us for a personal consultation." },
      { q: "Do you offer custom menus for events?", a: "Absolutely. Our chef creates bespoke menus tailored to your preferences and event type." },
      { q: "How far in advance should I book?", a: "For weddings, we recommend 6–12 months in advance. For other events, 2–4 weeks is usually sufficient." },
    ]
  },
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#C9A96E]/08 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors pr-4">{item.q}</span>
        <ChevronDown className={`w-4 h-4 text-gold flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-ivory/35 text-sm font-body leading-relaxed pr-8">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="bg-charcoal pt-24 sm:pt-28 pb-20">
      <section className="px-5 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl font-light text-ivory mb-4">Frequently Asked Questions</h1>
          <p className="text-ivory/40 font-body text-base">Everything you need to know about Krone Langenburg.</p>
        </div>
      </section>

      <section className="px-5">
        <div className="max-w-3xl mx-auto space-y-10">
          {FAQ_SECTIONS.map((section, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div>
                <h2 className="font-display text-2xl text-ivory mb-4">{section.title}</h2>
                <div className="glass-card rounded-2xl px-6">
                  {section.items.map((item, j) => <AccordionItem key={j} item={item} />)}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
