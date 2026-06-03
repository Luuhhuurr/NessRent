export default function AuthFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant py-[var(--spacing-lg)] px-[var(--spacing-md)] flex flex-col md:flex-row justify-between items-center gap-[var(--spacing-xs)] max-w-[1280px] mx-auto mt-auto">
      <span className="text-label-md font-heading font-bold text-on-surface">NesRent</span>
      <span className="text-caption text-on-surface-variant">
        &copy; 2024 NesRent. Built for students.
      </span>
      <div className="flex gap-[var(--spacing-md)] text-caption">
        <a className="text-on-surface-variant hover:text-primary transition-all" href="#">
          Privacy Policy
        </a>
        <a className="text-on-surface-variant hover:text-primary transition-all" href="#">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}