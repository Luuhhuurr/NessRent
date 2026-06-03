import { useState } from 'react';

const blacklistUsers = [
  { id: 1, name: 'Rudi Hermawan', nim: '5112421099', email: 'rudi.h@student.ac.id', reason: 'Pelanggaran berulang', dateAdded: '10 Nov 2024', violations: 3 },
  { id: 2, name: 'Dewi Lestari', nim: '5112421123', email: 'dewi.l@student.ac.id', reason: 'Barang dikembalikan rusak', dateAdded: '18 Nov 2024', violations: 2 },
  { id: 3, name: 'Fajar Nugroho', nim: '5112421156', email: 'fajar.n@student.ac.id', reason: 'Tidak mengembalikan barang', dateAdded: '22 Nov 2024', violations: 1 },
];

export default function BlacklistUser() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = blacklistUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.nim.includes(searchQuery)
  );

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface dock top-0 sticky z-40 flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-xs)] w-full">
        <div className="flex items-center gap-[var(--spacing-md)] flex-1">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md text-on-surface focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-on-surface-variant"
            />
          </div>
        </div>
        <div className="flex items-center gap-[var(--spacing-lg)]">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <button className="hover:text-primary-container transition-all w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-highest">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:text-primary-container transition-all w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-highest">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
          <div className="flex items-center gap-3 border-l border-surface-container-high pl-6">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shadow-sm">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 px-[var(--spacing-md)] py-[var(--spacing-lg)] max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <div className="mb-[var(--spacing-lg)]">
          <h2 className="font-heading text-h2 text-on-surface">Blacklist User</h2>
          <p className="text-body-md text-on-surface-variant mt-[var(--spacing-xs)]">Kelola pengguna yang diblacklist</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>person_off</span>
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant">Total Blacklist</p>
              <p className="font-heading text-h2 text-on-surface">{blacklistUsers.length}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-warning-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant">Pelanggaran Baru</p>
              <p className="font-heading text-h2 text-on-surface">1</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>restore</span>
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant">Permintaan Pengembalian</p>
              <p className="font-heading text-h2 text-on-surface">2</p>
            </div>
          </div>
        </div>

        {/* Blacklist Table */}
        <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest">
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Nama Lengkap</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">NIM</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Alasan</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Pelanggaran</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Tanggal</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-surface-container-highest hover:bg-surface-container-low transition-colors group">
                    <td className="py-4 px-6 font-medium">{user.name}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{user.nim}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{user.reason}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-error-container/20 text-error font-semibold">
                        {user.violations}x Pelanggaran
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{user.dateAdded}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-all" title="Detail">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button className="p-2 rounded-full text-on-surface-variant hover:text-success hover:bg-success-container/20 transition-all" title="Kembalikan Akses">
                          <span className="material-symbols-outlined text-[20px]">restore</span>
                        </button>
                        <button className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all" title="Hapus">
                          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-surface-container-low p-4 flex justify-between items-center border-t border-surface-container-highest">
            <p className="text-caption text-on-surface-variant">Menampilkan 1-{filteredUsers.length} dari {blacklistUsers.length} user</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-error-container text-on-error-container">1</button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-[var(--spacing-lg)] bg-error-container/10 border border-error-container/30 rounded-[var(--radius-xl)] p-[var(--spacing-md)] flex items-start gap-4">
          <span className="material-symbols-outlined text-error text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <h4 className="text-label-md text-on-surface mb-[var(--spacing-xs)]">Tentang Blacklist</h4>
            <p className="text-body-md text-secondary">Pengguna yang masuk dalam blacklist tidak dapat mengajukan penyewaan barang. Anda dapat mengajukan pengembalian akses setelah periode blacklist berakhir.</p>
          </div>
        </div>
      </main>
    </>
  );
}
