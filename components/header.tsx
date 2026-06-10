'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Heart, ShoppingCart, LogOut, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AdminProduct } from '@/lib/admin-store';
import { useRouter } from 'next/navigation';

const SITE_PAGES = [
  { title: 'Home', href: '/', desc: 'AMVI Organics homepage' },
  { title: 'Our Story', href: '/our-story', desc: 'About AMVI Organics' },
  { title: 'Our Process', href: '/our-process', desc: 'How we make our products' },
  { title: 'Blog', href: '/blog', desc: 'Tips, recipes and insights' },
  { title: 'FAQs', href: '/faqs', desc: 'Frequently asked questions' },
  { title: 'Contact Us', href: '/contact', desc: 'Get in touch with us' },
  { title: 'Sweeteners', href: '/sweeteners', desc: 'Organic jaggery sweeteners' },
  { title: 'Combo Deals', href: '/combo-deals', desc: 'Value combo packs' },
  { title: 'Wishlist', href: '/wishlist', desc: 'Your saved products' },
  { title: 'Shipping Policy', href: '/shipping-policy', desc: 'Delivery & shipping info' },
  { title: 'Return Policy', href: '/return-policy', desc: 'Returns & refunds' },
  { title: 'Privacy Policy', href: '/privacy-policy', desc: 'Privacy & data policy' },
  { title: 'Terms of Service', href: '/terms-of-service', desc: 'Terms & conditions' },
];

export default function Header() {
  const { isLoggedIn, user, logout, cart, setCartOpen, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProductsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProductsOpen(false), 150);
  };

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const q = searchQuery.toLowerCase().trim();
  const productResults = q
    ? products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    : [];
  const pageResults = q
    ? SITE_PAGES.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    : [];
  const hasResults = productResults.length > 0 || pageResults.length > 0;

  const handleResultClick = (href: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  const linkStyle = { color: '#1e4a2a' };
  const linkHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    (e.currentTarget as HTMLElement).style.color = enter ? '#c8922a' : '#1e4a2a';
    (e.currentTarget as HTMLElement).style.background = enter ? 'rgba(200,146,42,0.08)' : 'transparent';
  };

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: '#fff', borderBottom: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div style={{ borderRadius: 10, padding: 4, border: '1.5px solid rgba(200,146,42,0.35)' }}>
              <Image src="/Shoot Product only/12_Amvi-logoTL-01.webp" alt="AMVI Organics"
                width={400} height={400} className="object-contain" style={{ borderRadius: 6, width: 80, height: 80 }} />
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold leading-tight tracking-wide" style={{ color: '#e8b84b', fontSize: '1.25rem' }}>AMVI Organics</p>
              <p className="tracking-widest" style={{ color: '#c8922a', fontSize: '0.65rem' }}>NATURE&apos;S TRUST, DELIVERED</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200" style={linkStyle}
              onMouseEnter={e => linkHover(e, true)} onMouseLeave={e => linkHover(e, false)}>Home</Link>

            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                style={{ color: productsOpen ? '#c8922a' : '#1e4a2a', background: productsOpen ? 'rgba(200,146,42,0.08)' : 'transparent' }}>
                Our Products
                <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: productsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden"
                  style={{ background: '#fff', minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid rgba(200,146,42,0.15)' }}>
                  <Link href="/products" className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-150"
                    style={{ color: '#1e4a2a', borderBottom: '1px solid #f0ece6' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5f2ed'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => setProductsOpen(false)}>All Products</Link>
                  <Link href="/sweeteners" className="flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-150"
                    style={{ color: '#2e2e2e', borderBottom: '1px solid #f0ece6' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5f2ed'; e.currentTarget.style.color = '#1e4a2a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2e2e2e'; }}
                    onClick={() => setProductsOpen(false)}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e4a2a', display: 'inline-block', flexShrink: 0 }} />
                    Sweeteners
                  </Link>
                  <Link href="/combo-deals" className="flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-150"
                    style={{ color: '#2e2e2e' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f5f2ed'; e.currentTarget.style.color = '#1e4a2a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2e2e2e'; }}
                    onClick={() => setProductsOpen(false)}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8922a', display: 'inline-block', flexShrink: 0 }} />
                    Combo Deals
                  </Link>
                </div>
              )}
            </div>

            {[{ label: 'Our Story', href: '/our-story' }, { label: 'Our Process', href: '/our-process' },
              { label: 'Blog', href: '/blog' }, { label: 'FAQs', href: '/faqs' }, { label: 'Contact', href: '/contact' }].map(({ label, href }) => (
              <Link key={href} href={href} className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200" style={linkStyle}
                onMouseEnter={e => linkHover(e, true)} onMouseLeave={e => linkHover(e, false)}>{label}</Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button onClick={() => setSearchOpen(o => !o)} className="p-2 rounded-md transition-colors duration-200" style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = '#c8922a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1e4a2a')}>
                <Search size={20} />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl z-50"
                  style={{ width: 'min(340px, 90vw)', background: '#fff', border: '1px solid #f0ece6' }}>
                  <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid #f0ece6' }}>
                    <Search size={16} style={{ color: '#1e4a2a', flexShrink: 0 }} />
                    <input ref={inputRef} type="text" placeholder="Search products, pages..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm outline-none bg-transparent"
                      style={{ color: '#1e4a2a' }} />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} style={{ color: '#999' }}><X size={14} /></button>
                    )}
                  </div>

                  {q && (
                    <div className="max-h-80 overflow-y-auto py-1">
                      {!hasResults && (
                        <p className="px-4 py-4 text-sm text-center" style={{ color: '#999' }}>No results for &quot;{searchQuery}&quot;</p>
                      )}
                      {productResults.length > 0 && (
                        <>
                          <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#c8922a' }}>Products</p>
                          {productResults.map(p => (
                            <button key={p.id} onClick={() => handleResultClick(`/product/${p.id}`)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition"
                              onMouseEnter={e => (e.currentTarget.style.background = '#f5f2ed')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                                style={{ border: '1px solid #ede8e0' }} />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: '#1e4a2a' }}>{p.name}</p>
                                <p className="text-xs" style={{ color: '#999' }}>{p.category}</p>
                              </div>
                            </button>
                          ))}
                        </>
                      )}
                      {pageResults.length > 0 && (
                        <>
                          <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest mt-1" style={{ color: '#c8922a', borderTop: productResults.length ? '1px solid #f0ece6' : 'none' }}>Pages</p>
                          {pageResults.map(p => (
                            <button key={p.href} onClick={() => handleResultClick(p.href)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition"
                              onMouseEnter={e => (e.currentTarget.style.background = '#f5f2ed')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: '#f0faf2' }}>
                                <Search size={14} style={{ color: '#1e4a2a' }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: '#1e4a2a' }}>{p.title}</p>
                                <p className="text-xs truncate" style={{ color: '#999' }}>{p.desc}</p>
                              </div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {!q && (
                    <p className="px-4 py-4 text-sm text-center" style={{ color: '#aaa' }}>Type to search products &amp; pages</p>
                  )}
                </div>
              )}
            </div>

            <Link href="/wishlist" className="relative p-2 rounded-md transition-colors duration-200" style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#c8922a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1e4a2a')}>
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: '#c8922a', fontSize: '0.6rem' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-md transition-colors duration-200" style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#c8922a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1e4a2a')}>
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: '#c8922a', fontSize: '0.6rem' }}>
                  {cart.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <span className="text-xs" style={{ color: '#1e4a2a' }}>{user?.name}</span>
                <button onClick={logout} className="p-2 rounded-md" style={{ color: '#1e4a2a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#1e4a2a')} title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="ml-2 px-4 py-1.5 rounded-lg text-sm font-semibold hidden sm:block"
                style={{ background: '#c8922a', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e8b84b')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c8922a')}>Login</Link>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 ml-1 rounded-md" style={{ color: '#1e4a2a' }}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 pt-3 space-y-1" style={{ borderTop: '1px solid #f0ece6' }}>
            {/* Mobile Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2" style={{ background: '#f5f2ed' }}>
              <Search size={15} style={{ color: '#1e4a2a' }} />
              <input type="text" placeholder="Search..." className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1e4a2a' }}
                onKeyDown={e => { if (e.key === 'Enter') { const q = (e.target as HTMLInputElement).value.trim(); if (q) { const r = products.find(p => p.name.toLowerCase().includes(q.toLowerCase())); if (r) router.push(`/product/${r.id}`); setMobileMenuOpen(false); } } }} />
            </div>

            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium" style={{ color: '#1e4a2a' }}>Home</Link>

            <div>
              <button onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium" style={{ color: '#1e4a2a' }}>
                Our Products
                <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: mobileProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {mobileProductsOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold" style={{ color: '#1e4a2a' }}>All Products</Link>
                  <Link href="/sweeteners" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ color: '#1e4a2a' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#1e4a2a', display: 'inline-block' }} />Sweeteners
                  </Link>
                  <Link href="/combo-deals" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm" style={{ color: '#1e4a2a' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c8922a', display: 'inline-block' }} />Combo Deals
                  </Link>
                </div>
              )}
            </div>

            {[{ label: 'Our Story', href: '/our-story' }, { label: 'Our Process', href: '/our-process' },
              { label: 'Blog', href: '/blog' }, { label: 'FAQs', href: '/faqs' }, { label: 'Contact', href: '/contact' }].map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium" style={{ color: '#1e4a2a' }}>{label}</Link>
            ))}
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm" style={{ color: '#1e4a2a' }}>Wishlist</Link>
            {isLoggedIn ? (
              <>
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm" style={{ color: '#1e4a2a' }}>My Orders</Link>
                <button onClick={logout} className="block px-3 py-2 rounded-md text-sm w-full text-left" style={{ color: '#f87171' }}>Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-center mt-2" style={{ background: '#c8922a', color: '#fff' }}>Login</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
