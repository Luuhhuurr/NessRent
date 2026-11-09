import { useState } from 'react';

const DEFAULT_CATEGORIES = ['Elektronik', 'Kendaraan', 'Fashion', 'Alat Camping'];

const rupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

export default function FilterSidebar({ filters, categories = [], onFilterChange }) {
  const [priceRange, setPriceRange] = useState(filters.maxPrice ?? 1000000);

  const handleCategoryChange = (categoryName) => {
    const newCategory = filters.category === categoryName ? '' : categoryName;
    onFilterChange({ category: newCategory });
  };

  const handlePriceChange = (maxPrice) => {
    setPriceRange(maxPrice);
    onFilterChange({ maxPrice });
  };

  const categoryList = categories.length
    ? categories.map((cat) => (typeof cat === 'string' ? cat : cat.category)).filter(Boolean)
    : DEFAULT_CATEGORIES;

  const activeCount =
    (filters.category ? 1 : 0) + (filters.search ? 1 : 0) + (priceRange < 1000000 ? 1 : 0);

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="panel p-[var(--spacing-md)] sticky top-[88px]">
        <div className="flex items-center justify-between mb-[var(--spacing-md)]">
          <h3 className="font-heading text-h3 text-on-surface">Filter</h3>
          {activeCount > 0 && (
            <span className="text-label-sm text-primary bg-primary-container rounded-full px-2 py-0.5">
              {activeCount} aktif
            </span>
          )}
        </div>

        <div className="mb-[var(--spacing-lg)]">
          <h4 className="text-label-md mb-[var(--spacing-sm)] text-on-surface-variant">Kategori</h4>
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            {categoryList.map((category) => (
              <label key={category} className="flex items-center gap-[var(--spacing-sm)] cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 border-outline-variant text-primary accent-primary focus:ring-primary/25 cursor-pointer"
                />
                <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-[var(--spacing-lg)]">
          <h4 className="text-label-md mb-[var(--spacing-sm)] text-on-surface-variant">
            Harga maksimum per hari
          </h4>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={priceRange}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            aria-label="Harga maksimum per hari"
            className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-[var(--spacing-sm)]">
            <span className="text-caption text-on-surface-variant">{rupiah(10000)}</span>
            <span className="text-caption text-on-surface font-semibold">{rupiah(priceRange)}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setPriceRange(1000000);
            onFilterChange({ category: '', search: '', maxPrice: 1000000 });
          }}
          className="w-full py-2 text-label-md text-on-surface-variant border border-outline-variant rounded-[var(--radius-md)] hover:border-outline hover:text-on-surface transition-colors"
        >
          Reset filter
        </button>
      </div>
    </aside>
  );
}
