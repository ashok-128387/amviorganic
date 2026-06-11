'use client';

export default function Footer() {
  const WHATSAPP_NUMBER = '918748899100';

  return (
    <footer style={{ background: 'linear-gradient(160deg, #0d2515 0%, #1a3d24 60%, #0d2515 100%)' }} className="text-white">
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #c8922a, #e8b84b, #c8922a)' }} />
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-3">
            <div className="mb-4">
              <img src="/logo-reverse.png" alt="AMVI Organics"
                style={{ height: 80, width: 'auto', maxWidth: 220, objectFit: 'contain', display: 'block' }} loading="lazy" />
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Pure, certified organic jaggery — sourced directly from sugarcane farms and delivered to your doorstep.
            </p>

            {/* Social Icons — Instagram, Facebook, X, YouTube, WhatsApp, Email */}
            <div className="flex flex-wrap gap-2.5">
              {/* Instagram */}
              <a href="https://instagram.com/amviorganics" target="_blank" rel="noopener noreferrer" title="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e1306c')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com/amviorganics" target="_blank" rel="noopener noreferrer" title="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1877f2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* X (Twitter) */}
              <a href="https://x.com/amviorganics" target="_blank" rel="noopener noreferrer" title="X (Twitter)"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#000')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@amviorganics" target="_blank" rel="noopener noreferrer" title="YouTube"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ff0000')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#25d366')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
              {/* Email */}
              <a href="mailto:contact@amviorganics.com" title="Email"
                className="w-9 h-9 rounded-full flex items-center justify-center transition"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c8922a')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#e8b84b' }}>Company</h4>
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
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#e8b84b' }}>Products</h4>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {[['Jaggery Cubes', '/sweeteners'], ['Jaggery Powder', '/sweeteners'], ['Liquid Jaggery', '/sweeteners'], ['Masala Jaggery', '/sweeteners'], ['Combo Deals', '/combo-deals']].map(([label, href]) => (
                <li key={label}><a href={href} className="transition-colors duration-200 hover:text-white flex items-center gap-1">
                  <span style={{ color: '#c8922a', fontSize: '0.55rem' }}>▶</span> {label}
                </a></li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#e8b84b' }}>Policies</h4>
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
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#e8b84b' }}>Contact Us</h4>
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
                <span style={{ color: '#c8922a', marginTop: 2 }}>💬</span>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>WhatsApp</p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                    className="text-sm hover:text-white transition" style={{ color: 'rgba(255,255,255,0.75)' }}>Chat with us</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: '#c8922a', marginTop: 2 }}>📍</span>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Location</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Mandya, Karnataka, India</p>
                </div>
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition"
                style={{ background: '#25d366', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1ebe5c')}
                onMouseLeave={e => (e.currentTarget.style.background = '#25d366')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(200,146,42,0.25)' }} className="mb-7" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>&copy; {new Date().getFullYear()} AMVI Organics. All rights reserved.</p>
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#c8922a' }}>Nature&apos;s Trust, Delivered.</p>
          <div className="flex gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {[['Privacy', '/privacy-policy'], ['Terms', '/terms-of-service'], ['Support', '/contact']].map(([label, href]) => (
              <a key={href} href={href} className="hover:text-white transition-colors duration-200">{label}</a>
            ))}
          </div>
        </div>

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
