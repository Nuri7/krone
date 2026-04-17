import { Link } from 'react-router-dom';
import { useLang } from '@/lib/useLang';

const CHEF_IMAGE = "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp";
const RESTAURANT_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

export default function Story() {
  const { tr, lang } = useLang();

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={RESTAURANT_IMAGE} alt="Kulinarium by Ammesso" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-amber-300 text-xs uppercase tracking-widest mb-3">Krone Langenburg</p>
            <h1 className="text-4xl font-light text-white">{tr('story', 'title')}</h1>
          </div>
        </div>
      </div>

      {/* Brand statement */}
      <section className="bg-amber-50 py-12 px-4 text-center">
        <p className="text-amber-700 text-sm font-medium italic max-w-xl mx-auto">
          "{tr('story', 'brand')}"
        </p>
      </section>

      {/* Story text */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-stone-700 text-lg leading-relaxed mb-6">{tr('story', 'text1')}</p>
          <p className="text-stone-600 leading-relaxed">{tr('story', 'text2')}</p>
        </div>
      </section>

      {/* Chef section */}
      <section className="py-16 px-4 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden h-96 md:h-[30rem]">
            <img src={CHEF_IMAGE} alt="Chef Omar Ammesso" className="w-full h-full object-cover object-top" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div>
            <p className="text-amber-400 text-xs uppercase tracking-widest mb-3">{tr('story', 'chef_title')}</p>
            <h2 className="text-3xl font-light mb-2">Omar Ammesso</h2>
            <p className="text-stone-400 text-sm italic mb-6">Omar Ouardaoui</p>
            <blockquote className="border-l-2 border-amber-500 pl-4 text-stone-300 italic text-sm mb-6">
              {lang === 'de' && '"Ammesso bringt Gefühl auf den Teller – bei ihm schmeckt man Herz, Vergangenheit und Vision in jedem Bissen."'}
              {lang === 'en' && '"Ammesso brings feeling to the plate – in every bite you taste heart, history and vision."'}
              {lang === 'it' && '"Ammesso porta emozione nel piatto – in ogni boccone si sente cuore, passato e visione."'}
            </blockquote>
            <p className="text-stone-300 leading-relaxed text-sm">{tr('story', 'chef_bio')}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { emoji: '🫀', de: 'Mit Herz', en: 'With Heart', it: 'Con Cuore', desc_de: 'Jedes Gericht ist eine persönliche Aussage.', desc_en: 'Every dish is a personal statement.', desc_it: 'Ogni piatto è una dichiarazione personale.' },
            { emoji: '🌿', de: 'Mit Ehrlichkeit', en: 'With Honesty', it: 'Con Onestà', desc_de: 'Hochwertige, ehrliche Zutaten ohne Kompromisse.', desc_en: 'High-quality, honest ingredients without compromise.', desc_it: 'Ingredienti di alta qualità, senza compromessi.' },
            { emoji: '🏡', de: 'Mit Wärme', en: 'With Warmth', it: 'Con Calore', desc_de: 'Jeder Gast fühlt sich wie zu Hause.', desc_en: 'Every guest feels at home.', desc_it: 'Ogni ospite si sente a casa.' },
          ].map(v => (
            <div key={v.de} className="p-6 bg-stone-50 rounded-2xl">
              <div className="text-4xl mb-4">{v.emoji}</div>
              <h3 className="font-semibold text-stone-800 mb-2">
                {lang === 'de' ? v.de : lang === 'en' ? v.en : v.it}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {lang === 'de' ? v.desc_de : lang === 'en' ? v.desc_en : v.desc_it}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-600 py-12 px-4 text-center text-white">
        <h2 className="text-2xl font-light mb-5">
          {lang === 'de' ? 'Erleben Sie es selbst.' : lang === 'en' ? 'Come experience it yourself.' : 'Vieni a scoprirlo di persona.'}
        </h2>
        <Link to="/reserve" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors shadow-lg">
          {tr('nav', 'reserve')}
        </Link>
      </section>
    </div>
  );
}