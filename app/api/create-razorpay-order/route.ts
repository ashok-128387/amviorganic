import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db, initDb } from '@/lib/db';

interface LineItem {
  sku?: string;
  variant_id?: string;
  price: number;
  offer_price?: number;
  quantity: number;
  name?: string;
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { amount, items, receipt, line_items_total } = await req.json();
    if (!amount || amount < 1) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const finalReceipt = receipt || `rcpt_${Date.now()}`;
    const baseAmountPaise = Math.round(amount * 100);

    const orderPayload: any = {
      amount: baseAmountPaise,
      currency: 'INR',
      receipt: finalReceipt,
    };

    // Magic Checkout requires line_items_total and line_items
    if (line_items_total && Array.isArray(items) && items.length > 0) {
      orderPayload.line_items_total = Math.round(line_items_total * 100);
      orderPayload.line_items = items.map((item: LineItem) => ({
        sku: item.sku || '',
        variant_id: item.variant_id || '',
        price: Math.round(item.price * 100),
        offer_price: item.offer_price ? Math.round(item.offer_price * 100) : Math.round(item.price * 100),
        quantity: item.quantity,
        name: item.name || 'Product',
      }));
    }

    const order = await razorpay.orders.create(orderPayload);

    // Persist checkout session so Magic Checkout promotion APIs can look up the order amount
    await db.execute({
      sql: `INSERT OR REPLACE INTO checkout_sessions
        (receipt, razorpay_order_id, amount, line_items_total, items, created_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        finalReceipt,
        order.id,
        amount,
        line_items_total ?? amount,
        items ? JSON.stringify(items) : null,
        new Date().toISOString(),
      ],
    }).catch(err => {
      // Don't fail order creation if session persistence fails
      console.error('Failed to persist checkout session:', err.message);
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, receipt: finalReceipt });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create order' }, { status: 500 });
  }
}
