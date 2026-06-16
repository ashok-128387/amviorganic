import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

interface ImportVariation {
  name: string;
  price: number;
  stock: number;
}

interface ImportProduct {
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  image?: string;
  images?: string[];
  variations: ImportVariation[];
}

function parseVariations(raw: string): ImportVariation[] {
  if (!raw?.trim()) return [{ name: 'Default', price: 0, stock: 0 }];
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return parsed.map((v: any) => ({
      name: String(v.name || v.n || 'Default'),
      price: Number(v.price || v.p || 0),
      stock: Number(v.stock || v.s || 0),
    }));
  }
  return [{ name: 'Default', price: 0, stock: 0 }];
}

function parseCSV(text: string): ImportProduct[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const products: ImportProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });

    const variations = parseVariations(row.variations || row.variants || '[]');
    const images = (row.images || '').split(',').map(s => s.trim()).filter(Boolean);

    products.push({
      name: row.name?.trim() || `Imported Product ${i}`,
      description: row.description || row.desc || '',
      category: row.category?.trim() || 'Uncategorized',
      sku: row.sku?.trim() || '',
      image: row.image?.trim() || images[0] || '',
      images,
      variations,
    });
  }

  return products;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(s => s.replace(/^"|"$/g, ''));
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const isJson = file.name.endsWith('.json') || text.trim().startsWith('[');
    const products: ImportProduct[] = isJson ? JSON.parse(text) : parseCSV(text);

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No valid products found in file' }, { status: 400 });
    }

    let imported = 0;
    const errors: string[] = [];

    for (const p of products) {
      try {
        const id = `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const category = p.category?.trim() || 'Uncategorized';
        const image = p.image || p.images?.[0] || '';
        const variations = (p.variations || []).map((v, i) => ({
          id: `v-${id}-${i}`,
          productId: id,
          name: v.name || 'Default',
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0,
        }));

        if (variations.length === 0) {
          variations.push({ id: `v-${id}-0`, productId: id, name: 'Default', price: 0, stock: 0 });
        }

        await db.execute({
          sql: `INSERT INTO products (id, name, description, category, sku, image, images, rating, review_count, variations, sort_order, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            id, p.name?.trim() || 'Unnamed Product', p.description || '', category, p.sku || '',
            image, JSON.stringify(p.images || [image]), 5, 0,
            JSON.stringify(variations), 0, new Date().toISOString(),
          ],
        });

        await db.execute({
          sql: 'INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, (SELECT COALESCE(MAX(sort_order)+1,0) FROM categories))',
          args: [category],
        });

        imported++;
      } catch (e: any) {
        errors.push(`${p.name || 'Unnamed'}: ${e.message}`);
      }
    }

    return NextResponse.json({ success: true, imported, total: products.length, errors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
