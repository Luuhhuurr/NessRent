import { Link } from 'react-router-dom';

export default function AuthFormCard({ title, description, children, footerLink, footerLinkText }) {
  return (
    <div className="w-full lg:w-1/2 flex justify-center items-center p-[var(--spacing-md)] md:p-[var(--spacing-xl)] bg-surface-bright">
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] md:p-[var(--spacing-lg)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] border border-outline-variant/30">
        {/* Form Header */}
        <div className="mb-[var(--spacing-lg)] text-center lg:text-left">
          <h2 className="font-heading text-h2 text-on-surface mb-[var(--spacing-xs)]">
            {title}
          </h2>
          <p className=".text-body-md text-on-surface-variant">
            {description}
          </p>
        </div>

        {/* Form Content */}
        {children}

        {/* Footer Link */}
        {footerLink && footerLinkText && (
          <div className="mt-[var(--spacing-lg)] text-center">
            <p className="text-body-md text-on-surface-variant">
              {footerLink.text}{' '}
              <Link
                to={footerLink.to}
                className="text-primary font-bold hover:text-primary-fixed-dim hover:underline transition-colors"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}