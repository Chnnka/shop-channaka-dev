import { configureStore } from '@reduxjs/toolkit';
import { registerAuthHandlers } from '../api/apiClient';
import authReducer, { refreshSession } from './auth/authSlice';
import { writeStoredSession } from './auth/authStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Save the refresh token and user whenever they change, so a reload stays signed in
let previousAuth = store.getState().auth;
store.subscribe(() => {
  const { auth } = store.getState();
  if (auth.refreshToken === previousAuth.refreshToken && auth.user === previousAuth.user) return;
  previousAuth = auth;
  writeStoredSession(
    auth.refreshToken && auth.user ? { refreshToken: auth.refreshToken, user: auth.user } : null
  );
});

// Only one refresh at a time: the backend ends the session if a refresh token is used twice
let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken() {
  refreshInFlight ??= store
    .dispatch(refreshSession())
    .unwrap()
    .then((session) => session.token)
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

// Refresh this long before the access token expires, so requests never leave with a stale one
const EXPIRY_MARGIN_MS = 60_000;

registerAuthHandlers({
  getAccessToken: () => store.getState().auth.accessToken,
  isAccessTokenExpiring: () => {
    const expiresAt = store.getState().auth.accessTokenExpiresAt;
    return expiresAt !== null && Date.now() >= expiresAt - EXPIRY_MARGIN_MS;
  },
  refreshAccessToken
});

// A refresh token from the previous visit: exchange it for a fresh session
if (store.getState().auth.status === 'restoring') {
  void refreshAccessToken();
}
