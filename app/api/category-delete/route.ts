import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { name, reassignTo } = await req.json();
    if (!name) return NextResponse.json({ error: 'Category name required' }, { status: 400 });

    const fallback = reassignTo?.trim() || 'Uncategorized';
    await db.execute({ sql: 'UPDATE products SET category = ? WHERE category = ?', args: [fallback, name] });
    await db.execute({ sql: 'DELETE FROM categories WHERE name = ?', args: [name] });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
