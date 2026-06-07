import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const c = await req.json();
    await db.execute({
      sql: `INSERT INTO coupons (id, code, type, value, min_order, max_uses, used_count, active, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              code=excluded.code, type=excluded.type, value=excluded.value,
              min_order=excluded.min_order, max_uses=excluded.max_uses,
              used_count=excluded.used_count, active=excluded.active, expires_at=excluded.expires_at`,
      args: [c.id, c.code, c.type, c.value, c.minOrder, c.maxUses, c.usedCount || 0, c.active ? 1 : 0, c.expiresAt],
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
