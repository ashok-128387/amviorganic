import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { oldName, newName, sortOrder } = await req.json();
    if (!newName?.trim()) return NextResponse.json({ error: 'Category name required' }, { status: 400 });

    const trimmed = newName.trim();

    if (oldName && oldName !== trimmed) {
      // Rename category
      await db.execute({ sql: 'UPDATE categories SET name = ? WHERE name = ?', args: [trimmed, oldName] });
      await db.execute({ sql: 'UPDATE products SET category = ? WHERE category = ?', args: [trimmed, oldName] });
    }

    await db.execute({
      sql: `INSERT INTO categories (name, sort_order) VALUES (?, ?)
            ON CONFLICT(name) DO UPDATE SET sort_order=excluded.sort_order`,
      args: [trimmed, sortOrder ?? 0],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
