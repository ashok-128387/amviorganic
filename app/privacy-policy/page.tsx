import PolicyContent from '@/components/policy-content';
import { DEFAULT_POLICY_CONTENT } from '@/lib/policies';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
          <PolicyContent policyKey="privacy" defaultContent={DEFAULT_POLICY_CONTENT.privacy} />
        </div>
      </div>
    </div>
  );
}
