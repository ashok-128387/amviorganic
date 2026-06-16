// Mock database data for ecommerce store
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  variations: ProductVariation[];
  createdAt: Date;
}

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variationId: string;
  quantity: number;
  addedAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  razorpayOrderId: string;
  razorpayPaymentId: string;
  email: string;
  phone: string;
  shippingAddress: string;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  variationId: string;
  quantity: number;
  qty?: number;
  price: number;
  name?: string;
}

export const mockProducts: Product[] = [
  // ── SWEETENERS ──
  {
    id: '1',
    name: 'Jaggery Cubes',
    description: `Our Organic Jaggery Cubes are made from the finest organic sugar cane. They are chemical-free, rich in iron and minerals, and a perfect healthy alternative to refined sugar.

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

How to Use
Use as a direct substitute for white sugar in tea, coffee, desserts, and traditional sweets. Can be consumed directly as a healthy snack.

Product Information & Compliance
Product Type: Single-ingredient food
Ingredients: 100% Organic Sugarcane Jaggery
Shelf Life: 12 Months from packaging
Brand FSSAI Lic. No.: 11223344556677
Mfg. FSSAI Lic. No.: 10015043001123
Mfg. Scope Certificate No.: ORG-SC-2024-889

Why choose AMVI Organic Jaggery Cubes?
• Sourced from certified organic farms in Mandya
• Chemical-free processing
• Rich in natural minerals
• Sustainable packaging`,
    category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Cubes Front Pouch.png',
    images: [
      '/Shoot Product only/Jaggery Cubes Front Pouch.png',
      '/Shoot Product only/Jaggery Cubes Back Pouch.png',
    ],
    rating: 5.0,
    reviewCount: 145,
    variations: [
      { id: 'v1-1', productId: '1', name: '250G', price: 230, stock: 80 },
      { id: 'v1-2', productId: '1', name: '500G', price: 420, stock: 70 },
      { id: 'v1-3', productId: '1', name: '1KG', price: 780, stock: 60 },
    ],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Masala Jaggery Cubes',
    description: `Our Organic Masala Jaggery Cubes are made from the finest organic sugar cane blended with traditional spices. They are chemical-free, rich in iron and minerals, and a perfect healthy alternative to refined sugar with added flavor.

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver
• Enhanced with Natural Spices

How to Use
Use as a direct substitute for white sugar in tea, coffee, desserts, and traditional sweets. Perfect for making spiced teas and can be consumed directly as a flavorful healthy snack.

Product Information & Compliance
Product Type: Single-ingredient food with natural spices
Ingredients: 100% Organic Sugarcane Jaggery, Natural Spices (Ginger, Cardamom, Black Pepper)
Shelf Life: 12 Months from packaging
Brand FSSAI Lic. No.: 11223344556677
Mfg. FSSAI Lic. No.: 10015043001123
Mfg. Scope Certificate No.: ORG-SC-2024-889

Why choose AMVI Organic Masala Jaggery Cubes?
• Sourced from certified organic farms in Mandya
• Chemical-free processing
• Rich in natural minerals
• Traditional spice blend
• Sustainable packaging`,
    category: 'Sweeteners',
    image: '/Shoot Product only/Masala Jaggery Cubes Front Pouch.png',
    images: [
      '/Shoot Product only/Masala Jaggery Cubes Front Pouch.png',
      '/Shoot Product only/Masala Jaggery Cubes Back Pouch.png',
    ],
    rating: 4.8,
    reviewCount: 112,
    variations: [
      { id: 'v2-1', productId: '2', name: '250G', price: 260, stock: 75 },
      { id: 'v2-2', productId: '2', name: '500G', price: 480, stock: 60 },
      { id: 'v2-3', productId: '2', name: '1KG', price: 880, stock: 45 },
    ],
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Liquid Jaggery',
    description: `Our Organic Liquid Jaggery is made from the finest organic sugar cane. It is chemical-free, rich in iron and minerals, and a perfect healthy alternative to refined sugar in liquid form for easy mixing.

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver
• Easy to Dissolve

How to Use
Use as a direct substitute for white sugar and honey in tea, coffee, smoothies, desserts, and baking. Perfect for making traditional sweets and beverages.

Product Information & Compliance
Product Type: Single-ingredient liquid food
Ingredients: 100% Organic Sugarcane Jaggery (Liquid Form)
Shelf Life: 12 Months from packaging
Brand FSSAI Lic. No.: 11223344556677
Mfg. FSSAI Lic. No.: 10015043001123
Mfg. Scope Certificate No.: ORG-SC-2024-889

Why choose AMVI Organic Liquid Jaggery?
• Sourced from certified organic farms in Mandya
• Chemical-free processing
• Rich in natural minerals
• Convenient liquid form
• Sustainable packaging`,
    category: 'Sweeteners',
    image: '/Shoot Product only/Liquid Jaggery front.png',
    images: [
      '/Shoot Product only/Liquid Jaggery front.png',
      '/Shoot Product only/Liquid Jaggery side.png',
      '/Shoot Product only/Liquid Jaggery back.png',
    ],
    rating: 4.7,
    reviewCount: 98,
    variations: [
      { id: 'v3-1', productId: '3', name: '500G', price: 350, stock: 65 },
      { id: 'v3-2', productId: '3', name: '1KG', price: 650, stock: 50 },
    ],
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Jaggery Powder Jar',
    description: `Our Organic Jaggery Powder is made from the finest organic sugar cane. It is chemical-free, rich in iron and minerals, and a perfect healthy alternative to refined sugar. Conveniently packed in a reusable jar.

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

How to Use
Use as a direct substitute for white sugar in tea, coffee, desserts, and baking. Easy to measure and store in the convenient jar.

Product Information & Compliance
Product Type: Single-ingredient food
Ingredients: 100% Organic Sugarcane Jaggery
Shelf Life: 12 Months from packaging
Brand FSSAI Lic. No.: 11223344556677
Mfg. FSSAI Lic. No.: 10015043001123
Mfg. Scope Certificate No.: ORG-SC-2024-889

Why choose AMVI Organic Jaggery Powder Jar?
• Sourced from certified organic farms in Mandya
• Chemical-free processing
• Rich in natural minerals
• Convenient reusable jar
• Sustainable packaging`,
    category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Powder Jar Front.png',
    images: [
      '/Shoot Product only/Jaggery Powder Jar Front.png',
      '/Shoot Product only/Jaggery Powder Jar side.png',
      '/Shoot Product only/Jaggery Powder Jar Back.png',
    ],
    rating: 4.9,
    reviewCount: 134,
    variations: [
      { id: 'v4-1', productId: '4', name: '500G', price: 320, stock: 70 },
      { id: 'v4-2', productId: '4', name: '1KG', price: 600, stock: 55 },
    ],
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Jaggery Powder',
    description: `Our Organic Jaggery Powder is made from the finest organic sugar cane. It is chemical-free, rich in iron and minerals, and a perfect healthy alternative to refined sugar.

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

How to Use
Use as a direct substitute for white sugar in tea, coffee, desserts, and baking.

Product Information & Compliance
Product Type: Single-ingredient food
Ingredients: 100% Organic Sugarcane Jaggery
Shelf Life: 12 Months from packaging
Brand FSSAI Lic. No.: 11223344556677
Mfg. FSSAI Lic. No.: 10015043001123
Mfg. Scope Certificate No.: ORG-SC-2024-889

Why choose AMVI Organic Jaggery Powder?
• Sourced from certified organic farms in Mandya
• Chemical-free processing
• Rich in natural minerals
• Sustainable packaging`,
    category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Powder Front Pouch.png',
    images: [
      '/Shoot Product only/Jaggery Powder Front Pouch.png',
      '/Shoot Product only/Jaggery Powder Back Pouch.png',
    ],
    rating: 4.6,
    reviewCount: 89,
    variations: [
      { id: 'v5-1', productId: '5', name: '250G', price: 200, stock: 90 },
      { id: 'v5-2', productId: '5', name: '500G', price: 380, stock: 75 },
      { id: 'v5-3', productId: '5', name: '1KG', price: 700, stock: 60 },
    ],
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'Jaggery Powder Pouch',
    description: `Our Organic Jaggery Powder in a convenient pouch. Made from the finest organic sugar cane, chemical-free and rich in iron and minerals.

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

How to Use
Use as a direct substitute for white sugar in tea, coffee, desserts, and baking.

Product Information & Compliance
Product Type: Single-ingredient food
Ingredients: 100% Organic Sugarcane Jaggery
Shelf Life: 12 Months from packaging
Brand FSSAI Lic. No.: 11223344556677
Mfg. FSSAI Lic. No.: 10015043001123
Mfg. Scope Certificate No.: ORG-SC-2024-889

Why choose AMVI Organic Jaggery Powder Pouch?
• Sourced from certified organic farms in Mandya
• Chemical-free processing
• Rich in natural minerals
• Lightweight pouch packaging
• Sustainable packaging`,
    category: 'Sweeteners',
    image: '/Shoot Product only/Jaggery Powder Front Pouch.png',
    images: [
      '/Shoot Product only/Jaggery Powder Front Pouch.png',
      '/Shoot Product only/Jaggery Powder Back Pouch.png',
    ],
    rating: 4.6,
    reviewCount: 67,
    variations: [
      { id: 'v6-1', productId: '6', name: '250G', price: 180, stock: 90 },
      { id: 'v6-2', productId: '6', name: '500G', price: 340, stock: 75 },
    ],
    createdAt: new Date(),
  },

  // ── COMBO DEALS ──
  {
    id: 'c1',
    name: 'Jaggery Cubes + Powder + Liquid + Cubes Combo',
    description: `The ultimate jaggery combo — everything you need for a complete natural sweetener collection.

What's Included
• Jaggery Cubes (250G)
• Jaggery Powder (250G)
• Liquid Jaggery (500G)
• Masala Jaggery Cubes (250G)

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

Why choose this Combo?
• Best value bundle
• Try all our jaggery varieties
• Chemical-free processing
• Sourced from certified organic farms in Mandya
• Sustainable packaging`,
    category: 'Combo Deals',
    image: '/Product images for website/Product images for website/Combo 1.1.png',
    images: ['/Product images for website/Product images for website/Combo 1.1.png'],
    rating: 4.9,
    reviewCount: 78,
    variations: [
      { id: 'vc1-1', productId: 'c1', name: 'Combo Pack', price: 899, stock: 40 },
    ],
    createdAt: new Date(),
  },
  {
    id: 'c2',
    name: 'Liquid Jaggery + Powder Combo',
    description: `A perfect duo of our Organic Liquid Jaggery and Jaggery Powder — ideal for daily cooking, baking, and beverages.

What's Included
• Liquid Jaggery (500G)
• Jaggery Powder (250G)

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

Why choose this Combo?
• Perfect daily use bundle
• Chemical-free processing
• Sourced from certified organic farms in Mandya
• Sustainable packaging`,
    category: 'Combo Deals',
    image: '/Product images for website/Product images for website/Combo 4.png',
    images: ['/Product images for website/Product images for website/Combo 4.png'],
    rating: 4.8,
    reviewCount: 54,
    variations: [
      { id: 'vc2-1', productId: 'c2', name: 'Combo Pack', price: 549, stock: 50 },
    ],
    createdAt: new Date(),
  },
  {
    id: 'c3',
    name: 'Jaggery Cubes + Powder + Liquid Combo',
    description: `Our most popular trio combo — Jaggery Cubes, Jaggery Powder, and Liquid Jaggery in one great value pack.

What's Included
• Jaggery Cubes (250G)
• Jaggery Powder (250G)
• Liquid Jaggery (500G)

Health Benefits
• Rich in Iron & Minerals
• Boosts Immunity
• Aids Digestion
• Cleanses the Liver

Why choose this Combo?
• Most popular bundle
• Save more with combo pricing
• Chemical-free processing
• Sourced from certified organic farms in Mandya
• Sustainable packaging`,
    category: 'Combo Deals',
    image: '/Product images for website/Product images for website/Combo 7.png',
    images: ['/Product images for website/Product images for website/Combo 7.png'],
    rating: 5.0,
    reviewCount: 92,
    variations: [
      { id: 'vc3-1', productId: 'c3', name: 'Combo Pack', price: 749, stock: 45 },
    ],
    createdAt: new Date(),
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userId: 'user1',
    rating: 5,
    title: 'Pure and authentic',
    comment: 'Best jaggery cubes I have tasted. Pure and chemical-free.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'r2',
    productId: '1',
    userId: 'user2',
    rating: 5,
    title: 'Perfect sweetness',
    comment: 'Natural sweetness without any artificial taste. Highly recommend!',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'r3',
    productId: '2',
    userId: 'user3',
    rating: 5,
    title: 'Amazing spiced flavor',
    comment: 'The masala blend is perfect. Great for tea and direct consumption.',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];
