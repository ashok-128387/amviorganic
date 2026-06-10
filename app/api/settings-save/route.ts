import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();
    const entries = Object.entries(body);
    for (const [key, value] of entries) {
      await db.execute({
        sql: `INSERT INTO site_settings (key, value) VALUES (?, ?)
              ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
        args: [key, String(value)],
      });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
