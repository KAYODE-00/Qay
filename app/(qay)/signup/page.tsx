'use client';

import { FormEvent, useState } from 'react';
import { QayLogo } from '@/qay/components/QayLogo';
import { createClient } from '@/lib/supabase-browser';

type Role = 'developer' | 'client';

const roles: Array<{ value: Role; title: string; body: string; mark: string }> = [
  { value: 'developer', title: 'Developer', body: 'I build websites for clients', mark: 'DX' },
  { value: 'client', title: 'Client', body: 'My developer invited me', mark: 'CL' },
];

export default function SignupPage() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<Role>('developer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const supabase = await createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.user) {
        setError('Unable to create your account.');
        return;
      }

      const { error: profileError } = await supabase.from('qay_user_profiles').insert({
        id: data.user.id,
        account_type: role,
        full_name: fullName,
      });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      window.location.assign(role === 'client' ? '/client' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <QayLogo />
        </div>

        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30">
          <h1 className="text-center text-2xl font-semibold tracking-normal">Create your account</h1>

          {step === 'role' ? (
            <div className="mt-8 space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((item) => {
                  const selected = role === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected ? 'border-white bg-white/5' : 'border-white/10 bg-black hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="mb-4 flex size-9 items-center justify-center rounded-full border border-white/20 text-xs text-white/80">
                        {item.mark}
                      </span>
                      <span className="block text-base font-medium">{item.title}</span>
                      <span className="mt-1 block text-sm leading-5 text-white/60">{item.body}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="h-11 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block space-y-2 text-sm text-white/75">
                <span>Full name</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/75">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/75">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/75">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none transition focus:border-white"
                />
              </label>

              {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

              <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr]">
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="h-11 rounded-md border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{' '}
            <a href="/login" className="text-white hover:text-white/80">
              Sign in
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
