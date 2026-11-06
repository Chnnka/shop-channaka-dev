import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { selectAuthStatus, selectIsAdmin } from '../../store/auth/authSlice';

/**
 * Keeps signed-out visitors away from the admin pages. This only controls what the browser
 * shows; the backend checks the admin token on every /api/admin request.
 */
export function RequireAdmin({ children }: {children: React.ReactNode;}) {
  const status = useAppSelector(selectAuthStatus);
  const isAdmin = useAppSelector(selectIsAdmin);
  const location = useLocation();

  if (status === 'restoring') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f2eb]" role="status">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Checking your session…</span>
      </div>);

  }
  if (!isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
