import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function PriceTag({ price }) {
  return <span className="font-semibold text-gold whitespace-nowrap tabular-nums">{price.toFixed(1).replace('.', ',')} €</span>;
}

function MultiPriceItem({ item, lang }) {
  const name = lang === 'de' ? item.name_de : lang === 'en' ? item.name_en : item.name_it;
  const desc = lang === 'de' ? item.desc_de : lang === 'en' ? item.desc_en : item.desc_it;
  return (
    <div className="py-4 border-b border-[#C9A96E]/08 last:border-0">
      <h3 className="font-display text-base text-ivory font-light leading-snug mb-1">{name}</h3>
      {desc && <p className="text-ivory/45 text-xs leading-relaxed mb-2 font-body">{desc}</p>}
      <div className="space-y-1.5 mt-2">
        {item.variants.map((v, i) => (
          <div key={i} className="flex justify-between items-center text-xs font-body">
            <span className="text-ivory/40">{lang === 'de' ? v.label_de : lang === 'en' ? v.label_en : v.label_it}</span>
            <PriceTag price={v.price} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuItem({ item, lang }) {
  if (item.variants) return <MultiPriceItem item={item} lang={lang} />;
  const name = lang === 'de' ? item.name_de : lang === 'en' ? item.name_en : item.name_it;
  const desc = lang === 'de' ? item.desc_de : lang === 'en' ? item.desc_en : item.desc_it;

  if (item.option_de) {
    return (
      <div className="py-4 border-b border-[#C9A96E]/08 last:border-0">
        <h3 className="font-display text-base text-ivory font-light leading-snug mb-2">{name}</h3>
        {desc && <p className="text-ivory/45 text-xs leading-relaxed mb-2 font-body">{desc}</p>}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-body">
            <span className="text-ivory/40">{lang === 'de' ? 'Ohne Parmesan-Creme' : lang === 'en' ? 'Without Parmesan cream' : 'Senza crema di Parmigiano'}</span>
            <PriceTag price={item.price} />
          </div>
          <div className="flex justify-between text-xs font-body">
            <span className="text-ivory/40">{lang === 'de' ? item.option_de : lang === 'en' ? item.option_en : item.option_it}</span>
            <PriceTag price={item.price_with} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-[#C9A96E]/08 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base text-ivory font-light leading-snug">{name}</h3>
          {desc && <p className="text-ivory/45 text-xs mt-1 leading-relaxed font-body">{desc}</p>}
        </div>
        <PriceTag price={item.price} />
      </div>
    </div>
  );
}

function Section({ title, items, lang }) {
  return (
    <div className="mb-10">
      <h2 className="text-[10px] uppercase tracking-[0.35em] font-body font-semibold text-gold mb-3 pb-3 border-b border-gold/25 flex items-center gap-2">
        <span className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent hidden sm:block" />
        {title}
        <span className="flex-1 h-px bg-gradient-to-l from-gold/20 to-transparent hidden sm:block" />
      </h2>
      {items.map((item, i) => <MenuItem key={i} item={item} lang={lang} />)}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FOOD = {
  starters: [
    { name_de: 'Mediterrane Bruschetta', name_en: 'Mediterranean Bruschetta', name_it: 'Bruschetta Mediterranea', desc_de: 'Knuspriges Landbrot mit Kirschtomaten, frischem Basilikum und Knoblauch', desc_en: 'Crispy country bread with cherry tomatoes, fresh basil and garlic', desc_it: 'Pane croccante con pomodorini, basilico fresco e aglio', price: 8.4 },
    { name_de: 'Frittierte Gemüsejulienne', name_en: 'Fried Vegetable Julienne', name_it: 'Verdure in pastella fritte', desc_de: 'Fein geschnittenes Gemüse in knusprigem Bierteig, goldbraun ausgebacken', desc_en: 'Finely cut vegetables in crispy beer batter, golden-fried', desc_it: 'Verdure finemente tagliate in pastella di birra croccante', price: 7.9 },
    { name_de: 'Gemüsesuppe alla Italiana', name_en: 'Italian Vegetable Soup', name_it: 'Minestrone all\'Italiana', desc_de: 'Suppe nach italienischer Tradition mit frischem Wintergemüse, Kräutern und einem Hauch Olivenöl', desc_en: 'Soup in Italian tradition with fresh winter vegetables, herbs and a hint of olive oil', desc_it: 'Zuppa di tradizione italiana con verdure fresche di stagione', price: 6.7 },
    { name_de: 'Mediterrane Potatos', name_en: 'Mediterranean Potatoes', name_it: 'Patate Mediterranee', desc_de: 'Einfach, ehrlich, unwiderstehlich – goldbraun, knusprig und frisch aus unserer Küche', desc_en: 'Simple, honest, irresistible — golden, crispy and fresh from our kitchen', desc_it: 'Semplici, oneste, irresistibili — dorate, croccanti e fresche', price: 4.3, price_with: 5.7, option_de: 'Mit Parmesan-Creme', option_en: 'With Parmesan cream', option_it: 'Con crema di Parmigiano' },
  ],
  mains: [
    { name_de: 'Carbonara Tradizione', name_en: 'Carbonara Tradizione', name_it: 'Carbonara Tradizione', desc_de: 'Spaghetti nach original italienischem Rezept – mit Guanciale, frischem Eigelb, Pecorino Romano und schwarzem Pfeffer', desc_en: 'Spaghetti with the original Italian recipe — Guanciale, fresh egg yolk, Pecorino Romano and black pepper', desc_it: 'Spaghetti con la ricetta originale — guanciale, tuorlo, Pecorino Romano e pepe nero', price: 14.4 },
    { name_de: 'Fusilloni al Brokkoli-Pesto mit Kräuter-Pancetta', name_en: 'Fusilloni with Broccoli Pesto & Herb Pancetta', name_it: 'Fusilloni al pesto di broccoli e pancetta', desc_de: 'Große Fusilli mit cremigem Brokkoli-Pesto und knuspriger Pancetta', desc_en: 'Large Fusilli with creamy broccoli pesto and crispy herb pancetta', desc_it: 'Fusilli grandi con pesto cremoso di broccoli e pancetta croccante', price: 13.3 },
    { name_de: 'Spaghetti alla Napoletana mit Polpette', name_en: 'Spaghetti alla Napoletana with Meatballs', name_it: 'Spaghetti alla Napoletana con polpette', desc_de: 'Spaghetti in Tomatensauce aus echten San-Marzano-Pelati, dazu hausgemachte Fleischbällchen', desc_en: 'Spaghetti in San Marzano tomato sauce with homemade meatballs', desc_it: 'Spaghetti in salsa di pomodori San Marzano con polpette fatte in casa', price: 13.8 },
    { name_de: 'Der Doktor meines Zwillings', name_en: "My Twin's Doctor", name_it: 'Il Dottore del Mio Gemello', desc_de: 'Calamarata mit Huhn in Sauvignon-Reduktion, dazu Zucchinicreme und karamellisierte Zwiebeln', desc_en: 'Calamarata with chicken in Sauvignon reduction, zucchini cream and caramelised onions', desc_it: 'Calamarata con pollo in riduzione di Sauvignon, crema di zucchine e cipolle caramellate', price: 14.4 },
    { name_de: 'Die Sprache des Meeres', name_en: 'The Language of the Sea', name_it: 'Il Linguaggio del Mare', desc_de: 'Linguine mit Baccalà, geschmort in Paprika, Zwiebel, Rosmarin und Weißwein', desc_en: 'Linguine with salt cod braised with pepper, onion, rosemary and white wine', desc_it: 'Linguine con baccalà in salsa di peperoni, cipolla, rosmarino e vino bianco', price: 14.1 },
    { name_de: 'Das Herz der Erde', name_en: 'The Heart of the Earth', name_it: 'Il Cuore della Terra', desc_de: 'Frische Kartoffelgnocchi in Vier-Käse-Sauce mit knusprigem Rosmarin-Speck', desc_en: 'Fresh potato gnocchi in four-cheese sauce with crispy rosemary bacon', desc_it: 'Gnocchi di patate freschi in salsa ai quattro formaggi con pancetta al rosmarino', price: 13.4 },
  ],
  meat_fish: [
    { name_de: 'Mediterraner Rostbraten', name_en: 'Mediterranean Roastbeef', name_it: 'Arrosto Mediterraneo', desc_de: 'Saftig rosa Roastbeef mit Olivenöl, Kräutern, geschmorten Zwiebeln und Rosmarinkartoffeln. Vorab ein frischer Salat.', desc_en: 'Juicy pink roastbeef with olive oil, herbs, braised onions and rosemary potatoes. With a fresh salad to start.', desc_it: 'Roastbeef rosa con olio d\'oliva, erbe, cipolle stufate e patate al rosmarino. Con insalata fresca.', price: 25.4 },
    { name_de: 'Mediterranes Schnitzel', name_en: 'Mediterranean Schnitzel', name_it: 'Cotoletta Mediterranea', desc_de: 'Zartes Kalbsschnitzel goldbraun gebacken mit mediterranen Kräutern, gegrilltem Gemüse und Rosmarinkartoffeln. Vorab ein frischer Salat.', desc_en: 'Tender veal schnitzel golden baked with Mediterranean herbs, grilled vegetables and rosemary potatoes. With a fresh salad.', desc_it: 'Cotoletta di vitello dorata con erbe mediterranee, verdure grigliate e patate al rosmarino.', price: 16.3 },
    { name_de: 'Saltimbocca alla Romana', name_en: 'Saltimbocca alla Romana', name_it: 'Saltimbocca alla Romana', desc_de: 'Zartes Kalbsmedaillon mit Prosciutto und Salbei in Weißweinsauce. Dazu Ofengemüse und frischer Salat.', desc_en: 'Tender veal medallion with prosciutto and sage in white wine sauce. With oven vegetables and salad.', desc_it: 'Medaglione di vitello con prosciutto e salvia in salsa al vino bianco. Con verdure al forno.', price: 18.3 },
  ],
  sides: [
    { name_de: 'Gemischter Salat', name_en: 'Mixed Salad', name_it: 'Insalata mista', price: 5.5 },
    { name_de: 'Ofengemüse', name_en: 'Roasted Vegetables', name_it: 'Verdure al forno', desc_de: 'Saisonal, mit Olivenöl und Kräutern', desc_en: 'Seasonal, with olive oil and herbs', desc_it: 'Stagionale, con olio d\'oliva ed erbe', price: 6.5 },
  ],
  desserts: [
    { name_de: 'Die Süße Versuchung', name_en: 'Sweet Temptation', name_it: 'La Dolce Tentazione', desc_de: 'Hausgemachter Schokoladen-Brownie mit warmem Kern, Vanilleeis und Meersalz', desc_en: 'Homemade chocolate brownie with warm core, vanilla ice cream and sea salt', desc_it: 'Brownie al cioccolato fatto in casa con cuore caldo, gelato alla vaniglia e sale marino', price: 5.5 },
    { name_de: 'Der Klassiker meiner Nonna', name_en: "My Nonna's Classic", name_it: 'Il Classico della mia Nonna', desc_de: 'Tiramisù nach traditionellem Rezept mit Mascarpone, Espresso und einem Hauch Kakao', desc_en: 'Tiramisù by traditional recipe with mascarpone, espresso and a hint of cocoa', desc_it: 'Tiramisù della ricetta tradizionale con mascarpone, espresso e un tocco di cacao', price: 7.1 },
  ],
};

const DRINKS = {
  aperitifs: [
    { name_de: 'Aperol Spritz', name_en: 'Aperol Spritz', name_it: 'Aperol Spritz', price: 7.4 },
    { name_de: 'Hugo Spritz', name_en: 'Hugo Spritz', name_it: 'Hugo Spritz', price: 7.4 },
    { name_de: 'Campari Spritz', name_en: 'Campari Spritz', name_it: 'Campari Spritz', price: 7.4 },
    { name_de: 'Ramazzotti Rosato', name_en: 'Ramazzotti Rosato', name_it: 'Ramazzotti Rosato', price: 7.4 },
    { name_de: 'Sarti Rosa', name_en: 'Sarti Rosa', name_it: 'Sarti Rosa', price: 7.4 },
    { name_de: 'Limoncello', name_en: 'Limoncello', name_it: 'Limoncello', price: 7.4 },
  ],
  white_wine: [
    { name_de: 'Lugana', name_en: 'Lugana', name_it: 'Lugana', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 5.2 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 7.4 }] },
    { name_de: 'Chardonnay', name_en: 'Chardonnay', name_it: 'Chardonnay', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 4.5 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 7.1 }] },
    { name_de: 'Sauvignon', name_en: 'Sauvignon', name_it: 'Sauvignon', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 5.2 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 7.4 }] },
    { name_de: 'Vermentino', name_en: 'Vermentino', name_it: 'Vermentino', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 4.5 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 7.1 }] },
  ],
  red_wine: [
    { name_de: 'Primitivo di Manduria', name_en: 'Primitivo di Manduria', name_it: 'Primitivo di Manduria', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 4.9 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 6.9 }] },
    { name_de: 'Montepulciano', name_en: 'Montepulciano', name_it: 'Montepulciano', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 3.9 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 5.9 }] },
    { name_de: 'Chianti', name_en: 'Chianti', name_it: 'Chianti', variants: [{ label_de: '0,1 l', label_en: '0.1 l', label_it: '0,1 l', price: 4.6 }, { label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 6.2 }] },
  ],
  beer: [
    { name_de: 'Radler süß / sauer', name_en: 'Radler (sweet / sour)', name_it: 'Radler dolce / amaro', variants: [{ label_de: '0,3 l', label_en: '0.3 l', label_it: '0,3 l', price: 2.8 }, { label_de: '0,5 l', label_en: '0.5 l', label_it: '0,5 l', price: 3.7 }] },
    { name_de: 'Hefeweizen', name_en: 'Hefeweizen', name_it: 'Hefeweizen', variants: [{ label_de: '0,5 l', label_en: '0.5 l', label_it: '0,5 l', price: 4.9 }] },
    { name_de: 'Gold-Märzen', name_en: 'Gold Märzen', name_it: 'Gold Märzen', variants: [{ label_de: '0,3 l', label_en: '0.3 l', label_it: '0,3 l', price: 3.6 }, { label_de: '0,5 l', label_en: '0.5 l', label_it: '0,5 l', price: 4.7 }] },
    { name_de: 'Edelpils', name_en: 'Edelpils', name_it: 'Edelpils', variants: [{ label_de: '0,3 l', label_en: '0.3 l', label_it: '0,3 l', price: 3.6 }, { label_de: '0,5 l', label_en: '0.5 l', label_it: '0,5 l', price: 4.7 }] },
  ],
  soft: [
    { name_de: 'Espresso', name_en: 'Espresso', name_it: 'Espresso', price: 2.1 },
    { name_de: 'Cappuccino', name_en: 'Cappuccino', name_it: 'Cappuccino', price: 3.4 },
    { name_de: 'Cola', name_en: 'Cola', name_it: 'Cola', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.4 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.4 }] },
    { name_de: 'Sprite', name_en: 'Sprite', name_it: 'Sprite', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.4 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.4 }] },
    { name_de: 'Fanta', name_en: 'Fanta', name_it: 'Fanta', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.4 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.4 }] },
    { name_de: 'Spezi', name_en: 'Spezi', name_it: 'Spezi', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.4 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.4 }] },
    { name_de: 'Apfelsaft', name_en: 'Apple Juice', name_it: 'Succo di mela', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.7 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.7 }] },
    { name_de: 'Apfelschorle', name_en: 'Apple Spritz', name_it: 'Succo di mela frizzante', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.7 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.7 }] },
    { name_de: 'Johannisbeer-Schorle', name_en: 'Blackcurrant Spritz', name_it: 'Ribes frizzante', variants: [{ label_de: '0,2 l', label_en: '0.2 l', label_it: '0,2 l', price: 3.7 }, { label_de: '0,4 l', label_en: '0.4 l', label_it: '0,4 l', price: 4.7 }] },
    { name_de: 'Acqua Panna', name_en: 'Acqua Panna', name_it: 'Acqua Panna', variants: [{ label_de: '0,7 l', label_en: '0.7 l', label_it: '0,7 l', price: 5.5 }] },
    { name_de: 'San Pellegrino', name_en: 'San Pellegrino', name_it: 'San Pellegrino', variants: [{ label_de: '0,7 l', label_en: '0.7 l', label_it: '0,7 l', price: 5.5 }] },
  ],
  digestifs: [
    { name_de: 'Ein Hauch von Milano — Ramazzotti', name_en: 'A Touch of Milano — Ramazzotti', name_it: 'Un tocco di Milano — Ramazzotti', desc_de: '2 cl', desc_en: '2 cl', desc_it: '2 cl', price: 3.7 },
    { name_de: 'Ein letzter Gruß aus Amalfi — Limoncello', name_en: 'A Last Greeting from Amalfi — Limoncello', name_it: 'Un ultimo saluto da Amalfi — Limoncello', desc_de: '2 cl', desc_en: '2 cl', desc_it: '2 cl', price: 3.7 },
    { name_de: 'Ein Tropfen süditalienischer Lebensfreude — Grappa', name_en: 'A Drop of Southern Italian Joy — Grappa', name_it: 'Una goccia di gioia meridionale — Grappa', desc_de: '2 cl', desc_en: '2 cl', desc_it: '2 cl', price: 3.7 },
  ],
};

const SECTION_LABELS = {
  de: { starters: 'Vorspeisen', mains: 'Hauptgerichte', meat_fish: 'Fleisch & Fisch', sides: 'Beilagen', desserts: 'Krönender Abschluss', aperitifs: 'Aperitifs', white_wine: 'Weißwein', red_wine: 'Rotwein', beer: 'Bier', soft: 'Alkoholfreie Getränke', digestifs: 'Nach dem Essen' },
  en: { starters: 'Starters', mains: 'Main Courses', meat_fish: 'Meat & Fish', sides: 'Sides', desserts: 'Sweet Finale', aperitifs: 'Aperitifs', white_wine: 'White Wine', red_wine: 'Red Wine', beer: 'Beer', soft: 'Soft Drinks', digestifs: 'After Dinner' },
  it: { starters: 'Antipasti', mains: 'Primi & Secondi', meat_fish: 'Carne & Pesce', sides: 'Contorni', desserts: 'Dolci', aperitifs: 'Aperitivi', white_wine: 'Vino Bianco', red_wine: 'Vino Rosso', beer: 'Birra', soft: 'Analcolici', digestifs: 'Digestivi' },
};

export default function MenuPage() {
  const { lang } = useLang();
  const [tab, setTab] = useState('food');
  const L = SECTION_LABELS[lang] || SECTION_LABELS.de;

  const tabLabel = (t) => {
    if (t === 'food') return lang === 'de' ? 'Speisen' : lang === 'en' ? 'Food' : 'Cibo';
    return lang === 'de' ? 'Getränke' : lang === 'en' ? 'Drinks' : 'Bevande';
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory pb-28 lg:pb-8">
      {/* Header */}
      <div className="bg-espresso pt-24 pb-10 px-5 text-center border-b border-[#C9A96E]/10">
        <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body font-medium mb-2">Kulinarium by Ammesso</p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-ivory mb-2">
          {lang === 'de' ? 'Speisekarte' : lang === 'en' ? 'Menu' : 'Menu'}
        </h1>
        <p className="text-ivory/40 text-sm font-body">
          {lang === 'de' ? 'Unser Essen ist mit Liebe gemacht' : lang === 'en' ? 'Our food is made with love' : 'Il nostro cibo è fatto con amore'}
        </p>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#0F0D0B]/95 backdrop-blur-md border-b border-[#C9A96E]/10">
        <div className="max-w-2xl mx-auto px-5 flex">
          {['food', 'drinks'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-xs font-body font-semibold tracking-[0.2em] uppercase transition-all border-b-2 ${tab === t ? 'border-gold text-gold' : 'border-transparent text-ivory/40 hover:text-ivory/70'}`}>
              {tabLabel(t)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        {tab === 'food' && (
          <>
            <Section title={L.starters} items={FOOD.starters} lang={lang} />
            <Section title={L.mains} items={FOOD.mains} lang={lang} />
            <Section title={L.meat_fish} items={FOOD.meat_fish} lang={lang} />
            <Section title={L.sides} items={FOOD.sides} lang={lang} />
            <Section title={L.desserts} items={FOOD.desserts} lang={lang} />
          </>
        )}
        {tab === 'drinks' && (
          <>
            <Section title={L.aperitifs} items={DRINKS.aperitifs} lang={lang} />
            <Section title={L.white_wine} items={DRINKS.white_wine} lang={lang} />
            <Section title={L.red_wine} items={DRINKS.red_wine} lang={lang} />
            <Section title={L.beer} items={DRINKS.beer} lang={lang} />
            <Section title={L.soft} items={DRINKS.soft} lang={lang} />
            <Section title={L.digestifs} items={DRINKS.digestifs} lang={lang} />
          </>
        )}

        {/* Legal note */}
        <div className="mt-8 glass-card border border-[#C9A96E]/08 rounded-xl p-5 text-xs text-ivory/30 text-center leading-relaxed space-y-1 font-body">
          <p>
            {lang === 'de' && 'Alle Preise inkl. MwSt. Bei Allergien oder Unverträglichkeiten sprechen Sie bitte unser Personal an.'}
            {lang === 'en' && 'All prices include VAT. Please inform our staff of any allergies or intolerances.'}
            {lang === 'it' && 'Tutti i prezzi sono IVA inclusa. Per allergie o intolleranze informate il nostro personale.'}
          </p>
          <p>
            {lang === 'de' && 'Irrtümer und Preisänderungen vorbehalten.'}
            {lang === 'en' && 'Errors and price changes reserved.'}
            {lang === 'it' && 'Salvo errori e modifiche di prezzo.'}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/reserve"
            className="inline-flex items-center gap-2 px-8 py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold shadow-gold-glow">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {lang === 'de' ? 'Tisch reservieren' : lang === 'en' ? 'Reserve a Table' : 'Prenota un tavolo'}
          </Link>
        </div>
      </div>
    </div>
  );
}