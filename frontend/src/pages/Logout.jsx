import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../lib/auth';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearAuth();
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center">
      <span className="material-symbols-outlined text-[48px] text-on-surface-variant animate-spin">
        progress_activity
      </span>
      <p className="text-body-md text-on-surface-variant mt-4">Keluar dari akun...</p>
    </div>
  );
}
