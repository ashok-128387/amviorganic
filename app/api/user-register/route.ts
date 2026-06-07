import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { id, name, email } = await req.json();
    if (!id || !name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, name, email, registered_at) VALUES (?, ?, ?, ?)',
      args: [id, name, email.toLowerCase(), new Date().toISOString()],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
