import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'amvi.db');
const db = createClient({ url: `file:${dbPath}` });

const users = [
  { id: 'u-1782464118632', name: 'Yogish', email: 'yogeshmuttur@yahoo.co.in', registeredAt: '2026-06-26T00:00:00.000Z' },
  { id: 'u-1782463757529', name: 'Kadesh Bagalkot', email: 'kadesh.bagalkot@gmail.com', registeredAt: '2026-06-26T00:00:00.000Z' },
  { id: 'u-1782280000000', name: 'Priyanka Gorawade', email: 'priyanka.gorwade@gmail.com', registeredAt: '2026-06-24T00:00:00.000Z' },
  { id: 'u-1781510400000', name: 'Vijay', email: 'vijaykakamari@gmail.com', registeredAt: '2026-06-16T00:00:00.000Z' },
  { id: 'u-1781337600000', name: 'Amit Halingali', email: 'amit.halingali@gmail.com', registeredAt: '2026-06-14T00:00:00.000Z' },
  { id: 'u-1781251200000', name: 'ashok', email: 'kumarashoks3092@gmail.com', registeredAt: '2026-06-13T00:00:00.000Z' },
];

async function seed() {
  for (const u of users) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (id, name, email, registered_at) VALUES (?, ?, ?, ?)',
      args: [u.id, u.name, u.email.toLowerCase(), u.registeredAt],
    });
    console.log(`Inserted user ${u.email}`);
  }
}

seed()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
