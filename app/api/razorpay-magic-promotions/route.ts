import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import {
  formatPromotion,
  getMagicAuthSecret,
  getOrderAmountFromReceipt,
  listActiveCoupons,
  unauthorizedResponse,
} from '@/lib/promotions';

async function handler(req: NextRequest) {
  try {
    await initDb();

    if (!getMagicAuthSecret(req, 'RAZORPAY_MAGIC_GET_PROMOTIONS_SECRET')) {
      return unauthorizedResponse();
    }

    const payload = req.method === 'GET'
      ? Object.fromEntries(req.nextUrl.searchParams)
      : await req.json().catch(() => ({}));

    const { order_id, contact, email } = payload;
    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Persist optional contact/email if provided (best-effort)
    if (contact || email) {
      await db.execute({
        sql: 'UPDATE checkout_sessions SET contact = COALESCE(?, contact), email = COALESCE(?, email) WHERE receipt = ?',
        args: [contact ?? null, email ?? null, order_id],
      }).catch(() => null);
    }

    const orderAmount = await getOrderAmountFromReceipt(order_id);
    const coupons = await listActiveCoupons();

    const promotions = coupons
      .filter(c => orderAmount === null || c.min_order <= orderAmount)
      .map(formatPromotion);

    return NextResponse.json({ promotions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
