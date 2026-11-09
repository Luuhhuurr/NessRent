import { useState } from 'react';

const tabs = [
  { id: 'description', label: 'Deskripsi Lengkap' },
  { id: 'terms', label: 'Syarat & Ketentuan' },
  { id: 'fines', label: 'Kebijakan Denda' },
];

export default function ProductTabs({ description, terms, fines }) {
  const [activeTab, setActiveTab] = useState('description');

  const content = {
    description: description || 'Tidak ada deskripsi tersedia.',
    terms: terms || 'Syarat dan ketentuan akan segera ditambahkan.',
    fines: fines || 'Kebijakan denda akan segera ditambahkan.',
  };

  return (
    <div className="max-w-4xl">
      <div
        role="tablist"
        className="flex border-b border-outline-variant gap-[var(--spacing-lg)] overflow-x-auto"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-[var(--spacing-xs)] text-label-md whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-body-md text-on-surface-variant panel mt-[var(--spacing-md)]">
        {activeTab === 'description' && <p>{content.description}</p>}
        {activeTab === 'terms' && <p>{content.terms}</p>}
        {activeTab === 'fines' && <p>{content.fines}</p>}
      </div>
    </div>
  );
}
