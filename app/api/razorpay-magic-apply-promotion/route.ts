import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import {
  getCouponByCode,
  getMagicAuthSecret,
  getOrderAmountFromReceipt,
  toPaise,
  unauthorizedResponse,
  validateCouponForOrder,
} from '@/lib/promotions';

async function handler(req: NextRequest) {
  try {
    await initDb();

    if (!getMagicAuthSecret(req, 'RAZORPAY_MAGIC_APPLY_PROMOTION_SECRET')) {
      return unauthorizedResponse();
    }

    const payload = req.method === 'GET'
      ? Object.fromEntries(req.nextUrl.searchParams)
      : await req.json().catch(() => ({}));

    const { order_id, code, contact, email } = payload;
    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    // Persist optional contact/email if provided (best-effort)
    if (contact || email) {
      await db.execute({
        sql: 'UPDATE checkout_sessions SET contact = COALESCE(?, contact), email = COALESCE(?, email) WHERE receipt = ?',
        args: [contact ?? null, email ?? null, order_id],
      }).catch(() => null);
    }

    const orderAmount = await getOrderAmountFromReceipt(order_id);
    if (orderAmount === null) {
      return NextResponse.json(
        { error: 'Order session not found. Please create a Razorpay order first.' },
        { status: 404 }
      );
    }

    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const validation = validateCouponForOrder(coupon, orderAmount);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const promotion = {
      reference_id: coupon.id,
      code: coupon.code,
      type: 'coupon' as const,
      value: toPaise(validation.discount),
      value_type: (coupon.type === 'percent' ? 'percentage' : 'fixed_amount') as 'percentage' | 'fixed_amount',
      description: coupon.type === 'percent'
        ? `${coupon.value}% off applied`
        : `₹${coupon.value} off applied`,
    };

    return NextResponse.json({ promotion });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
