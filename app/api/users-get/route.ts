import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM users ORDER BY registered_at DESC', args: [] });
    const users = result.rows.map(r => ({
      id: r.id, name: r.name, email: r.email, registeredAt: r.registered_at,
    }));
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
