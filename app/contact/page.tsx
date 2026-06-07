'use client';

import { Playfair_Display, Montserrat } from 'next/font/google';
import { useState } from 'react';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['700']
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '', city: '', pincode: '', country: 'India', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Name, email and message are required.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/send-contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setSuccess(true); setForm({ name: '', email: '', phone: '', company: '', address: '', city: '', pincode: '', country: 'India', message: '' }); }
      else setError('Failed to send. Please try again.');
    } catch { setError('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className={`mko-body ${montserrat.className}`}>
        <div className="mko-contact-wrap">
          {/* LEFT: Info */}
          <div className="mko-info-col">
            <p className="mko-info-intro">
              We'd love to hear from you! Whether you have a question about our products, need help with an order, or just want to say hello.
            </p>

            <div className="mko-info-block">
              <strong>Email:</strong>
              <a href="mailto:contact@amviorganics.com">contact@amviorganics.com</a>
            </div>

            <div className="mko-info-block">
              <strong>Phone:</strong>
              <span>+91 87488 99100 (Mon–Sat, 9AM – 6PM)</span>
            </div>

            <div className="mko-info-block">
              <strong>Address:</strong>
              <span>No.3, 15th Cross, 1st Main, 2nd Block, Govindaraja Nagar Ward, Kalyan Nagar, Nagarabhavi Main Road, Bengaluru – 560072.</span>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="mko-form-card">
            <h2 className={`mko-form-title ${playfair.className}`}>Inquiries</h2>
            {success && <div style={{background:'#f0faf2',border:'1px solid #16a34a',borderRadius:8,padding:'12px 16px',marginBottom:16,color:'#16a34a',fontSize:'0.88rem',fontWeight:600}}>✅ Message sent! We'll get back to you within 24 hours.</div>}
            {error && <div style={{background:'#fef2f2',border:'1px solid #ef4444',borderRadius:8,padding:'12px 16px',marginBottom:16,color:'#ef4444',fontSize:'0.88rem'}}>{error}</div>}
            <form onSubmit={handleSubmit}>

            {/* Name + Email */}
            <div className="mko-field-row mko-col-2">
              <div className="mko-field">
                <label className="mko-label">Name <span className="mko-req">*</span></label>
                <input className="mko-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name"/>
              </div>
              <div className="mko-field">
                <label className="mko-label">Email <span className="mko-req">*</span></label>
                <input className="mko-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"/>
              </div>
            </div>

            {/* Phone + Company */}
            <div className="mko-field-row mko-col-2">
              <div className="mko-field">
                <label className="mko-label">Phone Number <span className="mko-req">*</span></label>
                <div className="mko-phone-wrap">
                  <div className="mko-phone-country">
                    <span className="mko-flag">🇮🇳</span>
                    <span>India (+91)</span>
                    <span className="mko-chevron">▾</span>
                  </div>
                  <input className="mko-phone-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="98765 43210"/>
                </div>
              </div>
              <div className="mko-field">
                <label className="mko-label">Company (Optional)</label>
                <input className="mko-input" type="text" name="company" value={form.company} onChange={handleChange} placeholder="Your Company Name"/>
              </div>
            </div>

            {/* Address */}
            <div className="mko-field-row mko-col-1">
              <div className="mko-field">
                <label className="mko-label">Address <span className="mko-req">*</span></label>
                <input className="mko-input" type="text" name="address" value={form.address} onChange={handleChange} placeholder="Street address, Flat No, Building"/>
              </div>
            </div>

            {/* City + Pincode + Country */}
            <div className="mko-field-row mko-col-3">
              <div className="mko-field">
                <label className="mko-label">City <span className="mko-req">*</span></label>
                <input className="mko-input" type="text" name="city" value={form.city} onChange={handleChange} placeholder="City"/>
              </div>
              <div className="mko-field">
                <label className="mko-label">Pincode / ZIP <span className="mko-req">*</span></label>
                <input className="mko-input" type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="560001"/>
              </div>
              <div className="mko-field">
                <label className="mko-label">Country <span className="mko-req">*</span></label>
                <input className="mko-input" type="text" name="country" value={form.country} onChange={handleChange} />
              </div>
            </div>

            {/* Save Address As */}
            <div className="mko-save-label">Save Address As</div>
            <div className="mko-addr-tabs">
              <button 
                className={`mko-addr-tab ${activeTab === 'home' ? 'mko-active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </button>
              <button 
                className={`mko-addr-tab ${activeTab === 'work' ? 'mko-active' : ''}`}
                onClick={() => setActiveTab('work')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
                Work
              </button>
              <button 
                className={`mko-addr-tab ${activeTab === 'other' ? 'mko-active' : ''}`}
                onClick={() => setActiveTab('other')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Other
              </button>
            </div>

            {/* Message */}
            <div className="mko-field-row mko-col-1">
              <div className="mko-field">
                <label className="mko-label">Message <span className="mko-req">*</span></label>
                <textarea className="mko-textarea" name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?"></textarea>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="mko-submit-btn" disabled={loading}>{loading ? 'Sending...' : 'Submit Inquiry'}</button>

            </form>
            <p className="mko-form-note">
              The address will be secured with otp on platform for checkouts. View
              <a href="#">Terms and conditions</a> and <a href="#">privacy policy</a>.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(:root) {
          --mko-green: #1e4a2a;
          --mko-green-hover: #163820;
          --mko-red: #c0392b;
          --mko-bg: #f5f2ed;
          --mko-white: #ffffff;
          --mko-border: #d8d3cc;
          --mko-text: #2e2e2e;
          --mko-muted: #888;
          --mko-label: #3a3a3a;
        }

        .mko-body {
          background: var(--mko-bg);
          color: var(--mko-text);
          min-height: 100vh;
          padding: 60px 20px;
        }

        .mko-contact-wrap {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          align-items: start;
        }

        .mko-info-col {
          padding-top: 12px;
        }

        .mko-info-intro {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--mko-text);
          margin-bottom: 32px;
        }

        .mko-info-block {
          margin-bottom: 22px;
        }

        .mko-info-block strong {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 4px;
          color: var(--mko-text);
        }

        .mko-info-block a,
        .mko-info-block span {
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--mko-green);
          text-decoration: none;
        }

        .mko-info-block span {
          color: var(--mko-text);
        }

        .mko-form-card {
          background: var(--mko-white);
          border: 1px solid #dedad4;
          border-radius: 12px;
          padding: 40px 44px 36px;
        }

        .mko-form-title {
          font-size: 1.7rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 28px;
        }

        .mko-field-row {
          display: grid;
          gap: 18px;
          margin-bottom: 18px;
        }

        .mko-field-row.mko-col-2 { 
          grid-template-columns: 1fr 1fr; 
        }

        .mko-field-row.mko-col-3 { 
          grid-template-columns: 1fr 1fr 1fr; 
        }

        .mko-field-row.mko-col-1 { 
          grid-template-columns: 1fr; 
        }

        .mko-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .mko-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mko-label);
        }

        .mko-label .mko-req {
          color: var(--mko-red);
          margin-left: 2px;
        }

        .mko-input,
        .mko-textarea {
          width: 100%;
          border: 1px solid var(--mko-border);
          border-radius: 7px;
          padding: 13px 16px;
          font-size: 0.88rem;
          color: var(--mko-text);
          background: var(--mko-white);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .mko-input::placeholder,
        .mko-textarea::placeholder { 
          color: #b0aba4; 
        }

        .mko-input:focus,
        .mko-textarea:focus {
          border-color: var(--mko-green);
          box-shadow: 0 0 0 3px rgba(30,74,42,0.08);
        }

        .mko-textarea {
          resize: vertical;
          min-height: 140px;
        }

        .mko-phone-wrap {
          display: flex;
          border: 1px solid var(--mko-border);
          border-radius: 7px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .mko-phone-wrap:focus-within {
          border-color: var(--mko-green);
          box-shadow: 0 0 0 3px rgba(30,74,42,0.08);
        }

        .mko-phone-country {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          background: #f9f7f4;
          border-right: 1px solid var(--mko-border);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--mko-text);
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
        }

        .mko-phone-country .mko-flag { 
          font-size: 1.1rem; 
        }

        .mko-phone-country .mko-chevron {
          font-size: 0.6rem;
          color: var(--mko-muted);
        }

        .mko-phone-input {
          flex: 1;
          border: none;
          padding: 13px 14px;
          font-size: 0.88rem;
          color: var(--mko-text);
          background: transparent;
          outline: none;
        }

        .mko-phone-input::placeholder { 
          color: #b0aba4; 
        }

        .mko-save-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mko-label);
          margin-bottom: 10px;
        }

        .mko-addr-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .mko-addr-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 50px;
          border: 1.5px solid var(--mko-border);
          background: var(--mko-white);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--mko-text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mko-addr-tab svg { 
          width: 15px; 
          height: 15px; 
        }

        .mko-addr-tab.mko-active {
          background: var(--mko-green);
          border-color: var(--mko-green);
          color: #fff;
        }

        .mko-addr-tab:not(.mko-active):hover {
          border-color: var(--mko-green);
          color: var(--mko-green);
        }

        .mko-submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--mko-green);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 8px;
          margin-bottom: 20px;
        }

        .mko-submit-btn:hover { 
          background: var(--mko-green-hover); 
        }

        .mko-form-note {
          text-align: center;
          font-size: 0.72rem;
          color: var(--mko-muted);
          line-height: 1.6;
        }

        .mko-form-note a {
          color: var(--mko-text);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .mko-contact-wrap {
            grid-template-columns: 1fr;
          }
          .mko-form-card {
            padding: 28px 20px 24px;
          }
          .mko-field-row.mko-col-2,
          .mko-field-row.mko-col-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}