// Canonical site data — single source of truth (English only)

export const SITE = {
  name: "Krone Langenburg by Ammesso",
  brand: "Ammesso",
  restaurant_brand: "Kulinarium by Ammesso",
  tagline: "Where Home Tastes Real",
  sub_tagline: "genuine · warm · handcrafted",
  address: {
    street: "Hauptstraße 24",
    city: "Langenburg",
    zip: "74595",
    country: "Germany",
    full: "Hauptstraße 24, 74595 Langenburg, Germany",
  },
  phone: "+49 7905 41770",
  email: "info@krone-ammesso.de",
  whatsapp: "+4979054177",
  beds24_prop_id: "310599",
  beds24_booking_url: "https://beds24.com/booking2.php?propid=310599",
  capacity: 120,
  breakfast_price: 14,
  closed_days: [1], // Monday
  hours: {
    lunch: { start: "12:00", end: "14:30" },
    dinner: { start: "17:30", end: "22:00" },
    sunday: { start: "12:00", end: "20:00" },
  },
  social: {
    instagram: "https://www.instagram.com/kulinarium.ammesso/",
    facebook: "https://www.facebook.com/pages/H%C3%A4llisches%20Kulinarium%20by%20Ammesso",
    tripadvisor: "https://www.tripadvisor.de/Restaurant_Review-g198538-d26012517-Reviews-Hallisches_Kulinarium_by_Ammesso-Schwabisch_Hall_Baden_Wurttemberg.html",
  },
  maps_url: "https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg",
  maps_embed_key: "AIzaSyA-OPJc_4CvKv_S8YToDdmlS9hE7f1R1AU",
};

export const CHEF = {
  name: "Omar Ammesso",
  full_name: "Omar Ouardaoui",
  title: "Head Chef & Founder",
  quote: "I don't cook for the Michelin star. I cook so you come back tomorrow.",
  bio: "Omar Ammesso, born Omar Ouardaoui, is not only the founder of Kulinarium but also its creative core. His passion for cooking started early — inspired by the aromas of his childhood and a deep love for Mediterranean cuisine. Trained in various European kitchens, he quickly developed his own style: powerful, personal and full of emotion. For Ammesso, cooking is not a profession — it is language, identity, and a daily declaration of love for life.",
  image: "https://static.wixstatic.com/media/e6b39b_b2703a4b8aa7481b9e9ec3a3a9eb6892~mv2.webp/v1/fill/w_324,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ammesso-6512-1bfcdeba.webp",
};

export const ROOMS = [
  {
    id: "deluxe_single",
    name: "Deluxe Single Room",
    description: "A quiet, comfortable single room with everything you need for a restful stay.",
    size_m2: 18,
    max_guests: 1,
    bed: "Single bed",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    features: ["Quiet location", "Modern bathroom", "Work desk", "City view", "Mini fridge"],
  },
  {
    id: "deluxe_double",
    name: "Deluxe Double Room",
    description: "Spacious double room with tasteful décor and views over Langenburg.",
    size_m2: 26,
    max_guests: 2,
    bed: "Double bed (180×200)",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    features: ["Panoramic window", "Rain shower", "Work desk", "Langenburg view", "Minibar"],
  },
  {
    id: "king_suite",
    name: "King Suite",
    description: "Our generous King Suite — for special occasions, honeymoons and luxurious relaxation.",
    size_m2: 42,
    max_guests: 2,
    bed: "King-size bed (200×200)",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    features: ["Separate living area", "Freestanding bathtub", "Premium minibar", "Lounge area", "Exclusive view"],
  },
];

export const AMENITIES = [
  "Free WiFi", "Air Conditioning", "Private Bathroom",
  "Premium Bedding", "Work Desk", "City View",
];

export const TIME_SLOTS = {
  lunch: ["12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15"],
  dinner: ["17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30"],
  sunday: ["12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","19:00","19:15","19:30"],
};

export const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/restaurant", label: "Restaurant" },
  { path: "/menu", label: "Menu" },
  { path: "/rooms", label: "Rooms & Suites" },
  { path: "/story", label: "Our Story" },
  { path: "/weddings", label: "Weddings & Events" },
  { path: "/gallery", label: "Gallery" },
  { path: "/contact", label: "Contact" },
];

export const EVENT_TYPES = [
  { id: "wedding", label: "💍 Wedding" },
  { id: "celebration", label: "🥂 Birthday & Anniversary" },
  { id: "corporate", label: "🏢 Corporate Event" },
  { id: "private_dining", label: "🍽 Private Dining" },
  { id: "group", label: "👥 Group Stay / Contingent" },
  { id: "other", label: "✦ Other Request" },
];

export const INQUIRY_TYPES = [
  { id: "general", label: "General Enquiry" },
  { id: "wedding", label: "Wedding & Events" },
  { id: "group", label: "Group Booking" },
  { id: "business", label: "Business Travel" },
];