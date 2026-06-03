const categories = [
  { id: 1, name: 'Jas', icon: 'checkroom' },
  { id: 2, name: 'Kamera', icon: 'photo_camera' },
  { id: 3, name: 'Motor', icon: 'two_wheeler' },
  { id: 4, name: 'Sound System', icon: 'speaker' },
];

export default function CategorySection() {
  return (
    <section className="py-[var(--spacing-lg)] px-[var(--spacing-md)] bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-h2 font-heading mb-[var(--spacing-md)] text-center text-on-surface">
          Kategori Barang
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-md)]">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-surface rounded-[var(--radius-xl)] p-[var(--spacing-md)] flex flex-col items-center gap-[var(--spacing-xs)] shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] hover:shadow-[0_8px_24px_0_rgba(31,41,55,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[48px]">
                {category.icon}
              </span>
              <span className="text-label-md text-on-surface">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}