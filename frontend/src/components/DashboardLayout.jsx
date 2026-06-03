import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  const user = { name: 'Martino Otniel' };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 p-[var(--spacing-md)] lg:p-[var(--spacing-lg)] overflow-y-auto bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}