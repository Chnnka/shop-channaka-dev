import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoaderCircle, Lock } from 'lucide-react';
import { z } from 'zod';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { describedBy, FormField } from '../../components/common/FormField';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { site } from '../../data/site';
import { usePageMeta } from '../../hooks/usePageMeta';
import { login, selectIsAdmin, selectSessionExpired } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password')
});

export function AdminLogin() {
  usePageMeta({ title: 'Studio login' });
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAdmin);
  const sessionExpired = useAppSelector(selectSessionExpired);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as {from?: string;} | null)?.from ?? '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string;password?: string;}>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const next: {email?: string;password?: string;} = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as 'email' | 'password';
        next[k] = next[k] ?? i.message;
      });
      setErrors(next);
      return;
    }
    setLoading(true);
    try {
      await dispatch(login({ email, password, requiredUserType: 'admin' })).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      // unwrap() throws the thunk's rejectWithValue message
      setFormError(typeof err === 'string' ? err : 'Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main" className="flex min-h-screen w-full items-center justify-center bg-[#f6f2eb] px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="font-serif text-3xl">
            {site.name}
          </Link>
          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Studio admin</p>
        </div>
        <div className="rounded-sm border border-border bg-card p-8">
          <h1 className="font-serif text-3xl font-normal">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage artworks, orders and collections.</p>
          <form onSubmit={submit} noValidate className="mt-6 space-y-5">
            {formError && <ErrorMessage title="Couldn’t sign in" message={formError} />}
            {!formError && sessionExpired &&
            <ErrorMessage title="Session ended" message="Your session has expired. Please sign in again." />
            }
            <FormField id="admin-email" label="Email" error={errors.email}>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((x) => ({ ...x, email: undefined }));
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('admin-email', errors.email)}
                className="h-11 rounded-sm" />
              
            </FormField>
            <FormField id="admin-password" label="Password" error={errors.password}>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((x) => ({ ...x, password: undefined }));
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={describedBy('admin-password', errors.password)}
                className="h-11 rounded-sm" />
              
            </FormField>
            <Button type="submit" disabled={loading} className="h-11 w-full rounded-sm">
              {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </main>);

}