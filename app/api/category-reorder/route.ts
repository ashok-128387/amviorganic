import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { categories } = await req.json();
    if (!Array.isArray(categories)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    for (let i = 0; i < categories.length; i++) {
      await db.execute({
        sql: `INSERT INTO categories (name, sort_order) VALUES (?, ?)
              ON CONFLICT(name) DO UPDATE SET sort_order=excluded.sort_order`,
        args: [categories[i].trim(), i],
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
