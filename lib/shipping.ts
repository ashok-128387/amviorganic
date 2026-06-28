export type ShippingZone = 'A' | 'B' | 'C' | 'E';

export interface ShippingZoneConfig {
  baseRate: number;
  gstPercent: number;
  label: string;
}

export const DEFAULT_SHIPPING_ZONES: Record<ShippingZone, ShippingZoneConfig> = {
  A: { baseRate: 39, gstPercent: 18, label: 'Bangalore / Intercity' },
  B: { baseRate: 49, gstPercent: 18, label: 'Karnataka' },
  C: { baseRate: 59, gstPercent: 18, label: 'Metro & Rest of India' },
  E: { baseRate: 69, gstPercent: 18, label: 'Special / Remote' },
};

export interface PincodeMapping {
  [pincode: string]: ShippingZone;
}

export interface ShippingSettings {
  zones: Record<ShippingZone, ShippingZoneConfig>;
  pincodes: PincodeMapping;
  freeShippingThreshold: number;
}

const METRO_PREFIXES = ['400', '401', '110', '111', '600', '601', '700', '701', '500', '501', '411', '380', '390'];
const REMOTE_PREFIXES = ['180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '790', '791', '792', '793', '794', '744', '682', '171', '172', '173', '174', '175', '176', '177', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258', '259', '260', '261', '262', '263'];
const KARNATAKA_PREFIXES = ['560', '561', '562', '563', '564', '565', '566', '567', '568', '569', '570', '571', '572', '573', '574', '575', '576', '577', '578', '579', '580', '581', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599'];

export function detectZone(pincode: string, overrides: PincodeMapping = {}): ShippingZone {
  const clean = pincode.trim();
  if (!/^\d{6}$/.test(clean)) return 'C';
  if (overrides[clean]) return overrides[clean];
  const prefix3 = clean.slice(0, 3);
  if (prefix3 === '560') return 'A';
  if (KARNATAKA_PREFIXES.some(p => prefix3.startsWith(p.slice(0, 2)) && prefix3 >= p.slice(0, 2) && prefix3 <= p.slice(0, 2))) {
    // Karnataka pincodes: 56-59 range
    if (clean.startsWith('56') || clean.startsWith('57') || clean.startsWith('58') || clean.startsWith('59')) return 'B';
  }
  if (REMOTE_PREFIXES.some(p => prefix3 === p || clean.startsWith(p))) return 'E';
  if (METRO_PREFIXES.some(p => clean.startsWith(p))) return 'C';
  return 'C';
}

export function calculateShipping(
  pincode: string,
  cartTotal: number,
  freeShippingThreshold: number,
  zones: Record<ShippingZone, ShippingZoneConfig> = DEFAULT_SHIPPING_ZONES,
  overrides: PincodeMapping = {}
): { zone: ShippingZone; baseRate: number; gst: number; total: number; free: boolean } {
  if (cartTotal >= freeShippingThreshold) {
    return { zone: detectZone(pincode, overrides), baseRate: 0, gst: 0, total: 0, free: true };
  }
  const zone = detectZone(pincode, overrides);
  const config = zones[zone] || DEFAULT_SHIPPING_ZONES[zone];
  const gst = Math.round(config.baseRate * (config.gstPercent / 100));
  const total = config.baseRate + gst;
  return { zone, baseRate: config.baseRate, gst, total, free: false };
}
