import { Link } from 'react-router-dom';

// Mock data for admin dashboard
const stats = [
  { label: 'Total Barang', value: '120', icon: 'inventory_2', change: '+5% this week', color: 'primary-container' },
  { label: 'Total Transaksi', value: '450', icon: 'receipt_long', change: '+12% this week', color: 'secondary-container' },
  { label: 'Transaksi Pending', value: '12', icon: 'pending_actions', change: '', color: 'error-container', pulse: true },
  { label: 'Total Pendapatan', value: 'Rp 15.000.000', icon: 'payments', change: '', color: 'primary' },
];

const categoryData = [
  { name: 'Elektronik', percentage: 45 },
  { name: 'Kendaraan', percentage: 30 },
  { name: 'Alat Camping', percentage: 15 },
  { name: 'Lainnya', percentage: 10 },
];

const recentTransactions = [
  { id: 1, name: 'Martino Otniel', item: 'Vario 150 eSP', date: '15 Nov 2024', status: 'Pending', avatar: 'B' },
  { id: 2, name: 'Anita Wijaya', item: 'Kamera Sony A7III', date: '20 Nov 2024', status: 'Approved', avatar: 'A' },
  { id: 3, name: 'Dimas Pratama', item: 'Tenda Dome 4P', date: '25 Nov 2024', status: 'Success', avatar: 'D' },
];

const statusColors = {
  Pending: 'bg-surface-container-high text-on-surface',
  Approved: 'bg-primary-container/20 text-on-primary-container',
  Success: 'bg-secondary-container/50 text-secondary',
};

export default function AdminDashboard() {
  return (
    <>
      {/* TopAppBar */}
      <header className="sticky top-0 w-full h-16 bg-surface/80 backdrop-blur-md flex items-center justify-between px-[var(--spacing-md)] z-40">
        <h2 className="font-heading text-h3 text-on-surface">Dashboard Admin</h2>
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <button className="text-secondary hover:bg-surface-container-high rounded-full p-2 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <div className="h-8 w-px bg-outline-variant/50" />
          <button className="flex items-center gap-2 hover:bg-surface-container-high p-1 pr-3 rounded-full transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-label-md hidden sm:block">Admin Profile</span>
            <span className="material-symbols-outlined text-secondary text-sm">expand_more</span>
          </button>
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1 p-[var(--spacing-md)] pb-[var(--spacing-xl)] overflow-x-hidden">
        {/* Quick Actions */}
        <div className="flex justify-end gap-3 mb-[var(--spacing-md)]">
          <Link
            to="/admin/add-product"
            className="bg-primary-container text-on-primary-fixed px-6 py-3 rounded-[var(--radius-xl)] text-label-md hover:bg-primary-fixed-dim transition-colors flex items-center gap-2 shadow-[0_4px_20px_rgba(31,41,55,0.04)]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Tambah Barang
          </Link>
          <Link
            to="/admin/verify-user"
            className="bg-surface-container-lowest border border-outline-variant text-on-surface px-6 py-3 rounded-[var(--radius-xl)] text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-[0_4px_20px_rgba(31,41,55,0.04)]"
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Verifikasi User
          </Link>
        </div>

        {/* Bento Grid Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] hover:shadow-[0_8px_24px_rgba(31,41,55,0.1)] hover:-translate-y-0.5 transition-all relative overflow-hidden ${
                stat.color === 'primary' ? 'bg-primary text-on-primary' : ''
              } ${stat.color === 'error-container' ? 'border border-primary-container/30' : ''}`}
            >
              {stat.color !== 'primary' && (
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-xl" />
              )}
              <div className="flex justify-between items-start mb-[var(--spacing-sm)] relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  stat.color === 'primary-container' ? 'bg-primary-container/20 text-primary' :
                  stat.color === 'secondary-container' ? 'bg-secondary-container/50 text-primary' :
                  stat.color === 'error-container' ? 'bg-error-container/50 text-error' :
                  'bg-surface-container-lowest/20 text-primary-container'
                }`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {stat.icon}
                  </span>
                </div>
                {stat.change && (
                  <span className="px-2 py-1 bg-surface-container-high rounded-full text-caption text-secondary">
                    {stat.change}
                  </span>
                )}
                {stat.pulse && <span className="w-3 h-3 bg-error rounded-full animate-pulse" />}
              </div>
              <p className={`text-label-md mb-1 ${stat.color === 'primary' ? 'text-primary-container' : 'text-secondary'}`}>
                {stat.label}
              </p>
              <h3 className="font-heading text-h2 text-on-surface relative z-10">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Content Grid: Chart & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-md)]">
          {/* Chart Section */}
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] lg:col-span-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-h3 text-on-surface">Kategori Populer</h3>
              <button className="text-secondary hover:bg-surface-container-high rounded-full p-1 transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              {categoryData.map((cat, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-label-md text-on-surface">{cat.name}</span>
                    <span className="text-label-md text-primary">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] lg:col-span-2 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-h3 text-on-surface">Recent Transactions</h3>
              <Link to="/admin/transactions" className="text-label-md text-primary hover:text-primary-fixed-dim transition-colors">
                Lihat Semua
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-secondary text-label-md">
                    <th className="pb-3 font-medium pl-2">User Name</th>
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface text-body-md">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                            {tx.avatar}
                          </div>
                          <span className="font-medium">{tx.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-secondary">{tx.item}</td>
                      <td className="py-4 text-secondary">{tx.date}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-caption ${statusColors[tx.status]}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="Detail">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                          {tx.status === 'Pending' && (
                            <>
                              <button className="p-1.5 text-primary hover:bg-primary-container rounded-lg transition-colors" title="Approve">
                                <span className="material-symbols-outlined text-sm">check</span>
                              </button>
                              <button className="p-1.5 text-error hover:bg-error-container rounded-lg transition-colors" title="Reject">
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}