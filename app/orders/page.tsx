'use client';

import CartDrawer from '@/components/cart-drawer';
import { useStore } from '@/lib/store';
import { AdminProduct } from '@/lib/admin-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OrderItem {
  productId: string;
  variationId: string;
  quantity: number;
  price: number;
  name?: string;
}

interface DbOrder {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
  trackingId?: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useStore();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
    if (user?.email) {
      fetch(`/api/orders-get?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(({ orders: o }) => { if (o) setOrders(o); });
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn) return null;

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven&apos;t placed any orders yet. Start shopping and add items to your
                cart.
              </p>
              <Link
                href="/"
                className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-bold text-gray-900">
                          {order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                        <p className="font-bold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="font-bold text-green-700 text-lg">
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          {order.status === 'completed' || order.status === 'delivered' ? (
                            <>
                              <CheckCircle size={18} className="text-green-600" />
                              <span className="font-bold text-green-600 capitalize">{order.status}</span>
                            </>
                          ) : (
                            <>
                              <Clock size={18} className="text-blue-600" />
                              <span className="font-bold text-blue-600 capitalize">{order.status}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Items ({order.items.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, idx) => {
                        const product = products.find((p) => p.id === item.productId);
                        const variation = product?.variations.find(
                          (v) => v.id === item.variationId
                        );

                        return (
                          <div
                            key={idx}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={product?.image || '/placeholder-logo.png'}
                              alt={product?.name || item.name || 'Product'}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {product?.name || item.name || 'Product'}
                              </p>
                              <p className="text-xs text-gray-600">
                                {variation?.name || ''} x {item.quantity}
                              </p>
                              <p className="font-bold text-gray-900 text-sm mt-1">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                      {order.shippingAddress}
                    </p>
                    <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-4">
                    <button className="text-green-700 font-semibold hover:text-green-800 transition">
                      Track Order
                    </button>
                    <button className="text-gray-600 font-semibold hover:text-gray-800 transition">
                      Contact Support
                    </button>
                    <Link
                      href="/"
                      className="text-blue-700 font-semibold hover:text-blue-800 transition"
                    >
                      Reorder
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
