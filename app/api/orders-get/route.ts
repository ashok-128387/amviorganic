import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const result = email
      ? await db.execute({ sql: 'SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC', args: [email.toLowerCase()] })
      : await db.execute({ sql: 'SELECT * FROM orders ORDER BY created_at DESC', args: [] });

    const orders = result.rows.map(r => ({
      id: r.id, userId: r.user_id, customerName: r.customer_name,
      email: r.email, phone: r.phone, items: JSON.parse(r.items as string),
      subtotal: r.subtotal, discount: r.discount, shipping: r.shipping,
      tax: r.tax, total: r.total, status: r.status,
      shippingAddress: r.shipping_address, billingAddress: r.billing_address,
      trackingId: r.tracking_id,
      razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id,
      gstNumber: r.gst_number, gstCompany: r.gst_company,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
