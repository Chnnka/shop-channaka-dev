import type { UserType } from '../../api/authApi';

/**
 * Keeps the refresh token and user across page reloads. sessionStorage is cleared when the
 * tab closes. The access token is never stored; a new one is fetched on load.
 * TODO: move the refresh token to an httpOnly cookie set by the backend so scripts can't read it.
 */
const STORAGE_KEY = 'kala-studio-auth';
const LEGACY_PROTOTYPE_KEY = 'kala-studio-admin-session';

export interface StoredSession {
  refreshToken: string;
  user: { email: string; userType: UserType };
}

export function readStoredSession(): StoredSession | null {
  try {
    window.sessionStorage.removeItem(LEGACY_PROTOTYPE_KEY);
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    return session?.refreshToken && session.user?.email ? session : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: StoredSession | null) {
  try {
    if (session) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the session then lasts until reload
  }
}
