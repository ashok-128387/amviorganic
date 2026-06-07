'use client';

import { useAdminStore } from '@/lib/admin-store';
import Link from 'next/link';
import CartDrawer from '@/components/cart-drawer';

export default function BlogPage() {
  const { blogs } = useAdminStore();
  const published = blogs.filter((b) => b.published);

  return (
    <>
      <CartDrawer />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-green-700 transition">Home</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Blog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Blog</h1>
            <p className="text-gray-600">Tips, recipes and insights from AMVI Organics</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {published.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold">No blog posts yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map(b => (
                <Link key={b.id} href={`/blog/${b.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group flex flex-col">
                  {b.image ? (
                    <img src={b.image} alt={b.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center" style={{ background: '#f5f2ed' }}>
                      <span className="text-4xl">🌿</span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-2">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <h2 className="font-bold text-gray-900 text-base mb-2 group-hover:text-green-700 transition line-clamp-2">{b.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-3 flex-1">{b.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400">{b.author}</span>
                      <span className="text-xs font-semibold" style={{ color: '#1e4a2a' }}>Read more →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
