import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.email || !data.message)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    await sendContactEmail(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
