// Full menu data — English only

export const FOOD_MENU = {
  starters: [
    { name: "Mediterranean Bruschetta", desc: "Crispy country bread with cherry tomatoes, fresh basil and garlic", price: 8.4 },
    { name: "Fried Vegetable Julienne", desc: "Finely cut vegetables in crispy beer batter, golden-fried", price: 7.9 },
    { name: "Italian Vegetable Soup", desc: "Soup in Italian tradition with fresh winter vegetables, herbs and a hint of olive oil", price: 6.7 },
    { name: "Mediterranean Potatoes", desc: "Simple, honest, irresistible — golden, crispy and fresh from our kitchen", price: 4.3, price_with: 5.7, option: "With Parmesan cream" },
  ],
  mains: [
    { name: "Carbonara Tradizione", desc: "Spaghetti with the original Italian recipe — Guanciale, fresh egg yolk, Pecorino Romano and black pepper", price: 14.4 },
    { name: "Fusilloni with Broccoli Pesto & Herb Pancetta", desc: "Large Fusilli with creamy broccoli pesto and crispy herb pancetta", price: 13.3 },
    { name: "Spaghetti alla Napoletana with Meatballs", desc: "Spaghetti in San Marzano tomato sauce with homemade meatballs", price: 13.8 },
    { name: "My Twin's Doctor", desc: "Calamarata with chicken in Sauvignon reduction, zucchini cream and caramelised onions", price: 14.4 },
    { name: "The Language of the Sea", desc: "Linguine with salt cod braised with pepper, onion, rosemary and white wine", price: 14.1 },
    { name: "The Heart of the Earth", desc: "Fresh potato gnocchi in four-cheese sauce with crispy rosemary bacon", price: 13.4 },
  ],
  meat_fish: [
    { name: "Mediterranean Roastbeef", desc: "Juicy pink roastbeef with olive oil, herbs, braised onions and rosemary potatoes. With a fresh salad to start.", price: 25.4 },
    { name: "Mediterranean Schnitzel", desc: "Tender veal schnitzel golden baked with Mediterranean herbs, grilled vegetables and rosemary potatoes. With a fresh salad.", price: 16.3 },
    { name: "Saltimbocca alla Romana", desc: "Tender veal medallion with prosciutto and sage in white wine sauce. With oven vegetables and salad.", price: 18.3 },
  ],
  sides: [
    { name: "Mixed Salad", price: 5.5 },
    { name: "Roasted Vegetables", desc: "Seasonal, with olive oil and herbs", price: 6.5 },
  ],
  desserts: [
    { name: "Sweet Temptation", desc: "Homemade chocolate brownie with warm core, vanilla ice cream and sea salt", price: 5.5 },
    { name: "My Nonna's Classic", desc: "Tiramisù by traditional recipe with mascarpone, espresso and a hint of cocoa", price: 7.1 },
  ],
};

export const DRINKS_MENU = {
  aperitifs: [
    { name: "Aperol Spritz", price: 7.4 },
    { name: "Hugo Spritz", price: 7.4 },
    { name: "Campari Spritz", price: 7.4 },
    { name: "Ramazzotti Rosato", price: 7.4 },
    { name: "Sarti Rosa", price: 7.4 },
    { name: "Limoncello", price: 7.4 },
  ],
  white_wine: [
    { name: "Lugana", variants: [{ label: "0.1 l", price: 5.2 }, { label: "0.2 l", price: 7.4 }] },
    { name: "Chardonnay", variants: [{ label: "0.1 l", price: 4.5 }, { label: "0.2 l", price: 7.1 }] },
    { name: "Sauvignon", variants: [{ label: "0.1 l", price: 5.2 }, { label: "0.2 l", price: 7.4 }] },
    { name: "Vermentino", variants: [{ label: "0.1 l", price: 4.5 }, { label: "0.2 l", price: 7.1 }] },
  ],
  red_wine: [
    { name: "Primitivo di Manduria", variants: [{ label: "0.1 l", price: 4.9 }, { label: "0.2 l", price: 6.9 }] },
    { name: "Montepulciano", variants: [{ label: "0.1 l", price: 3.9 }, { label: "0.2 l", price: 5.9 }] },
    { name: "Chianti", variants: [{ label: "0.1 l", price: 4.6 }, { label: "0.2 l", price: 6.2 }] },
  ],
  beer: [
    { name: "Radler (sweet / sour)", variants: [{ label: "0.3 l", price: 2.8 }, { label: "0.5 l", price: 3.7 }] },
    { name: "Hefeweizen", variants: [{ label: "0.5 l", price: 4.9 }] },
    { name: "Gold Märzen", variants: [{ label: "0.3 l", price: 3.6 }, { label: "0.5 l", price: 4.7 }] },
    { name: "Edelpils", variants: [{ label: "0.3 l", price: 3.6 }, { label: "0.5 l", price: 4.7 }] },
  ],
  soft: [
    { name: "Espresso", price: 2.1 },
    { name: "Cappuccino", price: 3.4 },
    { name: "Cola", variants: [{ label: "0.2 l", price: 3.4 }, { label: "0.4 l", price: 4.4 }] },
    { name: "Sprite", variants: [{ label: "0.2 l", price: 3.4 }, { label: "0.4 l", price: 4.4 }] },
    { name: "Fanta", variants: [{ label: "0.2 l", price: 3.4 }, { label: "0.4 l", price: 4.4 }] },
    { name: "Spezi", variants: [{ label: "0.2 l", price: 3.4 }, { label: "0.4 l", price: 4.4 }] },
    { name: "Apple Juice", variants: [{ label: "0.2 l", price: 3.7 }, { label: "0.4 l", price: 4.7 }] },
    { name: "Apple Spritz", variants: [{ label: "0.2 l", price: 3.7 }, { label: "0.4 l", price: 4.7 }] },
    { name: "Blackcurrant Spritz", variants: [{ label: "0.2 l", price: 3.7 }, { label: "0.4 l", price: 4.7 }] },
    { name: "Acqua Panna", variants: [{ label: "0.7 l", price: 5.5 }] },
    { name: "San Pellegrino", variants: [{ label: "0.7 l", price: 5.5 }] },
  ],
  digestifs: [
    { name: "A Touch of Milano — Ramazzotti", desc: "2 cl", price: 3.7 },
    { name: "A Last Greeting from Amalfi — Limoncello", desc: "2 cl", price: 3.7 },
    { name: "A Drop of Southern Italian Joy — Grappa", desc: "2 cl", price: 3.7 },
  ],
};

export const SECTION_LABELS = {
  starters: "Starters",
  mains: "Main Courses",
  meat_fish: "Meat & Fish",
  sides: "Sides",
  desserts: "Sweet Finale",
  aperitifs: "Aperitifs",
  white_wine: "White Wine",
  red_wine: "Red Wine",
  beer: "Beer",
  soft: "Soft Drinks",
  digestifs: "After Dinner",
};
