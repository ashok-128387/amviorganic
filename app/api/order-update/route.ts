import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { id, status, trackingId } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    if (status) {
      await db.execute({ sql: 'UPDATE orders SET status = ? WHERE id = ?', args: [status, id] });
    }
    if (trackingId !== undefined) {
      await db.execute({ sql: 'UPDATE orders SET tracking_id = ? WHERE id = ?', args: [trackingId, id] });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
