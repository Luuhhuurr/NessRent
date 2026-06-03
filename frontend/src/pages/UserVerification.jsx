import { useState } from 'react';

const users = [
  { id: 1, name: 'Budi Santoso', nim: '5112421001', email: 'budi.santoso@student.ac.id', status: 'Pending', faculty: 'Teknik', phone: '+62 812-3456-7890' },
  { id: 2, name: 'Andi Wijaya', nim: '5112421045', email: 'andi.w@student.ac.id', status: 'Terverifikasi', faculty: 'Ekonomi', phone: '+62 812-3456-7891' },
  { id: 3, name: 'Siti Aminah', nim: '5112421088', email: 'siti.a@student.ac.id', status: 'Ditolak', faculty: 'Hukum', phone: '+62 812-3456-7892' },
];

const statusColors = {
  Pending: 'bg-[#FEF3C7] text-[#92400E]',
  Terverifikasi: 'bg-[#D1FAE5] text-[#065F46]',
  Ditolak: 'bg-[#FEE2E2] text-[#991B1B]',
};

const statusFilters = ['Semua', 'Pending', 'Terverifikasi', 'Ditolak'];

export default function UserVerification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedUser, setSelectedUser] = useState(users[0]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.nim.includes(searchQuery);
    const matchesStatus = statusFilter === 'Semua' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <main className="flex-1 px-[var(--spacing-md)] py-[var(--spacing-lg)] max-w-[1280px] mx-auto w-full flex gap-[var(--spacing-lg)]">
        {/* Left Column: Table */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h2 className="font-heading text-h2 text-on-surface">Verifikasi User</h2>
            <p className="text-body-md text-on-surface-variant mt-[var(--spacing-xs)]">Kelola dan verifikasi akun mahasiswa</p>
          </div>

          {/* Filters */}
          <div Klasse="bg-surface-container-lowest rounded-[var(--radius-xl)] p-6 shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama / NIM..."
                  className="w-full bg-surface border border-outline-variant rounded-[var(--radius-lg)] py-3 pl-11 pr-4 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant"
                />
              </div>
              <div className="flex gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-full text-label-md ${
                      statusFilter === filter
                        ? 'bg-primary-container/15 text-on-surface border border-primary-container'
                        : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-low transition-colors'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="py-4 px-6 text-label-md text-on-surface-variant">Nama Lengkap</th>
                    <th className="py-4 px-6 text-label-md text-on-surface-variant">NIM</th>
                    <th className="py-4 px-6 text-label-md text-on-surface-variant">Email</th>
                    <th className="py-4 px-6 text-label-md text-on-surface-variant">Status</th>
                    <th className="py-4 px-6 text-label-md text-on-surface-variant">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-body-md text-on-surface">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b border-surface-container-highest hover:bg-surface-container-low transition-colors ${
                        selectedUser?.id === user.id ? 'bg-surface-container-low/50' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className={`py-4 px-6 ${user.status === 'Pending' ? 'font-semibold' : ''}`}>{user.name}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{user.nim}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption ${statusColors[user.status]}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-primary text-label-md hover:underline flex items-center gap-1">
                          Lihat Detail <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-surface-container-low p-4 flex justify-between items-center border-t border-surface-container-highest">
              <p className="text-caption text-on-surface-variant">Menampilkan 1-{filteredUsers.length} dari 45 user</p>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-container text-on-primary-container">1</button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface">2</button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        {selectedUser && (
          <div className="w-[400px] flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_12px_32px_rgba(31,41,55,0.08)] sticky top-24 overflow-hidden border border-surface-container-highest">
              {/* Header */}
              <div className="bg-surface p-6 border-b border-surface-container-highest flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-h3 text-on-surface">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-caption font-bold uppercase tracking-wider ${statusColors[selectedUser.status]}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:bg-surface-container-low p-1 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Details Content */}
              <div className="p-6 flex flex-col gap-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Data Info */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold opacity-80">NIM</p>
                    <p className="text-body-md text-on-surface font-medium">{selectedUser.nim}</p>
                  </div>
                  <div>
                    <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold opacity-80">Fakultas</p>
                    <p className="text-body-md text-on-surface font-medium">{selectedUser.faculty}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold opacity-80">Email</p>
                    <p className="text-body-md text-on-surface font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-caption text-on-surface-variant uppercase tracking-wider font-semibold opacity-80">No. Telepon</p>
                    <p className="text-body-md text-on-surface font-medium">{selectedUser.phone}</p>
                  </div>
                </div>
                <hr className="border-surface-container-highest" />

                {/* Document Verification */}
                <div>
                  <h4 className="text-label-md text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">badge</span>
                    Identitas Dokumen (KTM/KTP)
                  </h4>
                  <div className="bg-surface-container-low rounded-[var(--radius-lg)] p-8 border border-dashed border-outline-variant flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[48px] opacity-40">badge</span>
                    <p className="text-label-md text-on-surface-variant opacity-60">Belum ada dokumen</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-surface p-6 border-t border-surface-container-highest flex gap-3">
                <button className="flex-1 bg-white border border-[#DC2626] text-[#DC2626] text-label-md py-3 rounded-[var(--radius-xl)] hover:bg-[#FEF2F2] transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">close</span> Tolak
                </button>
                <button className="flex-1 bg-[#059669] text-white text-label-md py-3 rounded-[var(--radius-xl)] hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span> Verifikasi
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}