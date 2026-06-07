'use client';

import { useAdminStore } from '@/lib/admin-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, FileText, Tag, ShoppingBag, LogOut, Menu, X, Star, Users, Settings } from 'lucide-react';
import Link from 'next/link';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Blogs', href: '/admin/blogs', icon: FileText },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { adminLoggedIn, adminLogout } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!adminLoggedIn && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [adminLoggedIn, pathname]);

  if (!adminLoggedIn && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <>{children}</>;

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <p className="font-extrabold tracking-wide text-base" style={{ color: '#e8b84b' }}>AMVI Admin</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Control Panel</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(200,146,42,0.18)' : 'transparent',
                color: active ? '#e8b84b' : 'rgba(255,255,255,0.7)',
              }}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-5">
        <button onClick={() => { adminLogout(); router.push('/admin/login'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0"
        style={{ background: 'linear-gradient(160deg,#0f2d18,#1e4a2a)' }}>
        {Sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 flex flex-col"
            style={{ background: 'linear-gradient(160deg,#0f2d18,#1e4a2a)' }}>
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button className="md:hidden p-1.5 rounded-md" style={{ color: '#1e4a2a' }}
            onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <p className="font-semibold text-gray-800 text-sm flex-1">
            {NAV.find(n => n.href === pathname)?.label ?? 'Admin'}
          </p>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#f5f2ed', color: '#1e4a2a' }}>
            ← View Site
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
