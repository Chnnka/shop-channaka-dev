import { post } from './apiClient';

export type UserType = 'admin' | 'user';

/** Returned by login and refresh-token */
export interface AuthSession {
  /** Access token, sent as `Authorization: Bearer <token>` */
  token: string;
  /** Exchanged for a new session when the access token expires. Each one works once. */
  refreshToken: string;
  email: string;
  userType: UserType;
  /** Seconds until the access token expires */
  expiresIn: number;
  /** Seconds until the refresh token expires */
  refreshTokenExpiresIn: number;
}

// skipAuth: these calls manage the tokens themselves, so a 401 here must not trigger a refresh
export const authApi = {
  login: (email: string, password: string) =>
    post<AuthSession>({ path: '/api/auth/login', reqBody: { email, password }, skipAuth: true }),

  refresh: (refreshToken: string) =>
    post<AuthSession>({ path: '/api/auth/refresh-token', reqBody: { refreshToken }, skipAuth: true }),

  logout: (refreshToken: string) =>
    post<null>({ path: '/api/auth/logout', reqBody: { refreshToken }, skipAuth: true })
};
