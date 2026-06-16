import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { products } = await req.json();
    if (!Array.isArray(products)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    for (let i = 0; i < products.length; i++) {
      await db.execute({
        sql: 'UPDATE products SET sort_order = ? WHERE id = ?',
        args: [i, products[i].id],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
