'use client';

import { useState, useEffect } from 'react';
import { AdminOrder, AdminProduct } from '@/lib/admin-store';
import { ChevronDown, ChevronUp, X, Truck, MapPin, Phone, Mail, Package, Download } from 'lucide-react';

const STATUS_OPTIONS: AdminOrder['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#fef3c718', text: '#d97706' },
  processing: { bg: '#eff6ff',   text: '#3b82f6' },
  shipped:    { bg: '#f5f3ff',   text: '#8b5cf6' },
  delivered:  { bg: '#f0fdf4',   text: '#16a34a' },
  cancelled:  { bg: '#fef2f2',   text: '#ef4444' },
  completed:  { bg: '#f0fdf4',   text: '#16a34a' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdminOrder['status'] | 'all'>('all');
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const load = () =>
    fetch('/api/orders-get')
      .then(r => r.json())
      .then(({ orders: data }) => {
        if (data) setOrders(data);
      });

  useEffect(() => {
    load();
    fetch('/api/products-get')
      .then(r => r.json())
      .then(({ products: data }) => { if (data) setProducts(data); });
  }, []);

  const getSku = (productId?: string) => {
    if (!productId) return '-';
    const product = products.find(p => p.id === productId);
    return product?.sku || `AMVI-${productId}`;
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (order: AdminOrder, status: AdminOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
    await fetch('/api/order-update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: order.id, status }) });
    if (status === 'shipped') {
      fetch('/api/send-shipped-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            orderId: order.id,
            customerName: order.customerName,
            email: order.email,
            phone: order.phone,
            items: order.items,
            subtotal: order.total,
            discount: 0,
            shipping: 0,
            tax: 0,
            total: order.total,
            shippingAddress: order.shippingAddress ?? '',
            createdAt: new Date(order.createdAt).toLocaleDateString('en-IN'),
          },
          trackingId: order.trackingId ?? '',
        }),
      });
    }
  };

  const exportOrders = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Status', 'Total', 'Tracking ID', 'Razorpay Order ID', 'Razorpay Payment ID', 'Shipping Address', 'Billing Address', 'Items'];
    const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const rows = orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      escape(o.customerName),
      o.email,
      o.phone,
      o.status,
      o.total,
      o.trackingId || '',
      o.razorpayOrderId || '',
      o.razorpayPaymentId || '',
      escape(o.shippingAddress || ''),
      escape(o.billingAddress || ''),
      escape(o.items.map((item: any) => `${item.name} x${item.qty ?? item.quantity ?? 1}`).join('; ')),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveTracking = async (orderId: string) => {
    if (trackingInput.trim()) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingId: trackingInput.trim() } : o));
      await fetch('/api/order-update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, trackingId: trackingInput.trim() }) });
      if (detailOrder?.id === orderId) {
        setDetailOrder(o => o ? { ...o, trackingId: trackingInput.trim() } : o);
      }
    }
    setTrackingOrderId(null);
    setTrackingInput('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} total orders</p>
        </div>
        <button onClick={exportOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
          style={{ background: '#f5f2ed', color: '#1e4a2a' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e8e0d5')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f5f2ed')}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUS_OPTIONS] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition"
            style={{ background: filter === s ? '#1e4a2a' : '#f5f2ed', color: filter === s ? '#fff' : '#555' }}>
            {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-gray-500">{order.id}</span>
                  <span className="font-semibold text-gray-800 text-sm">{order.customerName}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{order.email} · {order.phone}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: '#1e4a2a' }}>₹{order.total.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>

              {/* Status selector */}
              <select value={order.status}
                onChange={e => handleStatusChange(order, e.target.value as AdminOrder['status'])}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold outline-none cursor-pointer"
                style={{ background: statusColors[order.status].bg, color: statusColors[order.status].text }}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>

              <button onClick={() => setDetailOrder(order)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                style={{ background: '#1e4a2a18', color: '#1e4a2a' }}>
                Details
              </button>

              <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                {expanded === order.id
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />}
              </button>
            </div>

            {/* Tracking row */}
            <div className="px-4 pb-2 flex items-center gap-2">
              {order.trackingId ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                  <Truck size={11} /> {order.trackingId}
                </span>
              ) : null}
              {trackingOrderId === order.id ? (
                <div className="flex items-center gap-1.5">
                  <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveTracking(order.id)}
                    className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-purple-400 font-mono w-40"
                    placeholder="e.g. DTDC123456" autoFocus />
                  <button onClick={() => handleSaveTracking(order.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-white rounded-lg"
                    style={{ background: '#8b5cf6' }}>Save</button>
                  <button onClick={() => { setTrackingOrderId(null); setTrackingInput(''); }}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-lg">✕</button>
                </div>
              ) : (
                <button onClick={() => { setTrackingOrderId(order.id); setTrackingInput(order.trackingId ?? ''); }}
                  className="flex items-center gap-1 text-xs font-semibold transition"
                  style={{ color: '#8b5cf6' }}>
                  <Truck size={11} /> {order.trackingId ? 'Edit Tracking' : '+ Add Tracking'}
                </button>
              )}
            </div>

            {/* Expanded items */}
            {expanded === order.id && (
              <div className="border-t border-gray-50 px-4 py-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 mb-2">Order Items</p>
                <div className="space-y-1.5">
                  {order.items.map((item, i) => {
                    const qty = item.qty ?? item.quantity ?? 1;
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.name} <span className="text-xs text-gray-400">(SKU: {getSku(item.productId)})</span> × {qty}</span>
                        <span className="font-semibold text-gray-800">₹{(item.price * qty).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-200 mt-2">
                    <span style={{ color: '#1e4a2a' }}>Total</span>
                    <span style={{ color: '#1e4a2a' }}>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-base font-semibold">No {filter !== 'all' ? filter : ''} orders</p>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto"
          onClick={e => e.target === e.currentTarget && setDetailOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Order #{detailOrder.id}</p>
                <p className="text-xs text-gray-400">{new Date(detailOrder.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                  style={{ background: statusColors[detailOrder.status].bg, color: statusColors[detailOrder.status].text }}>
                  {detailOrder.status}
                </span>
                <button onClick={() => setDetailOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Customer</p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1e4a2a,#c8922a)' }}>
                    {detailOrder.customerName[0]}
                  </div>
                  <span className="font-semibold">{detailOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-10">
                  <Mail size={12} /> {detailOrder.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-10">
                  <Phone size={12} /> {detailOrder.phone}
                </div>
              </div>

              {/* Shipping address */}
              {detailOrder.shippingAddress && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
                    <MapPin size={12} /> Shipping Address
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{detailOrder.shippingAddress}</p>
                </div>
              )}

              {/* Tracking */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <Truck size={12} /> Tracking ID
                </div>
                {detailOrder.trackingId ? (
                  <span className="font-mono text-sm font-bold" style={{ color: '#8b5cf6' }}>{detailOrder.trackingId}</span>
                ) : (
                  <span className="text-xs text-gray-400 italic">Not set</span>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                  <Package size={12} /> Items Ordered
                </p>
                <div className="space-y-2">
                  {detailOrder.items.map((item, i) => {
                    const qty = item.qty ?? item.quantity ?? 1;
                    return (
                      <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 text-sm">
                        <span className="text-gray-700">
                          {item.name}
                          <span className="block text-xs text-gray-400">SKU: {getSku(item.productId)} · Qty: {qty}</span>
                        </span>
                        <span className="font-semibold text-gray-800">₹{(item.price * qty).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold text-base pt-2">
                    <span style={{ color: '#1e4a2a' }}>Total</span>
                    <span style={{ color: '#1e4a2a' }}>₹{detailOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Status change */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500">Update Status:</span>
                <select value={detailOrder.status}
                  onChange={e => {
                    const s = e.target.value as AdminOrder['status'];
                    handleStatusChange(detailOrder, s);
                    setDetailOrder(o => o ? { ...o, status: s } : o);
                  }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                  style={{ color: statusColors[detailOrder.status].text }}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
