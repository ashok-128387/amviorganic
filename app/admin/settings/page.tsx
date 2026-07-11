'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/admin-store';
import { DEFAULT_POLICY_CONTENT } from '@/lib/policies';
import RichTextEditor from '@/components/rich-text-editor';
import { Save, CheckCircle } from 'lucide-react';

const DEFAULT_SETTINGS: SiteSettings = {
  storeName: 'AMVI Organics',
  contactEmail: 'contact@amviorganics.com',
  contactPhone: '+91-8748899100',
  address: 'Bengaluru, Karnataka, India',
  instagramUrl: 'https://instagram.com/amviorganics',
  facebookUrl: 'https://facebook.com/amviorganics',
  whatsappNumber: '918748899100',
  freeShippingThreshold: 500,
  shippingCharge: 50,
  taxPercent: 5,
  shippingZones: {
    A: { baseRate: 39, gstPercent: 18, label: 'Bangalore / Intercity' },
    B: { baseRate: 49, gstPercent: 18, label: 'Karnataka' },
    C: { baseRate: 59, gstPercent: 18, label: 'Metro & Rest of India' },
    E: { baseRate: 69, gstPercent: 18, label: 'Special / Remote' },
  },
  shippingPincodes: {},
  announcementText: 'FREE SHIPPING on orders above ₹{threshold} | Use code WELCOME10 for 10% OFF',
  policyContent: DEFAULT_POLICY_CONTENT,
};

function parseSettings(settings: Record<string, string>): Partial<SiteSettings> {
  const parsed: Partial<SiteSettings> = {
    storeName: settings.storeName,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    address: settings.address,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
    whatsappNumber: settings.whatsappNumber,
    freeShippingThreshold: Number(settings.freeShippingThreshold),
    shippingCharge: Number(settings.shippingCharge),
    taxPercent: Number(settings.taxPercent),
    announcementText: settings.announcementText,
  };
  try {
    if (settings.shippingZones) parsed.shippingZones = JSON.parse(settings.shippingZones);
  } catch {}
  try {
    if (settings.shippingPincodes) parsed.shippingPincodes = JSON.parse(settings.shippingPincodes);
  } catch {}
  try {
    if (settings.policyContent) parsed.policyContent = JSON.parse(settings.policyContent);
  } catch {}
  return parsed;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>({ ...DEFAULT_SETTINGS });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeZone, setPincodeZone] = useState<'A' | 'B' | 'C' | 'E'>('A');

  useEffect(() => {
    fetch('/api/settings-get')
      .then(r => r.json())
      .then(({ settings }) => {
        if (settings) {
          const parsed = parseSettings(settings);
          setForm(prev => ({
            ...prev,
            ...parsed,
            shippingZones: parsed.shippingZones || prev.shippingZones,
            shippingPincodes: parsed.shippingPincodes || prev.shippingPincodes,
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (k: keyof SiteSettings, v: string | number | Record<string, any>) =>
    setForm(f => ({ ...f, [k]: v }));

  const setZoneRate = (zone: string, baseRate: number) => {
    setForm(f => ({
      ...f,
      shippingZones: {
        ...f.shippingZones,
        [zone]: { ...f.shippingZones[zone], baseRate },
      },
    }));
  };

  const addPincodeOverride = () => {
    const clean = pincodeInput.trim();
    if (!/^\d{6}$/.test(clean)) return;
    setForm(f => ({
      ...f,
      shippingPincodes: { ...f.shippingPincodes, [clean]: pincodeZone },
    }));
    setPincodeInput('');
  };

  const removePincodeOverride = (pin: string) => {
    setForm(f => {
      const next = { ...f.shippingPincodes };
      delete next[pin];
      return { ...f, shippingPincodes: next };
    });
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      shippingZones: JSON.stringify(form.shippingZones),
      shippingPincodes: JSON.stringify(form.shippingPincodes),
      policyContent: JSON.stringify(form.policyContent || {}),
    };
    await fetch('/api/settings-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: keyof SiteSettings; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[k] as string}
        onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700"
      />
    </div>
  );

  if (loading) {
    return <div className="text-sm text-gray-500 py-10">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500">Configure your store details, contact info, and pricing rules</p>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">🏪 Store Information</p>
        <Field label="Store Name" k="storeName" placeholder="AMVI Organics" />
        <Field label="Contact Email" k="contactEmail" type="email" placeholder="contact@amviorganics.com" />
        <Field label="Contact Phone" k="contactPhone" placeholder="+91-8748899100" />
        <Field label="Address" k="address" placeholder="Bengaluru, Karnataka, India" />
      </div>

      {/* Social */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">📱 Social & Contact Links</p>
        <Field label="Instagram URL" k="instagramUrl" placeholder="https://instagram.com/amviorganics" />
        <Field label="Facebook URL" k="facebookUrl" placeholder="https://facebook.com/amviorganics" />
        <Field label="WhatsApp Number (with country code, no +)" k="whatsappNumber" placeholder="918748899100" />
      </div>

      {/* Pricing Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">💰 Pricing Rules</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Free Shipping Above (₹)</label>
            <input type="number" value={form.freeShippingThreshold}
              onChange={e => set('freeShippingThreshold', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tax (%)</label>
            <input type="number" value={form.taxPercent}
              onChange={e => set('taxPercent', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fallback Shipping (₹)</label>
            <input type="number" value={form.shippingCharge}
              onChange={e => set('shippingCharge', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700" />
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700 mb-2">Preview</p>
          <p>Free shipping on orders above <strong>₹{form.freeShippingThreshold}</strong></p>
          <p>Tax applied: <strong>{form.taxPercent}%</strong></p>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">📢 Announcement Bar</p>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Marquee Text</label>
          <textarea
            value={form.announcementText}
            onChange={e => set('announcementText', e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700"
            placeholder="FREE SHIPPING on orders above ₹{threshold} | Use code WELCOME10 for 10% OFF"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Use <code className="text-green-700">{'{threshold}'}</code> to insert the free-shipping threshold dynamically.
          </p>
        </div>
      </div>

      {/* Policy Pages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">📄 Policy Pages</p>
        <p className="text-xs text-gray-500">
          Edit the default content below. HTML tags are supported. Use the toolbar to format text, add headings, lists, links, and highlight boxes.
        </p>
        {[
          { key: 'privacy', label: 'Privacy Policy' },
          { key: 'terms', label: 'Terms & Conditions' },
          { key: 'shipping', label: 'Shipping Policy' },
          { key: 'return', label: 'Return, Refund & Cancellation Policy' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
            <RichTextEditor
              value={form.policyContent?.[key] || ''}
              onChange={val => {
                const next = { ...form.policyContent, [key]: val };
                if (!val) delete (next as any)[key];
                set('policyContent', next);
              }}
              rows={8}
              placeholder={`Edit ${label} content here.`}
            />
          </div>
        ))}
      </div>

      {/* Shipping Zones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">🚚 Pincode Shipping Zones</p>
        <p className="text-xs text-gray-500">Base rates below will have {form.shippingZones.A.gstPercent}% GST added at checkout.</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(form.shippingZones).map(([zone, config]) => (
            <div key={zone} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">Zone {zone}</span>
                <span className="text-xs text-gray-500">{config.label}</span>
              </div>
              <label className="block text-xs text-gray-600 mb-1">Base Rate (₹)</label>
              <input type="number" value={config.baseRate}
                onChange={e => setZoneRate(zone, Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
          ))}
        </div>

        {/* Pincode overrides */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-2">Pincode Overrides</p>
          <div className="flex gap-2 mb-3">
            <input value={pincodeInput} onChange={e => setPincodeInput(e.target.value)}
              placeholder="6-digit pincode"
              maxLength={6}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            <select value={pincodeZone} onChange={e => setPincodeZone(e.target.value as any)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
              {Object.entries(form.shippingZones).map(([z, c]) => (
                <option key={z} value={z}>Zone {z} — {c.label}</option>
              ))}
            </select>
            <button onClick={addPincodeOverride}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: '#1e4a2a' }}>Add</button>
          </div>
          {Object.keys(form.shippingPincodes).length === 0 ? (
            <p className="text-xs text-gray-400">No pincode overrides added.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(form.shippingPincodes).map(([pin, zone]) => (
                <span key={pin} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: '#f0faf2', color: '#1e4a2a' }}>
                  {pin} → Zone {zone}
                  <button onClick={() => removePincodeOverride(pin)} className="ml-1 text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition"
        style={{ background: saved ? '#16a34a' : '#1e4a2a' }}
        onMouseEnter={e => !saved && (e.currentTarget.style.background = '#2a6b3e')}
        onMouseLeave={e => !saved && (e.currentTarget.style.background = '#1e4a2a')}>
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>
    </div>
  );
}
