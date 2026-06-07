'use client';

import { useStore } from '@/lib/store';
import { useAdminStore } from '@/lib/admin-store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Truck, Lock, Phone, MapPin, Tag, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window { Razorpay: any; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isLoggedIn, user, addOrder } = useStore();
  const { products, validateCoupon } = useAdminStore();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Fix: redirect in useEffect, not during render
  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  // Calculate subtotal using admin store products
  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    const variation = product?.variations.find((v) => v.id === item.variationId);
    return total + (variation?.price || 0) * item.quantity;
  }, 0);

  const discount = appliedCoupon?.discount ?? 0;
  const shipping = cartTotal > 500 ? 0 : 50;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal - discount + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    const result = validateCoupon(couponInput.trim(), cartTotal);
    if (result.valid) {
      setAppliedCoupon({ code: couponInput.toUpperCase(), discount: result.discount, message: result.message });
      setCouponInput('');
    } else {
      setCouponError(result.message);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponInput('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>(resolve => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load');

      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const { orderId, error: orderError } = await res.json();
      if (orderError) throw new Error(orderError);

      const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: 'INR',
          order_id: orderId,
          name: 'AMVI Organics',
          description: `Order for ${cart.length} item(s)`,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          handler: async (response: any) => {
            const orderItems = cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              const variation = product?.variations.find((v) => v.id === item.variationId);
              return { productId: item.productId, variationId: item.variationId, quantity: item.quantity, price: variation?.price || 0 };
            });
            const orderData = {
              id: Math.random().toString(),
              userId: user?.id || '',
              items: orderItems,
              total,
              status: 'completed' as const,
              razorpayOrderId: response.razorpay_order_id || '',
              razorpayPaymentId: response.razorpay_payment_id || '',
              email: formData.email,
              phone: formData.phone,
              shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
              createdAt: new Date(),
            };
            addOrder(orderData);
            clearCart();
            // Save order to DB permanently
            fetch('/api/orders-save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...orderData,
                customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                items: orderItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const variation = product?.variations.find((v) => v.id === item.variationId);
                  return { name: `${product?.name} (${variation?.name})`, qty: item.quantity, price: item.price };
                }),
                subtotal: cartTotal, discount, shipping, tax,
              }),
            });
            // Send order confirmation email via server API
            fetch('/api/send-order-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.id,
                customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                items: orderItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const variation = product?.variations.find((v) => v.id === item.variationId);
                  return { name: `${product?.name} (${variation?.name})`, qty: item.quantity, price: item.price };
                }),
                subtotal: cartTotal,
                discount,
                shipping,
                tax,
                total,
                shippingAddress: orderData.shippingAddress,
                createdAt: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
              }),
            });
            router.push(`/order-confirmation?orderId=${orderData.id}`);
          },
          modal: { ondismiss: () => setLoading(false) },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products before proceeding to checkout</p>
          <Link href="/" className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-6">
          <ChevronLeft size={20} /> Back to Shopping
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">{error}</div>
              )}

              {/* Delivery Address */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} /> Delivery Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700" />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input type="email" name="email" placeholder="Email Address *" value={formData.email}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700" />
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-700">
                    <Phone size={18} className="text-gray-400 flex-shrink-0" />
                    <input type="tel" name="phone" placeholder="Phone (10 digits) *" value={formData.phone}
                      onChange={handleInputChange} maxLength={10}
                      className="flex-1 outline-none" />
                  </div>
                </div>
                <textarea name="address" placeholder="Street Address *" value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700 mb-4 resize-none" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input type="text" name="city" placeholder="City *" value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700" />
                  <select name="state" value={formData.state} onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700">
                    <option value="">Select State *</option>
                    {['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Delhi', 'Gujarat', 'Rajasthan', 'West Bengal', 'Kerala'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input type="text" name="pincode" placeholder="Pincode *" value={formData.pincode}
                    onChange={handleInputChange} maxLength={6}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700" />
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start mb-6">
                <Truck size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Free delivery on orders above ₹500</p>
                  <p className="text-sm text-blue-800">Standard delivery: 3-5 business days</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Lock size={16} />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const variation = product?.variations.find((v) => v.id === item.variationId);
                  if (!product || !variation) return null;
                  return (
                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg">🌿</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{variation.name} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
                        ₹{(variation.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                  <Tag size={13} /> Coupon Code
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-green-800">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-700">{appliedCoupon.message}</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="p-1 hover:bg-green-100 rounded transition">
                      <X size={14} className="text-green-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700 font-mono"
                    />
                    <button onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0 transition"
                      style={{ background: '#1e4a2a' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 mb-5 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-green-700">
                    <span>Coupon Discount</span>
                    <span>− ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-700 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2.5 border-t border-gray-100">
                  <span>Total</span>
                  <span style={{ color: '#1e4a2a' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button onClick={handleRazorpayPayment} disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#1e4a2a' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = '#2a6b3e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
                {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')} with Razorpay`}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">💳 Secure Payment Powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
