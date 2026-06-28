import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

function normalizeItems(items: any[], productPrices: Record<string, number>) {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    const qtyRaw = item.qty ?? item.quantity ?? 1;
    const qty = Number(qtyRaw);
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
    let price = Number(item.price ?? 0);
    // Fallback: try to get price from product lookup if missing/invalid
    if ((!price || !Number.isFinite(price)) && item.productId) {
      price = productPrices[item.productId] || 0;
    }
    return {
      ...item,
      qty: safeQty,
      quantity: safeQty,
      price: Number.isFinite(price) && price > 0 ? price : 0,
      name: item.name || 'Product',
      productId: item.productId || item.id || '',
      variationId: item.variationId || '',
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    // Build a price lookup map from products
    const productsResult = await db.execute({ sql: 'SELECT id, variations FROM products', args: [] });
    const productPrices: Record<string, number> = {};
    for (const row of productsResult.rows) {
      try {
        const variations = JSON.parse(row.variations as string || '[]');
        const minPrice = variations.length
          ? Math.min(...variations.map((v: any) => Number(v.price ?? 0)).filter((p: number) => p > 0))
          : 0;
        productPrices[row.id as string] = minPrice;
      } catch {}
    }

    const result = email
      ? await db.execute({ sql: 'SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC', args: [email.toLowerCase()] })
      : await db.execute({ sql: 'SELECT * FROM orders ORDER BY created_at DESC', args: [] });

    const orders = result.rows.map(r => {
      const items = normalizeItems(JSON.parse(r.items as string || '[]'), productPrices);
      const subtotal = Number(r.subtotal ?? 0);
      const discount = Number(r.discount ?? 0);
      const shipping = Number(r.shipping ?? 0);
      const tax = Number(r.tax ?? 0);
      const storedTotal = Number(r.total ?? 0);
      // Fallback: compute total from line items if stored total is missing/0 but items exist
      const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const total = storedTotal > 0 ? storedTotal : (itemsTotal > 0 ? itemsTotal - discount + shipping + tax : 0);
      return {
        id: r.id, userId: r.user_id, customerName: r.customer_name,
        email: r.email, phone: r.phone, items,
        subtotal, discount, shipping, tax, total, status: r.status,
        shippingAddress: r.shipping_address, billingAddress: r.billing_address,
        trackingId: r.tracking_id,
        razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id,
        gstNumber: r.gst_number, gstCompany: r.gst_company,
        createdAt: r.created_at,
      };
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
