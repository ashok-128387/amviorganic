import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM reviews ORDER BY created_at DESC', args: [] });
    const reviews = result.rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      productName: r.product_name,
      customerName: r.customer_name,
      email: r.email,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      approved: r.approved === 1,
      verifiedPurchase: r.verified_purchase === 1,
      createdAt: r.created_at,
    }));
    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
