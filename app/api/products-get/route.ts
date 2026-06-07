import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM products ORDER BY created_at ASC', args: [] });
    const products = result.rows.map(r => ({
      id: r.id, name: r.name, description: r.description, category: r.category,
      image: r.image, images: JSON.parse(r.images as string || '[]'),
      rating: r.rating, reviewCount: r.review_count,
      variations: JSON.parse(r.variations as string), createdAt: r.created_at,
    }));
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
