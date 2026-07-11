'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Truck, ArrowLeft, Package } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('trackingId') || '';

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/orders" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-6 text-sm font-semibold">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck size={28} className="text-green-700" />
          </div>

          {trackingId ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
              <p className="text-gray-600 mb-6">Use the tracking ID below to check your shipment status.</p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking ID</p>
                <p className="text-xl font-mono font-bold text-green-700 break-all">{trackingId}</p>
              </div>

              <a
                href={`https://www.dtdc.in/trace-result.asp?strCnno=${trackingId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-3 rounded-lg font-semibold text-white transition mb-3"
                style={{ background: '#1e4a2a' }}
              >
                Track on DTDC →
              </a>
              <p className="text-xs text-gray-500">
                If your order was shipped via another courier, please{' '}
                <Link href="/contact" className="text-green-700 underline">contact support</Link>.
              </p>
            </>
          ) : (
            <>
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">No Tracking ID</h1>
              <p className="text-gray-600 mb-6">This order does not have a tracking ID yet. It will be updated once shipped.</p>
              <Link href="/orders" className="inline-block px-6 py-2.5 rounded-lg font-semibold text-white" style={{ background: '#1e4a2a' }}>
                View My Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
