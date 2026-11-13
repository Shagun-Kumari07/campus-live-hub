'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) return setError(signUpError.message);

      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          name,
          roll_no: rollNo.toUpperCase(),
          role: 'student',
        });
        if (profileError) return setError(profileError.message);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) return setError(signInError.message);
    }

    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <form onSubmit={handleAuth} className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-bold text-emerald-400">
          {isSignUp ? 'Student Registration' : 'Campus Live Hub Login'}
        </h1>

        {error && <p className="rounded bg-red-500/10 p-2 text-sm text-red-400">{error}</p>}

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
            />
            <input
              type="text"
              placeholder="Roll Number (e.g., 25B81A0501)"
              required
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm uppercase"
            />
          </>
        )}

        <input
          type="email"
          placeholder="College Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
        />

        <button type="submit" className="w-full rounded-lg bg-emerald-600 py-3 font-semibold hover:bg-emerald-500">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-slate-400 hover:text-emerald-400"
        >
          {isSignUp ? 'Already registered? Sign In' : 'New student? Create an account'}
        </button>
      </form>
    </div>
  );
}