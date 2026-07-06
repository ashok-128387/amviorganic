import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const p = await req.json();
    await db.execute({
      sql: `INSERT INTO products (id, name, description, category, image, images, rating, review_count, variations, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name, description=excluded.description, category=excluded.category,
              image=excluded.image, images=excluded.images, rating=excluded.rating,
              review_count=excluded.review_count, variations=excluded.variations`,
      args: [
        p.id, p.name, p.description || '', p.category || 'Sweeteners',
        p.image || '', JSON.stringify(p.images || []),
        p.rating ?? 5, p.reviewCount ?? 0,
        JSON.stringify(p.variations || []),
        p.createdAt || new Date().toISOString(),
      ],
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
