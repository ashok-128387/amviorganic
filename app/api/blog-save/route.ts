import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const b = await req.json();
    await db.execute({
      sql: `INSERT INTO blogs (id, title, slug, excerpt, content, image, author, published, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              title=excluded.title, slug=excluded.slug, excerpt=excluded.excerpt,
              content=excluded.content, image=excluded.image, author=excluded.author,
              published=excluded.published`,
      args: [b.id, b.title, b.slug, b.excerpt || '', b.content || '', b.image || '', b.author || '', b.published ? 1 : 0, b.createdAt || new Date().toISOString()],
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
