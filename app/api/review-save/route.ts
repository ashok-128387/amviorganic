import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const r = await req.json();
    await db.execute({
      sql: `INSERT INTO reviews (id, product_id, product_name, customer_name, email, rating, title, comment, approved, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              product_id=excluded.product_id, product_name=excluded.product_name,
              customer_name=excluded.customer_name, email=excluded.email,
              rating=excluded.rating, title=excluded.title,
              comment=excluded.comment, approved=excluded.approved`,
      args: [
        r.id, r.productId, r.productName, r.customerName,
        r.email || '', r.rating || 5, r.title || '',
        r.comment, r.approved ? 1 : 0,
        r.createdAt || new Date().toISOString(),
      ],
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
