import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'amvi.db');

export const db = createClient({ url: `file:${dbPath}` });

export async function initDb() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      registered_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      sku TEXT,
      image TEXT,
      images TEXT,
      rating REAL DEFAULT 5,
      review_count INTEGER DEFAULT 0,
      variations TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      min_order REAL NOT NULL DEFAULT 0,
      max_uses INTEGER NOT NULL DEFAULT 100,
      used_count INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      author TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      shipping REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      shipping_address TEXT,
      billing_address TEXT,
      tracking_id TEXT,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      gst_number TEXT,
      gst_company TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT,
      rating INTEGER NOT NULL DEFAULT 5,
      title TEXT,
      comment TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 0,
      verified_purchase INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS checkout_sessions (
      receipt TEXT PRIMARY KEY,
      razorpay_order_id TEXT,
      amount REAL NOT NULL,
      line_items_total REAL,
      items TEXT,
      contact TEXT,
      email TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await runMigrations();
  await seedProducts();
  await seedCategories();
}

async function columnExists(table: string, column: string) {
  try {
    const result = await db.execute({ sql: `SELECT ${column} FROM ${table} LIMIT 1`, args: [] });
    return true;
  } catch {
    return false;
  }
}

async function runMigrations() {
  // Add sku column to products
  if (!(await columnExists('products', 'sku'))) {
    await db.execute({ sql: 'ALTER TABLE products ADD COLUMN sku TEXT', args: [] });
  }
  // Add sort_order column to products
  if (!(await columnExists('products', 'sort_order'))) {
    await db.execute({ sql: 'ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0', args: [] });
  }
  // Add billing_address column to orders
  if (!(await columnExists('orders', 'billing_address'))) {
    await db.execute({ sql: 'ALTER TABLE orders ADD COLUMN billing_address TEXT', args: [] });
  }
  // Add gst_number column to orders
  if (!(await columnExists('orders', 'gst_number'))) {
    await db.execute({ sql: 'ALTER TABLE orders ADD COLUMN gst_number TEXT', args: [] });
  }
  // Add gst_company column to orders
  if (!(await columnExists('orders', 'gst_company'))) {
    await db.execute({ sql: 'ALTER TABLE orders ADD COLUMN gst_company TEXT', args: [] });
  }
  // Add verified_purchase column to reviews
  if (!(await columnExists('reviews', 'verified_purchase'))) {
    await db.execute({ sql: 'ALTER TABLE reviews ADD COLUMN verified_purchase INTEGER DEFAULT 0', args: [] });
  }
  // Add checkout_sessions table for Razorpay Magic Checkout
  if (!(await columnExists('checkout_sessions', 'amount'))) {
    await db.execute({
      sql: `CREATE TABLE IF NOT EXISTS checkout_sessions (
        receipt TEXT PRIMARY KEY,
        razorpay_order_id TEXT,
        amount REAL NOT NULL,
        line_items_total REAL,
        items TEXT,
        contact TEXT,
        email TEXT,
        created_at TEXT NOT NULL
      )`,
      args: [],
    });
  }
}

async function seedCategories() {
  const { rows } = await db.execute({ sql: 'SELECT COUNT(*) as count FROM categories', args: [] });
  if ((rows[0].count as number) > 0) return;

  const defaultCategories = ['Sweeteners', 'Combo Deals', 'New'];
  for (let i = 0; i < defaultCategories.length; i++) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)',
      args: [defaultCategories[i], i],
    });
  }

  // Also sync any categories already used by products
  const productCats = await db.execute({
    sql: 'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ""',
    args: [],
  });
  for (let i = 0; i < productCats.rows.length; i++) {
    const cat = productCats.rows[i].category as string;
    if (!cat) continue;
    await db.execute({
      sql: 'INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)',
      args: [cat, defaultCategories.length + i],
    });
  }
}

async function seedProducts() {
  const { rows } = await db.execute({ sql: 'SELECT COUNT(*) as count FROM products', args: [] });
  if ((rows[0].count as number) > 0) return;

  const products = [
    { id: '1', name: 'Jaggery Cubes', category: 'Sweeteners', sku: 'AMVI-001', image: '/Shoot Product only/Jaggery Cubes Front Pouch.png', images: ['/Shoot Product only/Jaggery Cubes Front Pouch.png', '/Shoot Product only/Jaggery Cubes Back Pouch.png'], rating: 5.0, reviewCount: 145, variations: [{ id: 'v1-1', productId: '1', name: '250G', price: 230, stock: 80 }, { id: 'v1-2', productId: '1', name: '500G', price: 420, stock: 70 }, { id: 'v1-3', productId: '1', name: '1KG', price: 780, stock: 60 }], description: 'Our Organic Jaggery Cubes are made from the finest organic sugar cane. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and traditional sweets.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\n\nWhy choose AMVI Organic Jaggery Cubes?\n• Sourced from certified organic farms in Mandya\n• Chemical-free processing\n• Sustainable packaging' },
    { id: '2', name: 'Masala Jaggery Cubes', category: 'Sweeteners', sku: 'AMVI-002', image: '/Shoot Product only/Masala Jaggery Cubes Front Pouch.png', images: ['/Shoot Product only/Masala Jaggery Cubes Front Pouch.png', '/Shoot Product only/Masala Jaggery Cubes Back Pouch.png'], rating: 4.8, reviewCount: 112, variations: [{ id: 'v2-1', productId: '2', name: '250G', price: 260, stock: 75 }, { id: 'v2-2', productId: '2', name: '500G', price: 480, stock: 60 }, { id: 'v2-3', productId: '2', name: '1KG', price: 880, stock: 45 }], description: 'Our Organic Masala Jaggery Cubes blended with traditional spices. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Cleanses the Liver\n\nHow to Use\nPerfect for spiced teas and direct consumption.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food with natural spices\nIngredients: 100% Organic Sugarcane Jaggery, Natural Spices\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\n\nWhy choose AMVI Organic Masala Jaggery Cubes?\n• Sourced from certified organic farms in Mandya\n• Traditional spice blend\n• Sustainable packaging' },
    { id: '3', name: 'Liquid Jaggery', category: 'Sweeteners', sku: 'AMVI-003', image: '/Shoot Product only/Liquid Jaggery front.png', images: ['/Shoot Product only/Liquid Jaggery front.png', '/Shoot Product only/Liquid Jaggery side.png', '/Shoot Product only/Liquid Jaggery back.png'], rating: 4.7, reviewCount: 98, variations: [{ id: 'v3-1', productId: '3', name: '500G', price: 350, stock: 65 }, { id: 'v3-2', productId: '3', name: '1KG', price: 650, stock: 50 }], description: 'Our Organic Liquid Jaggery is chemical-free, rich in iron and minerals, perfect for easy mixing.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n• Easy to Dissolve\n\nHow to Use\nUse as a substitute for sugar and honey in tea, coffee, smoothies, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient liquid food\nIngredients: 100% Organic Sugarcane Jaggery (Liquid Form)\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\n\nWhy choose AMVI Organic Liquid Jaggery?\n• Convenient liquid form\n• Chemical-free processing\n• Sustainable packaging' },
    { id: '4', name: 'Jaggery Powder Jar', category: 'Sweeteners', sku: 'AMVI-004', image: '/Shoot Product only/Jaggery Powder Jar Front.png', images: ['/Shoot Product only/Jaggery Powder Jar Front.png', '/Shoot Product only/Jaggery Powder Jar side.png', '/Shoot Product only/Jaggery Powder Jar Back.png'], rating: 4.9, reviewCount: 134, variations: [{ id: 'v4-1', productId: '4', name: '500G', price: 320, stock: 70 }, { id: 'v4-2', productId: '4', name: '1KG', price: 600, stock: 55 }], description: 'Our Organic Jaggery Powder in a reusable jar. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\n\nWhy choose AMVI Organic Jaggery Powder Jar?\n• Convenient reusable jar\n• Sustainable packaging' },
    { id: '5', name: 'Jaggery Powder', category: 'Sweeteners', sku: 'AMVI-005', image: '/Shoot Product only/Jaggery Powder Front Pouch.png', images: ['/Shoot Product only/Jaggery Powder Front Pouch.png', '/Shoot Product only/Jaggery Powder Back Pouch.png'], rating: 4.6, reviewCount: 89, variations: [{ id: 'v5-1', productId: '5', name: '250G', price: 200, stock: 90 }, { id: 'v5-2', productId: '5', name: '500G', price: 380, stock: 75 }, { id: 'v5-3', productId: '5', name: '1KG', price: 700, stock: 60 }], description: 'Our Organic Jaggery Powder is chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\n\nWhy choose AMVI Organic Jaggery Powder?\n• Chemical-free processing\n• Sustainable packaging' },
    { id: '6', name: 'Jaggery Powder Pouch', category: 'Sweeteners', sku: 'AMVI-006', image: '/Shoot Product only/Jaggery Powder Front Pouch.png', images: ['/Shoot Product only/Jaggery Powder Front Pouch.png', '/Shoot Product only/Jaggery Powder Back Pouch.png'], rating: 4.6, reviewCount: 67, variations: [{ id: 'v6-1', productId: '6', name: '250G', price: 180, stock: 90 }, { id: 'v6-2', productId: '6', name: '500G', price: 340, stock: 75 }], description: 'Our Organic Jaggery Powder in a lightweight pouch. Chemical-free, rich in iron and minerals.\n\nHealth Benefits\n• Rich in Iron & Minerals\n• Boosts Immunity\n• Aids Digestion\n\nHow to Use\nUse as a direct substitute for white sugar in tea, coffee, desserts, and baking.\n\nProduct Information & Compliance\nProduct Type: Single-ingredient food\nIngredients: 100% Organic Sugarcane Jaggery\nShelf Life: 12 Months from packaging\nBrand FSSAI Lic. No.: 11223344556677\n\nWhy choose AMVI Organic Jaggery Powder Pouch?\n• Lightweight pouch\n• Sustainable packaging' },
    { id: 'c1', name: 'Jaggery Cubes + Powder + Liquid + Cubes Combo', category: 'Combo Deals', sku: 'AMVI-C1', image: '/Product images for website/Product images for website/Combo 1.1.png', images: ['/Product images for website/Product images for website/Combo 1.1.png'], rating: 4.9, reviewCount: 78, variations: [{ id: 'vc1-1', productId: 'c1', name: 'Combo Pack', price: 899, stock: 40 }], description: 'The ultimate jaggery combo.\n\nWhat\'s Included\n• Jaggery Cubes (250G)\n• Jaggery Powder (250G)\n• Liquid Jaggery (500G)\n• Masala Jaggery Cubes (250G)\n\nWhy choose this Combo?\n• Best value bundle\n• Chemical-free processing\n• Sustainable packaging' },
    { id: 'c2', name: 'Liquid Jaggery + Powder Combo', category: 'Combo Deals', sku: 'AMVI-C2', image: '/Product images for website/Product images for website/Combo 4.png', images: ['/Product images for website/Product images for website/Combo 4.png'], rating: 4.8, reviewCount: 54, variations: [{ id: 'vc2-1', productId: 'c2', name: 'Combo Pack', price: 549, stock: 50 }], description: 'A perfect duo for daily cooking and beverages.\n\nWhat\'s Included\n• Liquid Jaggery (500G)\n• Jaggery Powder (250G)\n\nWhy choose this Combo?\n• Perfect daily use bundle\n• Chemical-free processing\n• Sustainable packaging' },
    { id: 'c3', name: 'Jaggery Cubes + Powder + Liquid Combo', category: 'Combo Deals', sku: 'AMVI-C3', image: '/Product images for website/Product images for website/Combo 7.png', images: ['/Product images for website/Product images for website/Combo 7.png'], rating: 5.0, reviewCount: 92, variations: [{ id: 'vc3-1', productId: 'c3', name: 'Combo Pack', price: 749, stock: 45 }], description: 'Our most popular trio combo.\n\nWhat\'s Included\n• Jaggery Cubes (250G)\n• Jaggery Powder (250G)\n• Liquid Jaggery (500G)\n\nWhy choose this Combo?\n• Most popular bundle\n• Chemical-free processing\n• Sustainable packaging' },
  ];

  for (const p of products) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO products (id, name, description, category, sku, image, images, rating, review_count, variations, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.name, p.description, p.category, p.sku, p.image, JSON.stringify(p.images), p.rating, p.reviewCount, JSON.stringify(p.variations), 0, new Date().toISOString()],
    });
  }
}
