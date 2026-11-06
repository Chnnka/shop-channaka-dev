import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '../../api/apiClient';
import { authApi, type AuthSession, type UserType } from '../../api/authApi';
import { readStoredSession } from './authStorage';

export interface AuthUser {
  email: string;
  userType: UserType;
}

/**
 * restoring:     a refresh token was found on load and is being exchanged for a session
 * authenticated: signed in, with an access token
 * anonymous:     signed out
 */
export type AuthStatus = 'restoring' | 'authenticated' | 'anonymous';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  /** When the access token expires, in ms since epoch (from the server's expiresIn) */
  accessTokenExpiresAt: number | null;
  refreshToken: string | null;
  /** True after the session ended on its own (refresh token expired or revoked) */
  sessionExpired: boolean;
}

interface AuthFailure {
  message: string;
  /** The server rejected the refresh token, so the session is over (not just a network error) */
  sessionInvalid: boolean;
}

const storedSession = readStoredSession();

const initialState: AuthState = {
  status: storedSession ? 'restoring' : 'anonymous',
  user: storedSession?.user ?? null,
  accessToken: null,
  accessTokenExpiresAt: null,
  refreshToken: storedSession?.refreshToken ?? null,
  sessionExpired: false
};

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.';

export const login = createAsyncThunk<
  AuthSession,
  { email: string; password: string; requiredUserType?: UserType },
  { rejectValue: string }
>('auth/login', async ({ email, password, requiredUserType }, { rejectWithValue }) => {
  try {
    const session = await authApi.login(email, password);
    if (requiredUserType && session.userType !== requiredUserType) {
      // Signed in, but not allowed here: end the session again straight away
      await authApi.logout(session.refreshToken).catch(() => undefined);
      return rejectWithValue('This account doesn’t have access to the studio admin.');
    }
    return session;
  } catch (error) {
    return rejectWithValue(messageOf(error));
  }
});

type ThunkState = { auth: AuthState };

/** Exchanges the refresh token for a new access token and refresh token */
export const refreshSession = createAsyncThunk<
  AuthSession,
  void,
  { state: ThunkState; rejectValue: AuthFailure }
>('auth/refreshSession', async (_, { getState, rejectWithValue }) => {
  const { refreshToken } = getState().auth;
  if (!refreshToken) return rejectWithValue({ message: 'Not signed in.', sessionInvalid: true });
  try {
    return await authApi.refresh(refreshToken);
  } catch (error) {
    const sessionInvalid = error instanceof ApiError && error.status >= 400 && error.status < 500;
    return rejectWithValue({ message: messageOf(error), sessionInvalid });
  }
});

/** Signs out locally right away, then tells the server to end the session */
export const logout = createAsyncThunk<void, void, { state: ThunkState }>(
  'auth/logout',
  async (_, { getState, dispatch }) => {
    const { refreshToken } = getState().auth;
    dispatch(authSlice.actions.sessionCleared({ expired: false }));
    if (refreshToken) await authApi.logout(refreshToken).catch(() => undefined);
  }
);

const applySession = (state: AuthState, session: AuthSession) => {
  state.status = 'authenticated';
  state.user = { email: session.email, userType: session.userType };
  state.accessToken = session.token;
  state.accessTokenExpiresAt = Date.now() + session.expiresIn * 1000;
  state.refreshToken = session.refreshToken;
  state.sessionExpired = false;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionCleared(state, action: PayloadAction<{ expired: boolean }>) {
      state.status = 'anonymous';
      state.user = null;
      state.accessToken = null;
      state.accessTokenExpiresAt = null;
      state.refreshToken = null;
      state.sessionExpired = action.payload.expired;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.sessionExpired = false;
      })
      .addCase(login.fulfilled, (state, action) => applySession(state, action.payload))
      .addCase(refreshSession.fulfilled, (state, action) => applySession(state, action.payload))
      .addCase(refreshSession.rejected, (state, action) => {
        if (action.payload?.sessionInvalid) {
          authSlice.caseReducers.sessionCleared(state, {
            type: 'auth/sessionCleared',
            payload: { expired: state.status === 'authenticated' }
          });
        } else if (state.status === 'restoring') {
          // Server unreachable on load: keep the refresh token so a reload can try again
          state.status = 'anonymous';
        }
      });
  }
});

export const { sessionCleared } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthStatus = (state: ThunkState) => state.auth.status;
export const selectAuthUser = (state: ThunkState) => state.auth.user;
export const selectIsAdmin = (state: ThunkState) =>
  state.auth.status === 'authenticated' && state.auth.user?.userType === 'admin';
export const selectSessionExpired = (state: ThunkState) => state.auth.sessionExpired;
