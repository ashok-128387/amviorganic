import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { sendNewOrderAdminEmail } from '@/lib/email';

async function getAdminEmail(): Promise<string> {
  if (process.env.ADMIN_EMAIL) return process.env.ADMIN_EMAIL;
  try {
    const result = await db.execute({ sql: 'SELECT value FROM site_settings WHERE key = ?', args: ['contactEmail'] });
    const row = result.rows[0];
    if (row?.value) return row.value as string;
  } catch {
    // ignore
  }
  return 'contact@amviorganics.com';
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const o = await req.json();
    if (!o.id || !o.email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Normalize Razorpay status to admin workflow
    const status = o.status === 'completed' ? 'processing' : (o.status || 'pending');

    await db.execute({
      sql: `INSERT OR IGNORE INTO orders
        (id, user_id, customer_name, email, phone, items, subtotal, discount, shipping, tax, total, status, shipping_address, billing_address, tracking_id, razorpay_order_id, razorpay_payment_id, gst_number, gst_company, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        o.id, o.userId ?? '', o.customerName ?? '', o.email.toLowerCase(), o.phone ?? '',
        JSON.stringify(o.items), o.subtotal ?? o.total, o.discount ?? 0,
        o.shipping ?? 0, o.tax ?? 0, o.total, status,
        o.shippingAddress ?? '', o.billingAddress ?? '', o.trackingId ?? '',
        o.razorpayOrderId ?? '', o.razorpayPaymentId ?? '',
        o.gstNumber ?? '', o.gstCompany ?? '',
        o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      ],
    });

    // Notify admin about the new order
    try {
      const adminEmail = await getAdminEmail();
      await sendNewOrderAdminEmail({
        orderId: o.id,
        customerName: o.customerName ?? '',
        email: o.email,
        phone: o.phone ?? '',
        items: (o.items || []).map((item: any) => ({
          name: item.name || 'Product',
          qty: item.qty ?? item.quantity ?? 1,
          price: item.price ?? 0,
        })),
        subtotal: o.subtotal ?? o.total,
        discount: o.discount ?? 0,
        shipping: o.shipping ?? 0,
        tax: o.tax ?? 0,
        total: o.total,
        shippingAddress: o.shippingAddress ?? '',
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
        razorpayPaymentId: o.razorpayPaymentId ?? '',
      }, adminEmail);
    } catch (emailErr: any) {
      // Don't fail the order if admin email fails
      console.error('Failed to send admin order notification:', emailErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
