'use client';

import { useState } from 'react';
import { useAdminStore, SiteSettings } from '@/lib/admin-store';
import { Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useAdminStore();
  const [form, setForm] = useState<SiteSettings>({ ...siteSettings });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof SiteSettings, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateSiteSettings(form);
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
        <Field label="Address" k="address" placeholder="Mandya, Karnataka, India" />
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
            <label className="block text-xs font-semibold text-gray-600 mb-1">Shipping Charge (₹)</label>
            <input type="number" value={form.shippingCharge}
              onChange={e => set('shippingCharge', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tax (%)</label>
            <input type="number" value={form.taxPercent}
              onChange={e => set('taxPercent', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700" />
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700 mb-2">Preview</p>
          <p>Free shipping on orders above <strong>₹{form.freeShippingThreshold}</strong></p>
          <p>Shipping charge below threshold: <strong>₹{form.shippingCharge}</strong></p>
          <p>Tax applied: <strong>{form.taxPercent}%</strong></p>
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
