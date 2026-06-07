import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const result = await db.execute({
      sql: 'SELECT id, name, email FROM users WHERE email = ?',
      args: [email.toLowerCase()],
    });

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return NextResponse.json({ exists: true, user: { id: user.id, name: user.name, email: user.email } });
    }
    return NextResponse.json({ exists: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
