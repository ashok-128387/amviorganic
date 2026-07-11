'use client';

import { useRef } from 'react';
import { Bold, Italic, Heading, List, ListOrdered, Link2, Quote, Minus, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, rows = 8, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after: string = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || 'text';
    const replacement = `${before}${selected}${after}`;
    const next = value.slice(0, start) + replacement + value.slice(end);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const insert = (html: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const next = value.slice(0, start) + html + value.slice(start);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + html.length, start + html.length);
    }, 0);
  };

  const buttons = [
    { icon: Bold, label: 'Bold', action: () => wrap('<strong>', '</strong>') },
    { icon: Italic, label: 'Italic', action: () => wrap('<em>', '</em>') },
    { icon: Heading, label: 'Heading 2', action: () => insert('<h2 class="text-2xl font-semibold text-gray-900 mb-4">Heading</h2>') },
    { icon: Type, label: 'Heading 3', action: () => insert('<h3 class="text-lg font-semibold text-gray-900 mb-3">Heading</h3>') },
    { icon: List, label: 'Bullet list', action: () => wrap('<ul class="space-y-2 text-gray-700 mb-4">\n  <li>• ', '</li>\n  <li>• Item</li>\n</ul>') },
    { icon: ListOrdered, label: 'Numbered list', action: () => wrap('<ol class="space-y-2 text-gray-700 mb-4 list-decimal pl-5">\n  <li>', '</li>\n  <li>Item</li>\n</ol>') },
    { icon: Link2, label: 'Link', action: () => wrap('<a href="#" class="text-green-700 hover:underline">', '</a>') },
    { icon: Quote, label: 'Highlight box', action: () => wrap('<div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">\n  <p class="text-sm text-blue-800"><strong>', '</strong></p>\n</div>') },
    { icon: Minus, label: 'Divider', action: () => insert('<div class="text-center mt-12 pt-8 border-t border-gray-200"></div>') },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-700">
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 bg-gray-50 border-b border-gray-200">
        {buttons.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            title={label}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm outline-none resize-y font-mono"
      />
    </div>
  );
}
