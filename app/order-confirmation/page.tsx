'use client';

import { useStore } from '@/lib/store';
import { useAdminStore } from '@/lib/admin-store';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user, orders } = useStore();

  const { products } = useAdminStore();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-md mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">
              We couldn&apos;t find your order. Please check the order ID.
            </p>
            <Link
              href="/"
              className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-600 text-sm mb-1">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Order Date</p>
                <p className="text-2xl font-bold text-gray-900">
                  {order.createdAt.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="mb-8" />

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId);
                  const variation = product?.variations.find(
                    (v) => v.id === item.variationId
                  );

                  if (!product || !variation) return null;

                  return (
                    <div key={idx} className="flex justify-between items-center py-4 border-b">
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {variation.name} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{(order.total * 0.95).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    ₹{Math.round(order.total * 0.05).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold text-green-700 text-lg">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="mb-8" />

            {/* Timeline */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-6">What&apos;s Next?</h3>
              <div className="space-y-6">
                {/* Confirmation */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">
                      Check your email at {order.email} for order confirmation
                    </p>
                  </div>
                </div>

                {/* Processing */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Package size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">
                      Your order will be processed within 24 hours
                    </p>
                  </div>
                </div>

                {/* Shipping */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Truck size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">
                      Expected delivery: 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Home size={20} />
                Delivery Address
              </h3>
              <p className="text-blue-900 font-semibold mb-2">{user?.name}</p>
              <p className="text-blue-800 text-sm whitespace-pre-wrap">
                {order.shippingAddress}
              </p>
              <p className="text-blue-800 text-sm mt-3">
                Phone: {order.phone}
              </p>
            </div>
          </div>

          {/* Email Notification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex gap-4">
            <Mail size={24} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Confirmation Email Sent</p>
              <p className="text-sm text-green-800 mt-1">
                A detailed order confirmation has been sent to{' '}
                <span className="font-semibold">{order.email}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/orders"
              className="block bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition text-center"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="block bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Need help?{' '}
              <a href="#" className="text-green-700 hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
