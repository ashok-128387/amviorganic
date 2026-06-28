import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim().replace(/^"|"$/g, '') || '';
    });
    rows.push(row);
  }
  return rows;
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { users } = await req.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: 'No users provided' }, { status: 400 });
    }

    const errors: string[] = [];
    let imported = 0;

    for (const u of users) {
      const name = (u.name || '').trim();
      const email = (u.email || '').trim().toLowerCase();
      if (!name || !email || !/\S+@\S+\.\S+/.test(email)) {
        errors.push(`Skipped invalid row: ${name} / ${email}`);
        continue;
      }
      const id = u.id?.trim() || `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const registeredAt = u.registeredAt || new Date().toISOString();
      try {
        await db.execute({
          sql: 'INSERT OR IGNORE INTO users (id, name, email, registered_at) VALUES (?, ?, ?, ?)',
          args: [id, name, email, registeredAt],
        });
        imported++;
      } catch (e: any) {
        errors.push(`Failed to import ${email}: ${e.message}`);
      }
    }

    return NextResponse.json({ success: true, imported, total: users.length, errors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
