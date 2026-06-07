import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM blogs ORDER BY created_at DESC', args: [] });
    const blogs = result.rows.map(r => ({
      id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
      content: r.content, image: r.image, author: r.author,
      published: r.published === 1, createdAt: r.created_at,
    }));
    return NextResponse.json({ blogs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
