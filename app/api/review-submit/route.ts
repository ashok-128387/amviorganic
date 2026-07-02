import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { productId, productName, email, name, rating, title, comment } = await req.json();

    if (!productId || !email || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the reviewer is a registered customer
    const userResult = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [normalizedEmail],
    });
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Please register an account with this email before leaving a review.' },
        { status: 403 }
      );
    }

    // Verify purchase: find an order containing this product with a non-cancelled status
    const ordersResult = await db.execute({
      sql: `SELECT customer_name, items FROM orders
            WHERE email = ? AND status IN ('pending','processing','shipped','delivered','completed')
            ORDER BY created_at DESC`,
      args: [normalizedEmail],
    });

    let verified = false;
    let customerName = name || '';

    for (const row of ordersResult.rows) {
      const items = JSON.parse(row.items as string || '[]');
      if (items.some((item: any) => (item.productId || item.id || '').toString() === productId.toString())) {
        verified = true;
        if (!customerName && row.customer_name) customerName = row.customer_name as string;
        break;
      }
    }

    if (!verified) {
      return NextResponse.json(
        { error: 'Only verified purchasers can review this product. Make sure you are logged in with the same email used for the order.' },
        { status: 403 }
      );
    }

    // Prevent duplicate reviews from the same email for the same product
    const existing = await db.execute({
      sql: 'SELECT id FROM reviews WHERE product_id = ? AND email = ?',
      args: [productId, normalizedEmail],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already reviewed this product.' },
        { status: 409 }
      );
    }

    const id = `rev-${Date.now()}`;
    await db.execute({
      sql: `INSERT INTO reviews (id, product_id, product_name, customer_name, email, rating, title, comment, approved, verified_purchase, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, productId, productName || '', customerName, normalizedEmail,
        rating, title || '', comment, 1, 1, new Date().toISOString(),
      ],
    });

    return NextResponse.json({ success: true, reviewId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
