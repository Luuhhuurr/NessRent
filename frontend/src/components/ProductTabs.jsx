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
    <div className="mt-[var(--spacing-xl)] max-w-4xl">
      {/* Tab Headers */}
      <div className="flex border-b border-surface-variant mb-[var(--spacing-md)] gap-[var(--spacing-lg)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
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

      {/* Tab Content */}
      <div className="text-body-md text-on-surface-variant bg-surface-container-lowest p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] border border-surface-variant">
        {activeTab === 'description' && (
          <div className="space-y-[var(--spacing-sm)]">
            <p>{content.description}</p>
            {description?.includes('Mesin') && (
              <ul className="list-disc list-inside space-y-[var(--spacing-xs)] ml-sm">
                <li>Mesin 150cc PGM-FI yang bertenaga</li>
                <li>Lampu depan LED yang futuristik</li>
                <li>Sistem pengereman CBS & fitur ISS</li>
                <li>Kapasitas bagasi yang luas (18 Liter)</li>
                <li>Desain sporty dan elegan</li>
              </ul>
            )}
          </div>
        )}
        {activeTab === 'terms' && <p>{content.terms}</p>}
        {activeTab === 'fines' && <p>{content.fines}</p>}
      </div>
    </div>
  );
}