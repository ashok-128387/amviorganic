// ─── Email Service ────────────────────────────────────────────────────────────
// All emails are ready to send via Resend.
// When you get the API key, set RESEND_API_KEY in .env.local
// and uncomment the fetch call in sendEmail().
//
// Emails configured:
//   1. OTP Login             → sendOtpEmail(email, otp)
//   2. Welcome after signup  → sendWelcomeEmail(email, name)
//   3. Order Confirmation    → sendOrderConfirmationEmail(order)
//   4. Order Shipped         → sendOrderShippedEmail(order, trackingId)
// ─────────────────────────────────────────────────────────────────────────────

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: string;
  createdAt: string;
}

// ── Core sender ───────────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AMVI Organics <orders@amviorganics.com>',
      to,
      subject,
      html,
    }),
  });
  return res.json();
}

// ── 1. OTP Login Email ────────────────────────────────────────────────────────
export async function sendOtpEmail(email: string, otp: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #f0ece6">
      <div style="text-align:center;margin-bottom:24px">
        <p style="font-size:22px;font-weight:800;color:#1e4a2a;margin:0">AMVI Organics</p>
        <p style="font-size:11px;color:#c8922a;letter-spacing:2px;margin:4px 0 0">NATURE'S TRUST, DELIVERED</p>
      </div>
      <h2 style="font-size:20px;color:#1a1a1a;margin:0 0 8px">Your Login OTP</h2>
      <p style="color:#555;font-size:14px;margin:0 0 24px">Use the code below to log in. It expires in <strong>10 minutes</strong>.</p>
      <div style="background:#f5f2ed;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
        <p style="font-size:40px;font-weight:900;letter-spacing:12px;color:#1e4a2a;margin:0">${otp}</p>
      </div>
      <p style="color:#999;font-size:12px;margin:0">If you didn't request this, please ignore this email. Do not share this OTP with anyone.</p>
      <hr style="border:none;border-top:1px solid #f0ece6;margin:24px 0"/>
      <p style="color:#bbb;font-size:11px;text-align:center;margin:0">© 2024 AMVI Organics · Mandya, Karnataka, India</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Your AMVI Organics Login OTP', html });
}

// ── 2. Welcome Email ──────────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #f0ece6">
      <div style="text-align:center;margin-bottom:24px">
        <p style="font-size:22px;font-weight:800;color:#1e4a2a;margin:0">AMVI Organics</p>
        <p style="font-size:11px;color:#c8922a;letter-spacing:2px;margin:4px 0 0">NATURE'S TRUST, DELIVERED</p>
      </div>
      <h2 style="font-size:20px;color:#1a1a1a;margin:0 0 8px">Welcome, ${name}! 🌿</h2>
      <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 20px">
        Thank you for joining AMVI Organics. You now have access to India's finest certified organic jaggery — sourced directly from farms in Mandya, Karnataka.
      </p>
      <a href="https://amviorganics.com/products" style="display:inline-block;background:#1e4a2a;color:#fff;padding:12px 28px;border-radius:24px;font-weight:700;font-size:14px;text-decoration:none;margin-bottom:24px">Shop Now →</a>
      <hr style="border:none;border-top:1px solid #f0ece6;margin:24px 0"/>
      <p style="color:#bbb;font-size:11px;text-align:center;margin:0">© 2024 AMVI Organics · Mandya, Karnataka, India</p>
    </div>
  `;
  return sendEmail({ to: email, subject: `Welcome to AMVI Organics, ${name}!`, html });
}

// ── 3. Order Confirmation Email ───────────────────────────────────────────────
export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:10px 0;color:#333;font-size:14px;border-bottom:1px solid #f0ece6">${item.name}</td>
      <td style="padding:10px 0;color:#333;font-size:14px;text-align:center;border-bottom:1px solid #f0ece6">×${item.qty}</td>
      <td style="padding:10px 0;color:#1e4a2a;font-weight:700;font-size:14px;text-align:right;border-bottom:1px solid #f0ece6">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;padding:0;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #f0ece6">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1e4a2a,#2a6b3e);padding:28px 32px;text-align:center">
        <p style="font-size:22px;font-weight:800;color:#e8b84b;margin:0">AMVI Organics</p>
        <p style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:2px;margin:4px 0 0">NATURE'S TRUST, DELIVERED</p>
      </div>
      <!-- Body -->
      <div style="padding:32px">
        <div style="text-align:center;margin-bottom:24px">
          <div style="width:56px;height:56px;background:#f0faf2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
            <span style="font-size:28px">✅</span>
          </div>
          <h2 style="font-size:22px;font-weight:800;color:#1a1a1a;margin:0 0 6px">Order Confirmed!</h2>
          <p style="color:#555;font-size:14px;margin:0">Hi ${order.customerName}, your order has been placed successfully.</p>
        </div>

        <!-- Order ID -->
        <div style="background:#f5f2ed;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:13px;color:#888">Order ID</span>
          <span style="font-size:14px;font-weight:800;color:#1e4a2a;font-family:monospace">${order.orderId.slice(0,8).toUpperCase()}</span>
        </div>

        <!-- Items -->
        <h3 style="font-size:14px;font-weight:700;color:#1a1a1a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px">Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <thead>
            <tr>
              <th style="text-align:left;font-size:12px;color:#aaa;font-weight:600;padding-bottom:8px;border-bottom:2px solid #f0ece6">Product</th>
              <th style="text-align:center;font-size:12px;color:#aaa;font-weight:600;padding-bottom:8px;border-bottom:2px solid #f0ece6">Qty</th>
              <th style="text-align:right;font-size:12px;color:#aaa;font-weight:600;padding-bottom:8px;border-bottom:2px solid #f0ece6">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <!-- Totals -->
        <div style="background:#f9f9f9;border-radius:10px;padding:16px 18px;margin-bottom:24px">
          ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px;color:#555">Discount</span><span style="font-size:13px;color:#16a34a;font-weight:700">− ₹${order.discount.toLocaleString('en-IN')}</span></div>` : ''}
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px;color:#555">Shipping</span><span style="font-size:13px;color:#555">${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="font-size:13px;color:#555">Tax (5%)</span><span style="font-size:13px;color:#555">₹${order.tax}</span></div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #e5e5e5;padding-top:12px"><span style="font-size:15px;font-weight:800;color:#1a1a1a">Total</span><span style="font-size:16px;font-weight:800;color:#1e4a2a">₹${order.total.toLocaleString('en-IN')}</span></div>
        </div>

        <!-- Delivery -->
        <h3 style="font-size:14px;font-weight:700;color:#1a1a1a;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px">Delivery Address</h3>
        <div style="border:1px solid #f0ece6;border-radius:10px;padding:14px 18px;margin-bottom:24px">
          <p style="margin:0;font-size:14px;font-weight:700;color:#1a1a1a">${order.customerName}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#555">${order.shippingAddress}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#555">📞 ${order.phone}</p>
        </div>

        <!-- Timeline -->
        <div style="text-align:center;margin-bottom:24px">
          <p style="font-size:13px;color:#888;margin:0 0 12px">What happens next?</p>
          <div style="display:flex;justify-content:center;gap:0;align-items:center">
            ${[['✅','Confirmed'],['📦','Processing'],['🚚','Shipped'],['🏠','Delivered']].map(([icon,label],i,arr) => `
              <div style="text-align:center">
                <div style="width:40px;height:40px;border-radius:50%;background:${i===0?'#1e4a2a':'#f0ece6'};display:inline-flex;align-items:center;justify-content:center;font-size:18px">${icon}</div>
                <p style="font-size:10px;color:${i===0?'#1e4a2a':'#aaa'};margin:4px 0 0;font-weight:${i===0?700:400}">${label}</p>
              </div>
              ${i < arr.length-1 ? '<div style="width:32px;height:2px;background:#f0ece6;margin-bottom:14px"></div>' : ''}
            `).join('')}
          </div>
        </div>

        <a href="https://amviorganics.com/orders" style="display:block;background:#1e4a2a;color:#fff;padding:13px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;text-align:center;margin-bottom:16px">Track My Order →</a>
        <p style="text-align:center;font-size:12px;color:#aaa;margin:0">Questions? Email us at <a href="mailto:contact@amviorganics.com" style="color:#1e4a2a">contact@amviorganics.com</a> or call +91-8748899100</p>
      </div>
      <div style="background:#f5f2ed;padding:16px;text-align:center">
        <p style="color:#bbb;font-size:11px;margin:0">© 2024 AMVI Organics · Mandya, Karnataka, India</p>
      </div>
    </div>
  `;
  return sendEmail({ to: order.email, subject: `Order Confirmed ✅ #${order.orderId.slice(0,8).toUpperCase()} — AMVI Organics`, html });
}

// ── 4. Order Shipped Email ────────────────────────────────────────────────────
export async function sendOrderShippedEmail(order: OrderEmailData, trackingId: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:0;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #f0ece6">
      <div style="background:linear-gradient(135deg,#1e4a2a,#2a6b3e);padding:28px 32px;text-align:center">
        <p style="font-size:22px;font-weight:800;color:#e8b84b;margin:0">AMVI Organics</p>
      </div>
      <div style="padding:32px">
        <div style="text-align:center;margin-bottom:24px">
          <span style="font-size:48px">🚚</span>
          <h2 style="font-size:20px;font-weight:800;color:#1a1a1a;margin:12px 0 6px">Your Order is On the Way!</h2>
          <p style="color:#555;font-size:14px;margin:0">Hi ${order.customerName}, your order has been shipped.</p>
        </div>
        <div style="background:#f5f2ed;border-radius:10px;padding:16px 18px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:13px;color:#888">Order ID</span>
            <span style="font-size:13px;font-weight:700;color:#1e4a2a">${order.orderId.slice(0,8).toUpperCase()}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:13px;color:#888">Tracking ID</span>
            <span style="font-size:13px;font-weight:700;color:#1e4a2a">${trackingId}</span>
          </div>
        </div>
        <p style="font-size:13px;color:#555;text-align:center;margin:0 0 20px">Expected delivery: <strong>3-5 business days</strong></p>
        <a href="https://amviorganics.com/orders" style="display:block;background:#1e4a2a;color:#fff;padding:13px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;text-align:center">Track Order →</a>
      </div>
      <div style="background:#f5f2ed;padding:14px;text-align:center">
        <p style="color:#bbb;font-size:11px;margin:0">© 2024 AMVI Organics</p>
      </div>
    </div>
  `;
  return sendEmail({ to: order.email, subject: `Your Order is Shipped 🚚 — AMVI Organics`, html });
}
