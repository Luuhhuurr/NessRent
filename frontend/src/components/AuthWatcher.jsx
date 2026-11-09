import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UNAUTHORIZED_EVENT } from '../lib/api';

/**
 * The axios instance cannot navigate, so it announces an expired session as
 * a DOM event and this component performs the redirect inside the router.
 */
export default function AuthWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleUnauthorized = (event) => {
      const from = event.detail?.from || location.pathname;
      navigate('/login', { state: { from }, replace: true });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [navigate, location.pathname]);

  return null;
}
