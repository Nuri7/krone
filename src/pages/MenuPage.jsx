import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { MENU_DATA } from '@/lib/siteData';

function PriceTag({ price }) {
  return <span className="font-semibold text-amber-700">{price.toFixed(1).replace('.', ',')} €</span>;
}

function MenuItem({ item, lang }) {
  const name = lang === 'de' ? item.name_de : lang === 'en' ? item.name_en : item.name_it;
  const desc = lang === 'de' ? item.desc_de : lang === 'en' ? item.desc_en : item.desc_it;
  return (
    <div className="py-5 border-b border-stone-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-stone-800 text-sm leading-snug">{name}</h3>
          {desc && <p className="text-stone-500 text-xs mt-1 leading-relaxed">{desc}</p>}
          {item.option_de && (
            <div className="mt-2 space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">{lang === 'de' ? 'Ohne Parmesan-Creme' : lang === 'en' ? 'Without Parmesan cream' : 'Senza crema di Parmigiano'}</span>
                <PriceTag price={item.price} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">{lang === 'de' ? item.option_de : lang === 'en' ? item.option_en : item.option_it}</span>
                <PriceTag price={item.price_with} />
              </div>
            </div>
          )}
        </div>
        {!item.option_de && <PriceTag price={item.price} />}
      </div>
    </div>
  );
}

function Section({ title, items, lang }) {
  return (
    <div className="mb-10">
      <h2 className="text-xs uppercase tracking-widest font-semibold text-amber-600 mb-4 pb-2 border-b-2 border-amber-100">
        {title}
      </h2>
      {items.map((item, i) => <MenuItem key={i} item={item} lang={lang} />)}
    </div>
  );
}

export default function MenuPage() {
  const { tr, lang } = useLang();
  const [tab, setTab] = useState('food');

  const DRINKS_NON_ALCOHOLIC = [
    { name_de: 'Cappuccino', name_en: 'Cappuccino', name_it: 'Cappuccino', price: 3.4 },
    { name_de: 'Espresso', name_en: 'Espresso', name_it: 'Espresso', price: 2.1 },
    { name_de: 'Acqua Panna 0,7l', name_en: 'Acqua Panna 0.7l', name_it: 'Acqua Panna 0,7l', price: 5.5 },
    { name_de: 'San Pellegrino 0,7l', name_en: 'San Pellegrino 0.7l', name_it: 'San Pellegrino 0,7l', price: 5.5 },
    { name_de: 'Cola 0,2l / 0,4l', name_en: 'Cola 0.2l / 0.4l', name_it: 'Cola 0,2l / 0,4l', price: 3.4 },
    { name_de: 'Apfelsaft 0,2l / 0,4l', name_en: 'Apple Juice 0.2l / 0.4l', name_it: 'Succo di mela 0,2l / 0,4l', price: 3.7 },
  ];

  const DRINKS_WINE_WHITE = [
    { name_de: 'Lugana', name_en: 'Lugana', name_it: 'Lugana', desc_de: '0,1l / 0,2l', desc_en: '0.1l / 0.2l', desc_it: '0,1l / 0,2l', price: 5.2 },
    { name_de: 'Chardonnay', name_en: 'Chardonnay', name_it: 'Chardonnay', desc_de: '0,1l / 0,2l', desc_en: '0.1l / 0.2l', desc_it: '0,1l / 0,2l', price: 4.5 },
    { name_de: 'Sauvignon', name_en: 'Sauvignon', name_it: 'Sauvignon', desc_de: '0,1l / 0,2l', desc_en: '0.1l / 0.2l', desc_it: '0,1l / 0,2l', price: 5.2 },
    { name_de: 'Vermentino', name_en: 'Vermentino', name_it: 'Vermentino', desc_de: '0,1l / 0,2l', desc_en: '0.1l / 0.2l', desc_it: '0,1l / 0,2l', price: 4.5 },
  ];

  const DRINKS_WINE_RED = [
    { name_de: 'Primitivo di Manduria', name_en: 'Primitivo di Manduria', name_it: 'Primitivo di Manduria', price: 4.9 },
    { name_de: 'Montepulciano', name_en: 'Montepulciano', name_it: 'Montepulciano', price: 3.9 },
    { name_de: 'Chianti', name_en: 'Chianti', name_it: 'Chianti', price: 4.6 },
  ];

  const APERITIFS = [
    { name_de: 'Aperol Spritz', name_en: 'Aperol Spritz', name_it: 'Aperol Spritz', price: 7.4 },
    { name_de: 'Hugo Spritz', name_en: 'Hugo Spritz', name_it: 'Hugo Spritz', price: 7.4 },
    { name_de: 'Campari Spritz', name_en: 'Campari Spritz', name_it: 'Campari Spritz', price: 7.4 },
    { name_de: 'Ramazzotti Rosato', name_en: 'Ramazzotti Rosato', name_it: 'Ramazzotti Rosato', price: 7.4 },
    { name_de: 'Limoncello', name_en: 'Limoncello', name_it: 'Limoncello', price: 7.4 },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-24">
      {/* Header */}
      <div className="relative bg-stone-900 text-white py-16 px-4 text-center mb-0">
        <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">
          Kulinarium by Ammesso
        </p>
        <h1 className="text-4xl font-light mb-2">{tr('menu', 'title')}</h1>
        <p className="text-stone-400">{tr('menu', 'subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 flex">
          {['food', 'drinks'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 ${tab === t ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
              {t === 'food' ? (lang === 'de' ? 'Speisen' : lang === 'en' ? 'Food' : 'Cibo') : (lang === 'de' ? 'Getränke' : lang === 'en' ? 'Drinks' : 'Bevande')}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {tab === 'food' && (
          <>
            <Section title={tr('menu', 'starters')} items={MENU_DATA.starters} lang={lang} />
            <Section title={tr('menu', 'mains')} items={MENU_DATA.mains} lang={lang} />
            <Section title={tr('menu', 'meat_fish')} items={MENU_DATA.meat_fish} lang={lang} />
            <Section title={tr('menu', 'sides')} items={MENU_DATA.sides} lang={lang} />
            <Section title={tr('menu', 'desserts')} items={MENU_DATA.desserts} lang={lang} />
          </>
        )}
        {tab === 'drinks' && (
          <>
            <Section title={tr('menu', 'aperitifs')} items={APERITIFS} lang={lang} />
            <Section title={tr('menu', 'white_wine')} items={DRINKS_WINE_WHITE} lang={lang} />
            <Section title={tr('menu', 'red_wine')} items={DRINKS_WINE_RED} lang={lang} />
            <Section title={tr('menu', 'non_alcoholic')} items={DRINKS_NON_ALCOHOLIC} lang={lang} />
          </>
        )}

        {/* Allergen note */}
        <p className="text-xs text-stone-400 text-center mt-8 leading-relaxed">
          {lang === 'de' && 'Alle Preise inkl. MwSt. Bei Allergien oder Unverträglichkeiten sprechen Sie bitte unser Personal an.'}
          {lang === 'en' && 'All prices include VAT. Please inform our staff of any allergies or intolerances.'}
          {lang === 'it' && 'Tutti i prezzi sono IVA inclusa. Per allergie o intolleranze informate il nostro personale.'}
        </p>
      </div>
    </div>
  );
}