'use client';

import { useAdminStore } from '@/lib/admin-store';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import CartDrawer from '@/components/cart-drawer';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { blogs } = useAdminStore();
  const post = blogs.find(b => b.slug === slug && b.published);

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-2xl font-bold text-gray-800 mb-2">Post not found</p>
        <Link href="/blog" className="text-sm font-semibold" style={{ color: '#1e4a2a' }}>← Back to Blog</Link>
      </div>
    </div>
  );

  // Simple markdown-like renderer
  const renderContent = (content: string) =>
    content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3" style={{ color: '#1e4a2a' }}>{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3" style={{ color: '#1e4a2a' }}>{line.slice(2)}</h1>;
      if (line.startsWith('- ') || line.startsWith('• ')) return (
        <li key={i} className="ml-4 text-gray-700 mb-1 list-disc"
          dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      );
      if (line.trim() === '') return <div key={i} className="h-3" />;
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-1"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      );
    });

  return (
    <>
      <CartDrawer />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-700 transition">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-green-700 transition">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {post.image && <img src={post.image} alt={post.title} className="w-full h-56 sm:h-72 object-cover" />}
            <div className="p-6 sm:p-8">
              <p className="text-xs text-gray-400 mb-3">
                {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {post.author}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100 italic">{post.excerpt}</p>
              <div className="prose-sm text-gray-700 space-y-1">
                {renderContent(post.content)}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/blog"
              className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white transition"
              style={{ background: '#1e4a2a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2a6b3e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e4a2a')}>
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
