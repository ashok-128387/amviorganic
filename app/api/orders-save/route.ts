import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const o = await req.json();
    if (!o.id || !o.email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await db.execute({
      sql: `INSERT OR IGNORE INTO orders
        (id, user_id, customer_name, email, phone, items, subtotal, discount, shipping, tax, total, status, shipping_address, razorpay_order_id, razorpay_payment_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        o.id, o.userId, o.customerName, o.email.toLowerCase(), o.phone,
        JSON.stringify(o.items), o.subtotal ?? o.total, o.discount ?? 0,
        o.shipping ?? 0, o.tax ?? 0, o.total, o.status ?? 'pending',
        o.shippingAddress ?? '', o.razorpayOrderId ?? '', o.razorpayPaymentId ?? '',
        new Date().toISOString(),
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
