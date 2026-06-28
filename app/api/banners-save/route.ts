import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { banners } = await req.json();
    if (!Array.isArray(banners)) {
      return NextResponse.json({ error: 'Invalid banners data' }, { status: 400 });
    }
    await db.execute({
      sql: `INSERT INTO site_settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
      args: ['banners', JSON.stringify(banners.filter(Boolean))],
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
