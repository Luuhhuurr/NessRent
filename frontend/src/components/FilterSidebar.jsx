import { useState } from 'react';

const availabilityOptions = [
  { value: '', label: 'Semua' },
  { value: 'available', label: 'Tersedia' },
  { value: 'unavailable', label: 'Tidak Tersedia' },
];

export default function FilterSidebar({
  filters,
  categories = [],
  onFilterChange,
}) {
  const [priceRange, setPriceRange] = useState(500000);

  const handleCategoryChange = (categoryName) => {
    const currentCategory = filters.category;
    const newCategory = currentCategory === categoryName ? '' : categoryName;
    onFilterChange({ ...filters, category: newCategory });
  };

  const handleAvailabilityChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriceChange = (maxPrice) => {
    setPriceRange(maxPrice);
    // Price filter can be sent to backend if needed
  };

  // Use dynamic categories or fallback to default
  const categoryList = categories.length > 0
    ? categories.map((cat) => ({ id: cat.category, label: cat.category }))
    : [
        { id: 'Elektronik', label: 'Elektronik' },
        { id: 'Kendaraan', label: 'Kendaraan' },
        { id: 'Alat Tulis', label: 'Alat Tulis' },
        { id: 'Musik', label: 'Musik' },
        { id: 'Hobi', label: 'Hobi' },
      ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-[var(--spacing-lg)]">
      <div className="bg-surface-container-lowest p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)]">
        <h3 className="font-heading text-h3 mb-[var(--spacing-md)] text-on-background">Filter</h3>

        {/* Kategori */}
        <div className="mb-[var(--spacing-lg)]">
          <h4 className="text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Kategori</h4>
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            {categoryList.map((cat) => (
              <label key={cat.id} className="flex items-center gap-[var(--spacing-xs)] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category === cat.id}
                  onChange={() => handleCategoryChange(cat.id)}
                  className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer"
                />
                <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Harga */}
        <div className="mb-[var(--spacing-lg)]">
          <h4 className="text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Harga Maks (per hari)</h4>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={priceRange}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
          />
          <div className="flex justify-between mt-[var(--spacing-xs)]">
            <span className="text-caption text-on-surface-variant">Rp 10.000</span>
            <span className="text-caption text-primary font-semibold">
              Rp {priceRange.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Ketersediaan */}
        <div>
          <h4 className="text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Ketersediaan</h4>
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            {availabilityOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-[var(--spacing-xs)] cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={filters.status === opt.value}
                  onChange={() => handleAvailabilityChange(opt.value)}
                  className="w-5 h-5 border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer"
                />
                <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => onFilterChange({ category: '', status: '', search: '' })}
          className="mt-[var(--spacing-md)] w-full py-2 text-label-md text-primary hover:bg-primary-container/10 rounded-[var(--radius-lg)] transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </aside>
  );
}