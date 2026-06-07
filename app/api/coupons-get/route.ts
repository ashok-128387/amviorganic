import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM coupons', args: [] });
    const coupons = result.rows.map(r => ({
      id: r.id, code: r.code, type: r.type, value: r.value,
      minOrder: r.min_order, maxUses: r.max_uses, usedCount: r.used_count,
      active: r.active === 1, expiresAt: r.expires_at,
    }));
    return NextResponse.json({ coupons });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
