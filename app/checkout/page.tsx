'use client';

import { useStore } from '@/lib/store';
import { AdminProduct } from '@/lib/admin-store';
import { calculateShipping, DEFAULT_SHIPPING_ZONES, PincodeMapping, ShippingZone } from '@/lib/shipping';
import { getVariationStock, isVariationOutOfStock } from '@/lib/inventory';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Truck, Lock, Phone, MapPin, Tag, X, CheckCircle, Building2 } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window { Razorpay: any; }
}

const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'];

const emptyAddress = { address: '', city: '', state: '', pincode: '' };

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isLoggedIn, user, addOrder } = useStore();
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
  });

  const [deliveryAddress, setDeliveryAddress] = useState({ ...emptyAddress });
  const [billingAddress, setBillingAddress] = useState({ ...emptyAddress });
  const [sameAsDelivery, setSameAsDelivery] = useState(true);

  // GST
  const [wantsGst, setWantsGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [gstCompany, setGstCompany] = useState('');
  const [gstError, setGstError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    freeShippingThreshold: 500,
    shippingCharge: 50,
    taxPercent: 5,
    shippingZones: DEFAULT_SHIPPING_ZONES as Record<string, { baseRate: number; gstPercent: number; label: string }>,
    shippingPincodes: {} as PincodeMapping,
  });

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    fetch('/api/products-get').then(r => r.json()).then(({ products: p }) => { if (p) setProducts(p); });
    fetch('/api/settings-get').then(r => r.json()).then(({ settings: s }) => {
      if (s) {
        let zones = DEFAULT_SHIPPING_ZONES as Record<string, { baseRate: number; gstPercent: number; label: string }>;
        let pincodes: PincodeMapping = {};
        try { if (s.shippingZones) zones = JSON.parse(s.shippingZones); } catch {}
        try { if (s.shippingPincodes) pincodes = JSON.parse(s.shippingPincodes); } catch {}
        setSettings({
          freeShippingThreshold: Number(s.freeShippingThreshold ?? 500),
          shippingCharge: Number(s.shippingCharge ?? 50),
          taxPercent: Number(s.taxPercent ?? 5),
          shippingZones: zones,
          shippingPincodes: pincodes,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    const variation = product?.variations.find((v) => v.id === item.variationId);
    return total + (variation?.price || 0) * item.quantity;
  }, 0);

  const discount = appliedCoupon?.discount ?? 0;
  const shippingInfo = calculateShipping(
    deliveryAddress.pincode,
    cartTotal,
    settings.freeShippingThreshold,
    settings.shippingZones,
    settings.shippingPincodes
  );
  const shipping = shippingInfo.total;
  const tax = Math.round(cartTotal * (settings.taxPercent / 100));
  const total = cartTotal - discount + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = await fetch('/api/coupon-validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponInput.trim(), orderTotal: cartTotal }),
    });
    const result = await res.json();
    if (result.valid) {
      setAppliedCoupon({ code: couponInput.toUpperCase(), discount: result.discount, message: result.message });
      setCouponInput('');
    } else {
      setCouponError(result.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponInput('');
  };

  const validateGst = (val: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);

  const validateForm = () => {
    if (!formData.firstName || !formData.email || !formData.phone || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      setError('Please enter a valid 6-digit pincode for delivery address');
      return false;
    }
    if (!sameAsDelivery) {
      if (!billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.pincode) {
        setError('Please fill in all billing address fields');
        return false;
      }
      if (!/^\d{6}$/.test(billingAddress.pincode)) {
        setError('Please enter a valid 6-digit pincode for billing address');
        return false;
      }
    }
    if (wantsGst && gstNumber && !validateGst(gstNumber)) {
      setGstError('Invalid GST number format (e.g. 22AAAAA0000A1Z5)');
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

    // Validate cart stock before payment
    const stockErrors: string[] = [];
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      const variation = product?.variations.find(v => v.id === item.variationId);
      if (!product || !variation) {
        stockErrors.push(`Product not found for an item in your cart.`);
        continue;
      }
      const stock = getVariationStock(product, variation.id);
      if (isVariationOutOfStock(product, variation.id)) {
        stockErrors.push(`${product.name} (${variation.name}) is out of stock.`);
      } else if (item.quantity > stock) {
        stockErrors.push(`${product.name} (${variation.name}) has only ${stock} available. Please reduce quantity.`);
      }
    }
    if (stockErrors.length > 0) {
      setError(stockErrors.join(' '));
      setLoading(false);
      return;
    }
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

      const effectiveBilling = sameAsDelivery ? deliveryAddress : billingAddress;

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
              return { productId: item.productId, variationId: item.variationId, quantity: item.quantity, price: variation?.price || 0, name: `${product?.name} (${variation?.name})` };
            });
            const shippingAddressStr = `${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}`;
            const orderData = {
              id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userId: user?.id || '',
              items: orderItems,
              total,
              status: 'processing' as const,
              razorpayOrderId: response.razorpay_order_id || '',
              razorpayPaymentId: response.razorpay_payment_id || '',
              email: formData.email,
              phone: formData.phone,
              shippingAddress: shippingAddressStr,
              createdAt: new Date(),
            };
            addOrder(orderData);
            clearCart();
            if (appliedCoupon) {
              fetch('/api/coupon-use', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: appliedCoupon.code }) });
            }
            await fetch('/api/orders-save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...orderData,
                customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                billingAddress: `${effectiveBilling.address}, ${effectiveBilling.city}, ${effectiveBilling.state} ${effectiveBilling.pincode}`,
                gstNumber: wantsGst ? gstNumber : '',
                gstCompany: wantsGst ? gstCompany : '',
                items: orderItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const variation = product?.variations.find((v) => v.id === item.variationId);
                  return { productId: item.productId, variationId: item.variationId, name: `${product?.name} (${variation?.name})`, qty: item.quantity, price: item.price };
                }),
                subtotal: cartTotal, discount, shipping, tax,
              }),
            });
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
                shippingAddress: shippingAddressStr,
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

  const inputCls = 'px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700 w-full';

  const cartStockIssues = cart.some((item) => {
    const product = products.find((p) => p.id === item.productId);
    const variation = product?.variations.find((v) => v.id === item.variationId);
    if (!product || !variation) return true;
    return isVariationOutOfStock(product, variation.id) || item.quantity > getVariationStock(product, variation.id);
  });

  if (cart.length === 0 || cartStockIssues) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {cartStockIssues ? 'Stock issue in cart' : 'Your cart is empty'}
          </h1>
          <p className="text-gray-600 mb-8">
            {cartStockIssues
              ? 'One or more items in your cart are out of stock or exceed available quantity. Please review your cart.'
              : 'Add some products before proceeding to checkout'}
          </p>
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
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">{error}</div>
              )}

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone size={18} /> Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName}
                    onChange={handleInputChange} className={inputCls} />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName}
                    onChange={handleInputChange} className={inputCls} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="email" name="email" placeholder="Email Address *" value={formData.email}
                    onChange={handleInputChange} className={inputCls} />
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-700">
                    <Phone size={18} className="text-gray-400 flex-shrink-0" />
                    <input type="tel" name="phone" placeholder="Phone (10 digits) *" value={formData.phone}
                      onChange={handleInputChange} maxLength={10}
                      className="flex-1 outline-none" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} /> Delivery Address
                </h2>
                <textarea name="address" placeholder="Street Address *" value={deliveryAddress.address}
                  onChange={handleDeliveryChange} rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700 mb-4 resize-none" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input type="text" name="city" placeholder="City *" value={deliveryAddress.city}
                    onChange={handleDeliveryChange} className={inputCls} />
                  <select name="state" value={deliveryAddress.state} onChange={handleDeliveryChange}
                    className={inputCls}>
                    <option value="">Select State *</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="text" name="pincode" placeholder="Pincode *" value={deliveryAddress.pincode}
                    onChange={handleDeliveryChange} maxLength={6} className={inputCls} />
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Building2 size={18} /> Billing Address
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={sameAsDelivery} onChange={e => setSameAsDelivery(e.target.checked)}
                      className="w-4 h-4 accent-green-700 cursor-pointer" />
                    <span className="text-sm text-gray-600">Same as delivery address</span>
                  </label>
                </div>
                {!sameAsDelivery && (
                  <>
                    <textarea name="address" placeholder="Billing Street Address *" value={billingAddress.address}
                      onChange={handleBillingChange} rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-700 mb-4 resize-none" />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <input type="text" name="city" placeholder="City *" value={billingAddress.city}
                        onChange={handleBillingChange} className={inputCls} />
                      <select name="state" value={billingAddress.state} onChange={handleBillingChange}
                        className={inputCls}>
                        <option value="">Select State *</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="text" name="pincode" placeholder="Pincode *" value={billingAddress.pincode}
                        onChange={handleBillingChange} maxLength={6} className={inputCls} />
                    </div>
                  </>
                )}
              </div>

              {/* GST Details (optional) */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-2 cursor-pointer select-none mb-3">
                  <input type="checkbox" checked={wantsGst} onChange={e => { setWantsGst(e.target.checked); setGstError(''); setGstNumber(''); setGstCompany(''); }}
                    className="w-4 h-4 accent-green-700 cursor-pointer" />
                  <span className="text-sm font-semibold text-gray-700">Add GST details (optional, for business purchases)</span>
                </label>
                {wantsGst && (
                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <input type="text" placeholder="GST Number (e.g. 22AAAAA0000A1Z5)" value={gstNumber}
                        onChange={e => { setGstNumber(e.target.value.toUpperCase()); setGstError(''); }}
                        maxLength={15} className={inputCls} />
                      {gstError && <p className="text-xs text-red-500 mt-1">{gstError}</p>}
                    </div>
                    <input type="text" placeholder="Company / Business Name" value={gstCompany}
                      onChange={e => setGstCompany(e.target.value)} className={inputCls} />
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start mb-4">
                <Truck size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Free delivery on orders above ₹{settings.freeShippingThreshold}</p>
                  {deliveryAddress.pincode ? (
                    <p className="text-sm text-blue-800">
                      {shippingInfo.free
                        ? 'You qualify for free shipping!'
                        : `Shipping charge: ₹${shippingInfo.total} (GST included)`}
                    </p>
                  ) : (
                    <p className="text-sm text-blue-800">Enter pincode to calculate shipping</p>
                  )}
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
                  <span>Tax ({settings.taxPercent}%)</span>
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

      {/* Floating WhatsApp button */}
      <a href="https://wa.me/918748899100" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110"
        style={{ background: '#25d366' }} title="Chat on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </a>
    </main>
  );
}
