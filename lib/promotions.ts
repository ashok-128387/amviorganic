import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export interface CouponRow {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  active: number;
  expires_at: string;
}

export interface Promotion {
  code: string;
  summary: string;
  description?: string;
}

export interface AppliedPromotion {
  reference_id: string;
  code: string;
  type: 'coupon';
  value: number; // in paise
  value_type: 'fixed_amount' | 'percentage';
  description?: string;
}

export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function computeDiscount(orderTotal: number, type: string, value: number): number {
  if (type === 'percent') return Math.round((orderTotal * value) / 100);
  return value;
}

export async function getCouponByCode(code: string): Promise<CouponRow | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM coupons WHERE code = ?',
    args: [code.toUpperCase()],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as CouponRow;
}

export async function listActiveCoupons(): Promise<CouponRow[]> {
  const result = await db.execute({
    sql: `SELECT * FROM coupons
          WHERE active = 1 AND expires_at >= ?
          ORDER BY min_order ASC`,
    args: [new Date().toISOString()],
  });
  return result.rows as unknown as CouponRow[];
}

export function validateCouponForOrder(
  coupon: CouponRow,
  orderTotal: number
): { valid: true; discount: number } | { valid: false; reason: string } {
  if (coupon.active !== 1) return { valid: false, reason: 'Coupon is inactive' };
  if (new Date(coupon.expires_at) < new Date()) return { valid: false, reason: 'Coupon has expired' };
  if (coupon.used_count >= coupon.max_uses) return { valid: false, reason: 'Coupon usage limit reached' };
  if (orderTotal < coupon.min_order) return { valid: false, reason: `Minimum order ₹${coupon.min_order} required` };
  return { valid: true, discount: computeDiscount(orderTotal, coupon.type, coupon.value) };
}

export function formatPromotion(coupon: CouponRow): Promotion {
  const summary = coupon.type === 'percent'
    ? `${coupon.value}% off`
    : `₹${coupon.value} off`;
  const description = coupon.min_order > 0
    ? `Valid on orders above ₹${coupon.min_order}`
    : undefined;
  return {
    code: coupon.code,
    summary,
    description,
  };
}

export function extractBearerToken(header: string | null): string | null {
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') return parts[1];
  return header;
}

export function getMagicAuthSecret(req: NextRequest, envName: string): string | null {
  const configured = process.env[envName];
  if (!configured) return null;

  const candidates = [
    req.headers.get('x-razorpay-secret'),
    req.headers.get('x-razorpay-signature'),
    extractBearerToken(req.headers.get('authorization')),
  ];

  for (const candidate of candidates) {
    if (candidate && candidate === configured) return configured;
  }
  return null;
}

export function getOrderAmountFromReceipt(receipt: string): Promise<number | null> {
  return db.execute({
    sql: 'SELECT amount FROM checkout_sessions WHERE receipt = ?',
    args: [receipt],
  }).then(r => (r.rows[0]?.amount as number | undefined) ?? null);
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
