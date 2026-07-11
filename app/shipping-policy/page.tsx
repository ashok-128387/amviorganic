import PolicyContent from '@/components/policy-content';
import { DEFAULT_POLICY_CONTENT } from '@/lib/policies';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Policy</h1>
          <PolicyContent policyKey="shipping" defaultContent={DEFAULT_POLICY_CONTENT.shipping} />
        </div>
      </div>
    </div>
  );
}
