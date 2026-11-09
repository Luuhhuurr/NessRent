export default function AuthFooter() {
  return (
    <footer className="w-full border-t border-outline-variant bg-background py-4 px-[var(--spacing-md)] flex flex-col sm:flex-row justify-between items-center gap-2 max-w-[1280px] mx-auto mt-auto">
      <span className="text-label-md font-heading font-bold text-on-surface">NesRent</span>
      <span className="text-caption text-on-surface-variant">
        &copy; {new Date().getFullYear()} NesRent. Dibuat untuk mahasiswa UNNES.
      </span>
      <span className="text-caption text-on-surface-variant">Demo academic project.</span>
    </footer>
  );
}
