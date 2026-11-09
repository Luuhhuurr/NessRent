/**
 * The decorative half of the login and register screens. It is built from
 * CSS and SVG on purpose — the app never hotlinks an external image, so it
 * renders identically offline.
 */
export default function AuthIllustration({ title, subtitle, points = [] }) {
  return (
    <div className="w-full lg:w-1/2 hidden lg:flex flex-col justify-center relative overflow-hidden bg-surface-container-lowest border-r border-outline-variant">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container/70 via-background to-background" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-32 -left-24 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 px-[var(--spacing-xl)] py-[var(--spacing-lg)]">
        <div className="flex items-center gap-3 mb-[var(--spacing-lg)]">
          <span className="w-9 h-9 rounded-[var(--radius-md)] bg-primary grid place-items-center">
            <span className="material-symbols-outlined text-on-primary text-[20px]">handshake</span>
          </span>
          <span className="font-heading text-h3 text-on-surface">NesRent</span>
        </div>

        <h1 className="font-heading text-h2 text-on-surface max-w-md leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-lg text-on-surface-variant mt-4 max-w-md">{subtitle}</p>
        )}

        {points.length > 0 && (
          <ul className="mt-[var(--spacing-lg)] space-y-3 max-w-md">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-[var(--spacing-lg)] flex gap-3">
          {[72, 48, 88].map((width, index) => (
            <div
              key={width}
              className="rounded-[var(--radius-lg)] border border-outline-variant bg-surface-container/80 backdrop-blur-sm px-4 py-3"
              style={{ width: `${width * 2.6}px`, transform: `translateY(${index * 10}px)` }}
            >
              <div className="h-2 w-2/3 rounded-full bg-outline-variant" />
              <div className="mt-2 h-1.5 w-1/3 rounded-full bg-outline-variant/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
