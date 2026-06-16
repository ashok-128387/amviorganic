'use client';

import { Package, FileText, Tag, ShoppingBag, TrendingUp, AlertCircle, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
    fetch('/api/blogs-get').then(r => r.json()).then(({ blogs: b }) => { if (b) setBlogs(b); });
    fetch('/api/coupons-get').then(r => r.json()).then(({ coupons: c }) => { if (c) setCoupons(c); });
    fetch('/api/orders-get').then(r => r.json()).then(({ orders: o }) => { if (o) setOrders(o); });
    fetch('/api/users-get').then(r => r.json()).then(({ users: u }) => { if (u) setUsers(u); });
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  // Low stock: variations with stock < 10
  const lowStock = products.flatMap(p =>
    p.variations.filter(v => v.stock < 10).map(v => ({ product: p.name, variation: v.name, stock: v.stock }))
  );

  // 7-day revenue chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const dayRevenue = days.map(d => ({
    label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    value: orders
      .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + o.total, 0),
  }));
  const maxRev = Math.max(...dayRevenue.map(d => d.value), 1);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, href: '/admin/products', color: '#1e4a2a' },
    { label: 'Blog Posts', value: blogs.filter(b => b.published).length, icon: FileText, href: '/admin/blogs', color: '#c8922a' },
    { label: 'Active Coupons', value: coupons.filter(c => c.active).length, icon: Tag, href: '/admin/coupons', color: '#2a6b3e' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, href: '/admin/orders', color: '#c8922a' },
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, icon: TrendingUp, href: '/admin/orders', color: '#1e4a2a' },
    { label: 'Pending Orders', value: pending, icon: AlertCircle, href: '/admin/orders', color: pending > 0 ? '#ef4444' : '#1e4a2a' },
    { label: 'Registered Users', value: users.length, icon: Users, href: '/admin/users', color: '#6366f1' },
  ];

  const statusColors: Record<string, string> = {
    pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6',
    delivered: '#10b981', cancelled: '#ef4444', completed: '#10b981',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back to AMVI Organics Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 7-Day Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="font-semibold text-gray-800 mb-4">Revenue — Last 7 Days</p>
          <div className="flex items-end gap-2 h-32">
            {dayRevenue.map(({ label, value }, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-semibold">
                  {value > 0 ? `₹${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}` : ''}
                </span>
                <div className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max((value / maxRev) * 96, value > 0 ? 6 : 2)}px`,
                    background: value > 0 ? 'linear-gradient(180deg,#2a6b3e,#1e4a2a)' : '#f0ece6',
                  }} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-xs text-gray-500">
            <span>7-day total</span>
            <span className="font-bold" style={{ color: '#1e4a2a' }}>
              ₹{dayRevenue.reduce((s, d) => s + d.value, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800">Low Stock Alerts</p>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lowStock.length > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
              {lowStock.length > 0 ? `${lowStock.length} variants` : 'All Good ✓'}
            </span>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">All product variants have sufficient stock.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lowStock.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-xs">{item.product}</p>
                    <p className="text-xs text-gray-400">{item.variation}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.stock === 0 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                    {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/products"
            className="block text-center text-xs font-semibold mt-3 pt-3 border-t border-gray-50"
            style={{ color: '#1e4a2a' }}>
            Manage Products →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Recent Orders</p>
          <Link href="/admin/orders" className="text-xs font-semibold" style={{ color: '#1e4a2a' }}>View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{order.customerName}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1e4a2a' }}>₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{ background: `${statusColors[order.status]}18`, color: statusColors[order.status] }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: '+ Add Product', href: '/admin/products', bg: '#1e4a2a' },
          { label: '+ New Blog', href: '/admin/blogs', bg: '#c8922a' },
          { label: '+ Add Coupon', href: '/admin/coupons', bg: '#2a6b3e' },
          { label: 'View Orders', href: '/admin/orders', bg: '#555' },
          { label: '⚙ Settings', href: '/admin/settings', bg: '#6366f1' },
        ].map(({ label, href, bg }) => (
          <Link key={label} href={href}
            className="text-center py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: bg }}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
