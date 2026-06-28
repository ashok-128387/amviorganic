import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5', args: [] });
    const orders = result.rows.map(r => ({
      id: r.id,
      email: r.email,
      customerName: r.customer_name,
      rawItems: r.items,
      subtotal: r.subtotal,
      discount: r.discount,
      shipping: r.shipping,
      tax: r.tax,
      total: r.total,
      status: r.status,
      createdAt: r.created_at,
    }));
    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
