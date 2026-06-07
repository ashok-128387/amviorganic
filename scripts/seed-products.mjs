// Run: node scripts/seed-products.mjs
// Make sure your dev server is running on http://localhost:3000

const BASE = 'http://localhost:3000';

const products = [
  {
    id: '1', name: 'Jaggery Cubes', category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Cubes Front Pouch.png',
    images: ['/Shoot Product only/Jaggery Cubes Front Pouch.png', '/Shoot Product only/Jaggery Cubes Back Pouch.png'],
    rating: 5.0, reviewCount: 145,
    variations: [
      { id: 'v1-1', productId: '1', name: '250G', price: 230, stock: 80 },
      { id: 'v1-2', productId: '1', name: '500G', price: 420, stock: 70 },
      { id: 'v1-3', productId: '1', name: '1KG', price: 780, stock: 60 },
    ],
    description: `Our Organic Jaggery Cubes are made from the finest organic sugar cane. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and traditional sweets.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\nMfg. FSSAI Lic. No.: 10015043001123\nMfg. Scope Certificate No.: ORG-SC-2024-889\n\nWhy choose AMVI Organic Jaggery Cubes?\n• Sourced from certified organic farms in Mandya\n• Chemical-free processing\n• Rich in natural minerals\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2', name: 'Masala Jaggery Cubes', category: 'Sweeteners',
    image: '/Shoot Product only/Masala Jaggery Cubes Front Pouch.png',
    images: ['/Shoot Product only/Masala Jaggery Cubes Front Pouch.png', '/Shoot Product only/Masala Jaggery Cubes Back Pouch.png'],
    rating: 4.8, reviewCount: 112,
    variations: [
      { id: 'v2-1', productId: '2', name: '250G', price: 260, stock: 75 },
      { id: 'v2-2', productId: '2', name: '500G', price: 480, stock: 60 },
      { id: 'v2-3', productId: '2', name: '1KG', price: 880, stock: 45 },
    ],
    description: `Our Organic Masala Jaggery Cubes blended with traditional spices. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n• Enhanced with Natural Spices\n\nHow to Use\nPerfect for spiced teas and direct consumption as a flavorful healthy snack.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food with natural spices\nIngredients: 100% Organic Sugarcane Jaggery, Natural Spices (Ginger, Cardamom, Black Pepper)\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\nMfg. FSSAI Lic. No.: 10015043001123\nMfg. Scope Certificate No.: ORG-SC-2024-889\n\nWhy choose AMVI Organic Masala Jaggery Cubes?\n• Sourced from certified organic farms in Mandya\n• Chemical-free processing\n• Traditional spice blend\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3', name: 'Liquid Jaggery', category: 'Sweeteners',
    image: '/Shoot Product only/Liquid Jaggery front.png',
    images: ['/Shoot Product only/Liquid Jaggery front.png', '/Shoot Product only/Liquid Jaggery side.png', '/Shoot Product only/Liquid Jaggery back.png'],
    rating: 4.7, reviewCount: 98,
    variations: [
      { id: 'v3-1', productId: '3', name: '500G', price: 350, stock: 65 },
      { id: 'v3-2', productId: '3', name: '1KG', price: 650, stock: 50 },
    ],
    description: `Our Organic Liquid Jaggery is chemical-free, rich in iron and minerals, perfect for easy mixing.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n• Easy to Dissolve\n\nHow to Use\nUse as a substitute for sugar and honey in tea, coffee, smoothies, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient liquid food\nIngredients: 100% Organic Sugarcane Jaggery (Liquid Form)\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\nMfg. FSSAI Lic. No.: 10015043001123\nMfg. Scope Certificate No.: ORG-SC-2024-889\n\nWhy choose AMVI Organic Liquid Jaggery?\n• Convenient liquid form\n• Chemical-free processing\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4', name: 'Jaggery Powder Jar', category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Powder Jar Front.png',
    images: ['/Shoot Product only/Jaggery Powder Jar Front.png', '/Shoot Product only/Jaggery Powder Jar side.png', '/Shoot Product only/Jaggery Powder Jar Back.png'],
    rating: 4.9, reviewCount: 134,
    variations: [
      { id: 'v4-1', productId: '4', name: '500G', price: 320, stock: 70 },
      { id: 'v4-2', productId: '4', name: '1KG', price: 600, stock: 55 },
    ],
    description: `Our Organic Jaggery Powder in a convenient reusable jar. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\nMfg. FSSAI Lic. No.: 10015043001123\nMfg. Scope Certificate No.: ORG-SC-2024-889\n\nWhy choose AMVI Organic Jaggery Powder Jar?\n• Convenient reusable jar\n• Chemical-free processing\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5', name: 'Jaggery Powder', category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Powder Front Pouch.png',
    images: ['/Shoot Product only/Jaggery Powder Front Pouch.png', '/Shoot Product only/Jaggery Powder Back Pouch.png'],
    rating: 4.6, reviewCount: 89,
    variations: [
      { id: 'v5-1', productId: '5', name: '250G', price: 200, stock: 90 },
      { id: 'v5-2', productId: '5', name: '500G', price: 380, stock: 75 },
      { id: 'v5-3', productId: '5', name: '1KG', price: 700, stock: 60 },
    ],
    description: `Our Organic Jaggery Powder is chemical-free, rich in iron and minerals, a perfect healthy alternative to refined sugar.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\nMfg. FSSAI Lic. No.: 10015043001123\nMfg. Scope Certificate No.: ORG-SC-2024-889\n\nWhy choose AMVI Organic Jaggery Powder?\n• Chemical-free processing\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6', name: 'Jaggery Powder Pouch', category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Powder Front Pouch.png',
    images: ['/Shoot Product only/Jaggery Powder Front Pouch.png', '/Shoot Product only/Jaggery Powder Back Pouch.png'],
    rating: 4.6, reviewCount: 67,
    variations: [
      { id: 'v6-1', productId: '6', name: '250G', price: 180, stock: 90 },
      { id: 'v6-2', productId: '6', name: '500G', price: 340, stock: 75 },
    ],
    description: `Our Organic Jaggery Powder in a lightweight convenient pouch. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\nMfg. FSSAI Lic. No.: 10015043001123\nMfg. Scope Certificate No.: ORG-SC-2024-889\n\nWhy choose AMVI Organic Jaggery Powder Pouch?\n• Lightweight pouch packaging\n• Chemical-free processing\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c1', name: 'Jaggery Cubes + Powder + Liquid + Cubes Combo', category: 'Combo Deals',
    image: '/Product images for website/Product images for website/Combo 1.1.png',
    images: ['/Product images for website/Product images for website/Combo 1.1.png'],
    rating: 4.9, reviewCount: 78,
    variations: [
      { id: 'vc1-1', productId: 'c1', name: 'Combo Pack', price: 899, stock: 40 },
    ],
    description: `The ultimate jaggery combo — everything you need for a complete natural sweetener collection.\n\nWhat's Included\n• Jaggery Cubes (250G)\n• Jaggery Powder (250G)\n• Liquid Jaggery (500G)\n• Masala Jaggery Cubes (250G)\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nWhy choose this Combo?\n• Best value bundle\n• Try all our jaggery varieties\n• Chemical-free processing\n• Sourced from certified organic farms in Mandya\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2', name: 'Liquid Jaggery + Powder Combo', category: 'Combo Deals',
    image: '/Product images for website/Product images for website/Combo 4.png',
    images: ['/Product images for website/Product images for website/Combo 4.png'],
    rating: 4.8, reviewCount: 54,
    variations: [
      { id: 'vc2-1', productId: 'c2', name: 'Combo Pack', price: 549, stock: 50 },
    ],
    description: `A perfect duo of Organic Liquid Jaggery and Jaggery Powder — ideal for daily cooking, baking, and beverages.\n\nWhat's Included\n• Liquid Jaggery (500G)\n• Jaggery Powder (250G)\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nWhy choose this Combo?\n• Perfect daily use bundle\n• Chemical-free processing\n• Sourced from certified organic farms in Mandya\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c3', name: 'Jaggery Cubes + Powder + Liquid Combo', category: 'Combo Deals',
    image: '/Product images for website/Product images for website/Combo 7.png',
    images: ['/Product images for website/Product images for website/Combo 7.png'],
    rating: 5.0, reviewCount: 92,
    variations: [
      { id: 'vc3-1', productId: 'c3', name: 'Combo Pack', price: 749, stock: 45 },
    ],
    description: `Our most popular trio combo — Jaggery Cubes, Jaggery Powder, and Liquid Jaggery in one great value pack.\n\nWhat's Included\n• Jaggery Cubes (250G)\n• Jaggery Powder (250G)\n• Liquid Jaggery (500G)\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nWhy choose this Combo?\n• Most popular bundle\n• Save more with combo pricing\n• Chemical-free processing\n• Sourced from certified organic farms in Mandya\n• Sustainable packaging`,
    createdAt: new Date().toISOString(),
  },
];

let ok = 0, fail = 0;
for (const p of products) {
  const res = await fetch(`${BASE}/api/product-save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
  });
  const data = await res.json();
  if (data.success) { console.log(`✅ ${p.name}`); ok++; }
  else { console.log(`❌ ${p.name} — ${data.error}`); fail++; }
}
console.log(`\nDone: ${ok} seeded, ${fail} failed`);
