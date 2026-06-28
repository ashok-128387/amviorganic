'use client';

import CartDrawer from '@/components/cart-drawer';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Heart, LogOut, User, Mail } from 'lucide-react';
import { useEffect } from 'react';

export default function AccountPage() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="p-6 sm:p-8 flex items-start gap-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#1e4a2a,#c8922a)' }}>
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'Valued Customer'}</h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Link href="/orders"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-green-200 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#f0faf2' }}>
                <Package size={22} style={{ color: '#1e4a2a' }} />
              </div>
              <div>
                <p className="font-bold text-gray-900">My Orders</p>
                <p className="text-xs text-gray-500">View order history & tracking</p>
              </div>
            </Link>

            <Link href="/wishlist"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-green-200 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#fff5f5' }}>
                <Heart size={22} style={{ color: '#c8922a' }} />
              </div>
              <div>
                <p className="font-bold text-gray-900">My Wishlist</p>
                <p className="text-xs text-gray-500">Saved products</p>
              </div>
            </Link>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <User size={16} /> Account
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              <Link href="/orders" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <span className="text-sm text-gray-700">Order History</span>
                <span className="text-gray-400 text-sm">→</span>
              </Link>
              <Link href="/wishlist" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <span className="text-sm text-gray-700">Wishlist</span>
                <span className="text-gray-400 text-sm">→</span>
              </Link>
              <button onClick={() => { logout(); router.push('/'); }}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition text-left">
                <span className="text-sm text-red-600 flex items-center gap-2"><LogOut size={14} /> Logout</span>
                <span className="text-red-400 text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <CartDrawer />
    </>
  );
}
