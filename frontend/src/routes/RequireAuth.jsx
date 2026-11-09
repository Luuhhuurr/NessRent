import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn, getUser } from '../lib/auth';

/**
 * Wraps a route group that requires a signed-in user. The attempted path is
 * passed along so the login page can send the user back where they were.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (getUser()?.status === 'blacklist') {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, reason: 'blacklist' }}
        replace
      />
    );
  }

  return children ?? <Outlet />;
}
