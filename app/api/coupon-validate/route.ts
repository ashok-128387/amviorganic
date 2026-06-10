import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { code, orderTotal } = await req.json();
    if (!code) return NextResponse.json({ valid: false, discount: 0, message: 'Invalid coupon code' });

    const result = await db.execute({
      sql: 'SELECT * FROM coupons WHERE code = ?',
      args: [code.toUpperCase()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ valid: false, discount: 0, message: 'Invalid coupon code' });
    }

    const coupon = result.rows[0];
    const active = coupon.active === 1;
    const expiresAt = new Date(coupon.expires_at as string);
    const usedCount = coupon.used_count as number;
    const maxUses = coupon.max_uses as number;
    const minOrder = coupon.min_order as number;
    const value = coupon.value as number;
    const type = coupon.type as string;

    if (!active) return NextResponse.json({ valid: false, discount: 0, message: 'Coupon is inactive' });
    if (expiresAt < new Date()) return NextResponse.json({ valid: false, discount: 0, message: 'Coupon has expired' });
    if (usedCount >= maxUses) return NextResponse.json({ valid: false, discount: 0, message: 'Coupon usage limit reached' });
    if (orderTotal < minOrder) return NextResponse.json({ valid: false, discount: 0, message: `Minimum order ₹${minOrder} required` });

    const discount = type === 'percent' ? Math.round((orderTotal * value) / 100) : value;
    return NextResponse.json({ valid: true, discount, message: `Coupon applied! You save ₹${discount}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
