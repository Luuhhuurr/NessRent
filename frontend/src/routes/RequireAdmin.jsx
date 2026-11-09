import { Navigate, Outlet } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { isAdmin } from '../lib/auth';

/**
 * Wraps a route group that requires an admin. Everyone else is sent back to
 * their dashboard instead of seeing a blank page.
 */
export default function RequireAdmin() {
  return (
    <RequireAuth>
      {isAdmin() ? <Outlet /> : <Navigate to="/dashboard" replace />}
    </RequireAuth>
  );
}
