import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const p = await req.json();
    await db.execute({
      sql: `INSERT INTO products (id, name, description, category, sku, image, images, rating, review_count, variations, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name, description=excluded.description, category=excluded.category,
              sku=excluded.sku, image=excluded.image, images=excluded.images, rating=excluded.rating,
              review_count=excluded.review_count, variations=excluded.variations, sort_order=excluded.sort_order`,
      args: [
        p.id, p.name, p.description || '', p.category || 'Sweeteners',
        p.sku || '', p.image || '', JSON.stringify(p.images || []),
        p.rating ?? 5, p.reviewCount ?? 0,
        JSON.stringify(p.variations || []),
        p.sortOrder ?? 0,
        p.createdAt || new Date().toISOString(),
      ],
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
