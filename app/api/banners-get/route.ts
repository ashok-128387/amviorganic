import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

const DEFAULT_BANNERS = [
  '/Product images for website/Product images for website/Banner 1.png',
  '/Product images for website/Product images for website/Banner 2.png',
  '/Product images for website/Product images for website/Banner 3.png',
];

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({
      sql: 'SELECT value FROM site_settings WHERE key = ?',
      args: ['banners'],
    });
    if (result.rows.length > 0 && result.rows[0].value) {
      try {
        const banners = JSON.parse(result.rows[0].value as string);
        if (Array.isArray(banners) && banners.length > 0) {
          return NextResponse.json({ banners });
        }
      } catch {}
    }
    return NextResponse.json({ banners: DEFAULT_BANNERS });
  } catch (err: any) {
    return NextResponse.json({ banners: DEFAULT_BANNERS });
  }
}
