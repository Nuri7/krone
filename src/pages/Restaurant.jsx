import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';
import { ArrowRight, Clock, UtensilsCrossed, Star } from 'lucide-react';

const IMG_RESTAURANT = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";
const IMG_FOOD1 = "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80";
const IMG_FOOD2 = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80";
const IMG_CHEF = "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp";

export default function Restaurant() {
  const { lang } = useLang();

  const copy = {
    de: {
      label: 'Kulinarium by Ammesso',
      title: 'Mediterrane Küche mit Herz',
      intro: 'Ehrlich gekochte Gerichte, die Geschichten erzählen. Jede Pasta, jedes Stück Fleisch, jeder Nachtisch ist eine persönliche Aussage des Küchenchefs Omar Ammesso.',
      hours_title: 'Öffnungszeiten',
      mon: 'Montag — Ruhetag',
      tue_sat: 'Dienstag – Samstag',
      tue_sat_hours: '12:00 – 14:30 · 17:30 – 22:00',
      sun: 'Sonntag',
      sun_hours: '12:00 – 20:00',
      cta_reserve: 'Tisch reservieren',
      cta_menu: 'Speisekarte ansehen',
      philosophy_title: 'Unsere Philosophie',
      philosophy: 'Kulinarium by Ammesso steht für mediterrane Leichtigkeit gepaart mit echter Gastfreundschaft. Frische Zutaten, handgemachte Pasta und Gerichte, die Wärme geben — das ist, was wir täglich auftischen.',
      capacity: '120 Sitzplätze · Außenterrasse im Sommer',
      booking_note: 'Gruppen ab 10 Personen bitte direkt per E-Mail anfragen.',
    },
    en: {
      label: 'Kulinarium by Ammesso',
      title: 'Mediterranean Cuisine with Heart',
      intro: 'Honestly cooked dishes that tell stories. Every pasta, every piece of meat, every dessert is a personal statement from head chef Omar Ammesso.',
      hours_title: 'Opening Hours',
      mon: 'Monday — Closed',
      tue_sat: 'Tuesday – Saturday',
      tue_sat_hours: '12:00 – 14:30 · 17:30 – 22:00',
      sun: 'Sunday',
      sun_hours: '12:00 – 20:00',
      cta_reserve: 'Reserve a Table',
      cta_menu: 'View Menu',
      philosophy_title: 'Our Philosophy',
      philosophy: 'Kulinarium by Ammesso stands for Mediterranean lightness paired with genuine hospitality. Fresh ingredients, handmade pasta and dishes that give warmth — that is what we serve every day.',
      capacity: '120 seats · Terrace in summer',
      booking_note: 'Groups of 10+ please enquire directly by email.',
    },
    it: {
      label: 'Kulinarium by Ammesso',
      title: 'Cucina Mediterranea con Cuore',
      intro: 'Piatti cucinati con onestà che raccontano storie. Ogni pasta, ogni carne, ogni dolce è una dichiarazione personale dello chef Omar Ammesso.',
      hours_title: 'Orari di apertura',
      mon: 'Lunedì — Chiuso',
      tue_sat: 'Martedì – Sabato',
      tue_sat_hours: '12:00 – 14:30 · 17:30 – 22:00',
      sun: 'Domenica',
      sun_hours: '12:00 – 20:00',
      cta_reserve: 'Prenota un tavolo',
      cta_menu: 'Vedi il menu',
      philosophy_title: 'La nostra filosofia',
      philosophy: 'Kulinarium by Ammesso rappresenta la leggerezza mediterranea abbinata a una vera ospitalità. Ingredienti freschi, pasta fatta a mano e piatti che scaldano il cuore.',
      capacity: '120 posti · Terrazza in estate',
      booking_note: 'Gruppi di 10+ persone: scrivere direttamente per email.',
    },
  };

  const c = copy[lang] || copy.de;

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[380px] overflow-hidden">
        <img src={IMG_RESTAURANT} alt="Kulinarium by Ammesso" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-end pb-10 px-4">
          <div className="max-w-3xl mx-auto w-full text-white">
            <p className="text-amber-300 text-xs uppercase tracking-widest mb-2">{c.label}</p>
            <h1 className="text-4xl md:text-5xl font-light mb-4">{c.title}</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reserve" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors text-sm">
                <UtensilsCrossed className="w-4 h-4" /> {c.cta_reserve}
              </Link>
              <Link to="/menu" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold rounded-xl transition-colors text-sm border border-white/30">
                {c.cta_menu} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section className="bg-amber-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-700 text-xs uppercase tracking-widest font-semibold mb-3">{c.philosophy_title}</p>
          <p className="text-stone-700 text-lg leading-relaxed">{c.philosophy}</p>
        </div>
      </section>

      {/* Hours + CTA */}
      <section className="bg-stone-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">{c.hours_title}</span>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="text-stone-500">{c.mon}</li>
              <li>
                <span className="text-white font-medium">{c.tue_sat}</span>
                <div className="text-stone-400 text-xs mt-0.5">{c.tue_sat_hours}</div>
              </li>
              <li>
                <span className="text-white font-medium">{c.sun}</span>
                <div className="text-stone-400 text-xs mt-0.5">{c.sun_hours}</div>
              </li>
            </ul>
            <p className="text-stone-500 text-xs mt-5">{c.capacity}</p>
          </div>
          <div className="space-y-3">
            <Link to="/reserve" className="flex items-center justify-center gap-2 w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">
              <UtensilsCrossed className="w-4 h-4" /> {c.cta_reserve}
            </Link>
            <Link to="/menu" className="flex items-center justify-center gap-2 w-full py-4 border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white font-medium rounded-xl transition-colors text-sm">
              {c.cta_menu}
            </Link>
            <p className="text-stone-600 text-xs text-center">{c.booking_note}</p>
          </div>
        </div>
      </section>

      {/* Food imagery grid */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-2xl overflow-hidden h-64 md:col-span-2">
            <img src={IMG_FOOD1} alt="Pasta Ammesso" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="relative rounded-2xl overflow-hidden h-64">
            <img src={IMG_FOOD2} alt="Kulinarium Gericht" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Chef */}
      <section className="bg-stone-50 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden h-80 shadow-xl">
            <img src={IMG_CHEF} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
          </div>
          <div>
            <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-3">
              {lang === 'de' ? 'Chefkoch' : lang === 'en' ? 'Head Chef' : 'Chef'}
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-1">Omar Ammesso</h2>
            <p className="text-stone-400 text-sm italic mb-4">Omar Ouardaoui</p>
            <p className="text-stone-600 leading-relaxed text-sm mb-6">
              {lang === 'de' && 'Seine Leidenschaft fürs Kochen entdeckte er früh — inspiriert von den Aromen seiner Kindheit und einer tiefen Liebe zur mediterranen Küche. Für Ammesso ist Kochen kein Beruf — es ist Sprache, Identität und eine tägliche Liebeserklärung.'}
              {lang === 'en' && 'His passion for cooking emerged early — inspired by the aromas of his childhood and a deep love for Mediterranean cuisine. For Ammesso, cooking is not a profession — it is language, identity and a daily declaration of love.'}
              {lang === 'it' && 'La sua passione per la cucina è nata presto — ispirata dagli aromi della sua infanzia e da un profondo amore per la cucina mediterranea. Per Ammesso, cucinare non è un mestiere — è linguaggio, identità e una quotidiana dichiarazione d\'amore.'}
            </p>
            <Link to="/story" className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors text-sm">
              {lang === 'de' ? 'Unsere Geschichte' : lang === 'en' ? 'Our Story' : 'La nostra storia'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-amber-600 py-12 px-4 text-center text-white">
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-200 text-amber-200" />)}
        </div>
        <h2 className="text-2xl font-light mb-5">
          {lang === 'de' ? 'Reservieren Sie Ihren Tisch' : lang === 'en' ? 'Reserve your table' : 'Prenota il tuo tavolo'}
        </h2>
        <Link to="/reserve" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors shadow-lg">
          <UtensilsCrossed className="w-4 h-4" />
          {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota ora'}
        </Link>
      </section>
    </div>
  );
}