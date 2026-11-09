import { Link } from 'react-router-dom';

/**
 * The single product card used by the landing grid, the catalogue and the
 * dashboard. Every surface links through to the product detail page.
 */
export default function ProductCard({
  id,
  name,
  price,
  unit = 'hari',
  image,
  status = 'Tersedia',
  category,
}) {
  const isAvailable = status === 'Tersedia';

  return (
    <article className="panel overflow-hidden flex flex-col group hover:border-outline transition-colors duration-200">
      <Link to={`/products/${id}`} className="block">
        <div className="relative h-44 w-full overflow-hidden bg-surface-container">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 rounded-full text-caption flex items-center gap-1.5 border ${
              isAvailable
                ? 'bg-success-container/90 text-on-success-container border-success/20'
                : 'bg-surface-container-high/90 text-on-surface-variant border-outline-variant'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-success' : 'bg-outline'}`} />
            {status}
          </span>
        </div>
      </Link>

      <div className="p-[var(--spacing-md)] flex flex-col gap-[var(--spacing-xs)] flex-grow">
        {category && <p className="text-label-sm text-on-surface-variant">{category}</p>}
        <h3 className="text-label-md text-on-surface line-clamp-2">{name}</h3>

        <div className="flex items-baseline gap-1 mt-auto pt-2">
          <span className="font-heading text-h3 text-on-surface">{price}</span>
          <span className="text-body-sm text-on-surface-variant">/ {unit}</span>
        </div>

        <Link
          to={`/products/${id}`}
          className="mt-2 w-full text-center py-2.5 rounded-[var(--radius-md)] text-label-md border border-outline text-on-surface hover:border-primary hover:text-primary transition-colors duration-200"
        >
          Lihat detail
        </Link>
      </div>
    </article>
  );
}
