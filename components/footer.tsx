'use client';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(160deg, #0f2d18 0%, #1e4a2a 60%, #16391f 100%)' }} className="text-white">
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #c8922a, #e8b84b, #c8922a)' }} />
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 5, border: '1.5px solid rgba(200,146,42,0.35)', flexShrink: 0 }}>
                <img src="/Shoot Product only/12_Amvi-logoTL-01.webp" alt="AMVI Organics"
                  style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 5, display: 'block' }} />
              </div>
              <div>
                <p className="font-extrabold tracking-wide" style={{ color: '#e8b84b', fontSize: '1.2rem' }}>AMVI Organics</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.12em' }}>NATURE&apos;S TRUST, DELIVERED</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Pure, certified organic jaggery — sourced directly from sugarcane farms and delivered to your doorstep.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ff0000')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
              </a>
              <a href="mailto:contact@amviorganics.com" title="Email"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c8922a')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0077b5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zm2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#c8922a' }}>Company</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {[['Our Story', '/our-story'], ['Our Process', '/our-process'], ['FAQs', '/faqs'], ['Contact Us', '/contact']].map(([label, href]) => (
                <li key={href}><a href={href} className="transition-colors duration-200 hover:text-white flex items-center gap-1">
                  <span style={{ color: '#c8922a', fontSize: '0.55rem' }}>▶</span> {label}
                </a></li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#c8922a' }}>Products</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {[['Jaggery Cubes', '/#jaggery'], ['Jaggery Powder', '/#jaggery'], ['Liquid Jaggery', '/#jaggery'], ['Masala Jaggery', '/#jaggery']].map(([label, href]) => (
                <li key={label}><a href={href} className="transition-colors duration-200 hover:text-white flex items-center gap-1">
                  <span style={{ color: '#c8922a', fontSize: '0.55rem' }}>▶</span> {label}
                </a></li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#c8922a' }}>Policies</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {[['Shipping Policy', '/shipping-policy'], ['Return & Refund', '/return-policy'], ['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms-of-service']].map(([label, href]) => (
                <li key={href}><a href={href} className="transition-colors duration-200 hover:text-white flex items-center gap-1">
                  <span style={{ color: '#c8922a', fontSize: '0.55rem' }}>▶</span> {label}
                </a></li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#c8922a' }}>Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span style={{ color: '#c8922a', marginTop: 2 }}>✉</span>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Email</p>
                  <a href="mailto:contact@amviorganics.com" className="text-sm hover:text-white transition" style={{ color: 'rgba(255,255,255,0.75)' }}>contact@amviorganics.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: '#c8922a', marginTop: 2 }}>✆</span>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Phone</p>
                  <a href="tel:+918748899100" className="text-sm hover:text-white transition" style={{ color: 'rgba(255,255,255,0.75)' }}>+91-8748899100</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: '#c8922a', marginTop: 2 }}>📍</span>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Location</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Mandya, Karnataka, India</p>
                </div>
              </div>
              <a href="/contact"
                className="inline-block px-5 py-2 rounded-full text-xs font-bold transition"
                style={{ background: '#c8922a', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e8b84b')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c8922a')}>
                Send a Message →
              </a>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(200,146,42,0.25)' }} className="mb-7" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>&copy; 2024 AMVI Organics. All rights reserved.</p>
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#c8922a' }}>Nature&apos;s Trust, Delivered.</p>
          <div className="flex gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {[['Privacy', '/privacy-policy'], ['Terms', '/terms-of-service'], ['Support', '/contact']].map(([label, href]) => (
              <a key={href} href={href} className="hover:text-white transition-colors duration-200">{label}</a>
            ))}
          </div>
        </div>

        {/* Design & Development credit */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} className="mt-6 mb-4" />
        <div className="text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Designed &amp; Developed by{' '}
            <a href="https://peakinfosolution.com" target="_blank" rel="noopener noreferrer"
              className="font-semibold transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(200,146,42,0.7)' }}>
              peakinfosolution.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
