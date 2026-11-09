import { useCallback, useEffect, useState } from 'react';
import userService from '../services/userService';
import { formatDate, userStatusLabel, userStatusTone } from '../lib/format';

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'verified', label: 'Terverifikasi' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'blacklist', label: 'Diblokir' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [blacklistTarget, setBlacklistTarget] = useState(null);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const fetchUsers = useCallback(async () => {
    const params = { page, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    if (searchTerm) params.search = searchTerm;

    const response = await userService.getUsers(params);
    return {
      users: response?.data?.users ?? [],
      totalPages: response?.data?.pagination?.totalPages ?? 1,
    };
  }, [page, statusFilter, searchTerm]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchUsers();
        setUsers(result.users);
        setTotalPages(result.totalPages);
      } catch (err) {
        setUsers([]);
        setError(err?.response?.data?.message || 'Gagal memuat daftar pengguna.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchUsers, reloadKey]);

  const runAction = async (userId, action, successMessage) => {
    setBusyId(userId);
    setError(null);
    setNotice(null);
    try {
      await action();
      setReloadKey((key) => key + 1);
      setNotice(successMessage);
    } catch (err) {
      setError(err?.response?.data?.message || 'Aksi gagal dijalankan.');
    } finally {
      setBusyId(null);
    }
  };

  const handleVerify = (user) =>
    runAction(
      user.id,
      () => userService.verifyUser(user.id),
      `${user.name} berhasil diverifikasi.`
    );

  const handleReject = (user) =>
    runAction(
      user.id,
      () => userService.rejectUser(user.id),
      `${user.name} berhasil ditolak.`
    );

  const handleBlacklist = (event) => {
    event.preventDefault();
    const user = blacklistTarget;
    if (!user) return;

    runAction(
      user.id,
      () => userService.blacklistUser(user.id, blacklistReason.trim()),
      `${user.name} berhasil diblokir.`
    ).then(() => {
      setBlacklistTarget(null);
      setBlacklistReason('');
    });
  };

  const handleUnblacklist = (user) =>
    runAction(
      user.id,
      () => userService.removeFromBlacklist(user.id),
      `${user.name} berhasil dikeluarkan dari daftar blokir.`
    );

  return (
    <>
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Manajemen pengguna</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Verifikasi, tolak, atau blokir akun mahasiswa.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] md:items-center justify-between mb-[var(--spacing-md)]">
        <form
          className="flex gap-2 w-full md:w-96"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(searchInput.trim());
            setPage(1);
          }}
        >
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama, NIM, atau email..."
              aria-label="Cari pengguna"
              className="w-full pl-10 pr-3 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary text-on-primary text-label-md rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors shrink-0"
          >
            Cari
          </button>
        </form>

        <div className="flex gap-[var(--spacing-xs)] overflow-x-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value || 'all'}
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-label-md transition-colors ${
                statusFilter === filter.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="rounded-[var(--radius-md)] bg-success-container/40 border border-success/25 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
          <p className="text-body-sm text-on-success-container">{notice}</p>
        </div>
      )}

      {error && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      {loading && (
        <div className="panel p-[var(--spacing-lg)] text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="text-body-sm text-on-surface-variant mt-2">Memuat data...</p>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="panel p-[var(--spacing-xl)] text-center">
          <span className="material-symbols-outlined text-[56px] text-on-surface-variant mb-4">group</span>
          <h3 className="font-heading text-h3 text-on-surface mb-2">Tidak ada pengguna</h3>
          <p className="text-body-md text-on-surface-variant">
            {searchTerm || statusFilter
              ? 'Tidak ada pengguna yang sesuai dengan filter Anda.'
              : 'Belum ada pengguna terdaftar.'}
          </p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Pengguna</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">NIM</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Fakultas</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Bergabung</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Status</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-outline-variant/40 hover:bg-surface-container transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold text-caption shrink-0">
                          {String(user.name || '?').charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-body-sm text-on-surface truncate">{user.name}</p>
                          <p className="text-caption text-on-surface-variant truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-on-surface-variant">{user.nim || '-'}</td>
                    <td className="py-3 px-4 text-body-sm text-on-surface-variant">{user.faculty || '-'}</td>
                    <td className="py-3 px-4 text-body-sm text-on-surface-variant">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-caption ${userStatusTone(user.status)}`}
                      >
                        {userStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={busyId === user.id}
                              onClick={() => handleVerify(user)}
                              aria-label={`Verifikasi ${user.name}`}
                              className="p-1.5 rounded-[var(--radius-md)] text-success hover:bg-success-container transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            </button>
                            <button
                              type="button"
                              disabled={busyId === user.id}
                              onClick={() => handleReject(user)}
                              aria-label={`Tolak ${user.name}`}
                              className="p-1.5 rounded-[var(--radius-md)] text-warning hover:bg-warning-container transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </button>
                          </>
                        )}

                        {user.status === 'blacklist' ? (
                          <button
                            type="button"
                            disabled={busyId === user.id}
                            onClick={() => handleUnblacklist(user)}
                            className="px-2.5 py-1 rounded-[var(--radius-md)] border border-outline text-on-surface-variant text-caption hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                          >
                            Cabut blokir
                          </button>
                        ) : (
                          user.role !== 'admin' && (
                            <button
                              type="button"
                              disabled={busyId === user.id}
                              onClick={() => setBlacklistTarget(user)}
                              aria-label={`Blokir ${user.name}`}
                              className="p-1.5 rounded-[var(--radius-md)] text-error hover:bg-error-container transition-colors disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[18px]">block</span>
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-outline-variant flex items-center justify-between">
              <span className="text-caption text-on-surface-variant">Halaman {page} dari {totalPages}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Halaman sebelumnya"
                  className="w-8 h-8 rounded-[var(--radius-md)] border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Halaman berikutnya"
                  className="w-8 h-8 rounded-[var(--radius-md)] border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {blacklistTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-[var(--spacing-md)]">
          <form
            onSubmit={handleBlacklist}
            className="panel p-[var(--spacing-lg)] w-full max-w-md flex flex-col gap-[var(--spacing-md)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-h3 text-on-surface">Blokir pengguna</h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  {blacklistTarget.name} tidak akan bisa masuk atau menyewa barang.
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setBlacklistTarget(null)}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface-variant" htmlFor="blacklist-reason">
                Alasan pemblokiran
              </label>
              <textarea
                id="blacklist-reason"
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
                rows={3}
                placeholder="Contoh: Aktivitas melanggar ketentuan platform."
                className="w-full bg-surface-container border border-outline-variant rounded-[var(--radius-md)] p-3 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end gap-[var(--spacing-sm)]">
              <button
                type="button"
                onClick={() => setBlacklistTarget(null)}
                className="px-4 py-2 rounded-[var(--radius-md)] border border-outline text-on-surface text-label-md hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={busyId === blacklistTarget.id}
                className="px-4 py-2 rounded-[var(--radius-md)] bg-error text-on-error text-label-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Blokir
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
