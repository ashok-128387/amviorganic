import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM categories ORDER BY sort_order ASC, name ASC', args: [] });
    const categories = result.rows.map(r => ({ name: r.name, sortOrder: r.sort_order }));
    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
