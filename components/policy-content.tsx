'use client';

import { useEffect, useState } from 'react';

interface PolicyContentProps {
  policyKey: string;
  defaultContent: string;
}

export default function PolicyContent({ policyKey, defaultContent }: PolicyContentProps) {
  const [content, setContent] = useState<string>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings-get')
      .then(r => r.json())
      .then(({ settings }) => {
        try {
          const policies = settings?.policyContent ? JSON.parse(settings.policyContent) : {};
          if (policies[policyKey]) setContent(policies[policyKey]);
        } catch {}
      })
      .finally(() => setLoading(false));
  }, [policyKey]);

  if (loading) return <div className="py-10 text-center text-gray-400 text-sm">Loading policy...</div>;
  return (
    <div className="prose prose-gray max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
