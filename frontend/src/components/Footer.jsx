export default function Footer() {
  return (
    <footer className="w-full py-[var(--spacing-xl)] mt-[var(--spacing-lg)] bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-center px-[var(--spacing-md)] max-w-[1280px] mx-auto gap-[var(--spacing-md)] font-body text-body-md">
        {/* Logo */}
        <div className="text-h3 font-heading font-extrabold text-primary hover:underline transition-all cursor-pointer">
          NesRent
        </div>

        {/* Links */}
        <div className="flex gap-[var(--spacing-md)]">
          <a
            href="#"
            className="text-secondary hover:text-primary hover:underline transition-all"
          >
            Tentang
          </a>
          <a
            href="#"
            className="text-secondary hover:text-primary hover:underline transition-all"
          >
            Kontak
          </a>
          <a
            href="#"
            className="text-secondary hover:text-primary hover:underline transition-all"
          >
            Bantuan
          </a>
        </div>

        {/* Copyright */}
        <div className="text-secondary text-center md:text-right">
          &copy; 2024 NesRent. Dibuat dengan semangat untuk Mahasiswa UNNES.
        </div>
      </div>
    </footer>
  );
}