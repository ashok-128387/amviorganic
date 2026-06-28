import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'amvi.db');
const db = createClient({ url: `file:${dbPath}` });

const orders = [
  {
    id: 'ORD-1782464118632-724',
    createdAt: '2026-06-26T00:00:00.000Z',
    status: 'completed',
    customerName: 'Yogish Muttur',
    email: 'yogeshmuttur@yahoo.co.in',
    phone: '7219318855',
    shippingAddress: 'No 100, 2nd Main, 2nd Stage, Vinayak Layout, Vijayanagar , Bangalore , Karnataka 560040',
    billingAddress: 'No 100, 2nd Main, 2nd Stage, Vinayak Layout, Vijayanagar , Bangalore , Karnataka 560040',
    trackingId: '',
    items: [
      {
        productId: '5',
        variationId: 'v5-2',
        name: 'Organic Jaggery Powder (450G)',
        qty: 1,
        price: 119,
      },
    ],
    subtotal: 119,
    discount: 0,
    shipping: 41,
    tax: 0,
    total: 160,
  },
  {
    id: 'ORD-1782463757529-154',
    createdAt: '2026-06-26T00:00:00.000Z',
    status: 'shipped',
    customerName: 'Kadesh Bagalkot',
    email: 'kadesh.bagalkot@gmail.com',
    phone: '9845669990',
    shippingAddress: '#101 first floor Mahima rose apartment Shirur park vidyanagar hubli , Hubli, Karnataka 580021',
    billingAddress: '#101 first floor Mahima rose apartment Shirur park vidyanagar hubli , Hubli, Karnataka 580021',
    trackingId: 'SF3511616160AVG',
    items: [
      {
        productId: '1',
        variationId: 'v1-2',
        name: 'Organic Jaggery Cubes (450G)',
        qty: 1,
        price: 119,
      },
    ],
    subtotal: 119,
    discount: 0,
    shipping: 41,
    tax: 0,
    total: 160,
  },
  {
    id: '0.36267624964988165',
    createdAt: '2026-06-16T00:00:00.000Z',
    status: 'completed',
    customerName: 'Vijay k',
    email: 'vijaykakamari@gmail.com',
    phone: '8660133801',
    shippingAddress: 'H.No 11, 3 cross, Bengaluru, Karnataka 560040',
    billingAddress: 'H.No 11, 3 cross, Bengaluru, Karnataka 560040',
    trackingId: '',
    items: [
      {
        productId: '1',
        variationId: 'v1-2',
        name: 'Organic Jaggery Cubes (450G)',
        qty: 1,
        price: 169,
      },
    ],
    subtotal: 169,
    discount: 0,
    shipping: 38,
    tax: 0,
    total: 207,
  },
];

async function seed() {
  for (const o of orders) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO orders
        (id, user_id, customer_name, email, phone, items, subtotal, discount, shipping, tax, total, status, shipping_address, billing_address, tracking_id, razorpay_order_id, razorpay_payment_id, gst_number, gst_company, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        o.id,
        '',
        o.customerName,
        o.email.toLowerCase(),
        o.phone,
        JSON.stringify(o.items),
        o.subtotal,
        o.discount,
        o.shipping,
        o.tax,
        o.total,
        o.status,
        o.shippingAddress,
        o.billingAddress,
        o.trackingId,
        '',
        '',
        '',
        '',
        o.createdAt,
      ],
    });
    console.log(`Inserted order ${o.id}`);
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
