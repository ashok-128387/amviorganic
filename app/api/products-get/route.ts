import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({
      sql: `
        SELECT p.*, c.sort_order as cat_order
        FROM products p
        LEFT JOIN categories c ON p.category = c.name
        ORDER BY c.sort_order ASC, p.sort_order ASC, p.created_at ASC
      `,
      args: [],
    });

    const reviewsResult = await db.execute({
      sql: `SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE approved = 1 GROUP BY product_id`,
      args: [],
    });
    const reviewMap = new Map<string, { avg: number; count: number }>();
    for (const row of reviewsResult.rows) {
      reviewMap.set(row.product_id as string, {
        avg: Number(row.avg_rating) || 0,
        count: Number(row.review_count) || 0,
      });
    }

    const products = result.rows.map(r => {
      const reviewStats = reviewMap.get(r.id as string);
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        sku: r.sku,
        image: r.image,
        images: JSON.parse(r.images as string || '[]'),
        rating: reviewStats ? Number(reviewStats.avg.toFixed(1)) : 0,
        reviewCount: reviewStats ? reviewStats.count : 0,
        variations: JSON.parse(r.variations as string),
        sortOrder: r.sort_order ?? 0,
        createdAt: r.created_at,
      };
    });
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
