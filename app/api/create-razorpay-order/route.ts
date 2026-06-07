import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    if (!amount || amount < 1) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create order' }, { status: 500 });
  }
}
