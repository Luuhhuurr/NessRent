import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}