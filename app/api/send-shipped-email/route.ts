import { NextRequest, NextResponse } from 'next/server';
import { sendOrderShippedEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { order, trackingId } = await req.json();
    if (!order?.email) return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
    await sendOrderShippedEmail(order, trackingId ?? '');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
