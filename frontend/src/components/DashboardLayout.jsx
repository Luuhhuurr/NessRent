import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { getUser } from '../lib/auth';

export default function DashboardLayout() {
  const user = getUser();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 p-[var(--spacing-md)] lg:p-[var(--spacing-lg)] bg-background">
          <div className="max-w-[1280px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
