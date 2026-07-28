import React, { useState } from 'react';
import { NovaTunesLogo } from '../components/Icons';

function getPasswordStrength(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export function AuthScreen({ onAuth, onBack, emailExists, storeUser, findUser }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('demo@novatunes.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const strength = getPasswordStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', '#f87171', '#fb923c', '#facc15', '#60A5FA', '#3B82F6'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!username.trim() || !email.trim() || !password) {
        return setError('All fields are required');
      }
      if (password.length < 6) {
        return setError('Password must be at least 6 characters');
      }
      if (emailExists(email)) {
        return setError('An account with this email already exists');
      }
      const user = { username: username.trim(), email: email.trim(), password };
      storeUser(user);
      onAuth(user);
    } else {
      if (!email.trim() || !password) {
        return setError('Email and password are required');
      }
      const user = findUser(email, password);
      if (!user) {
        return setError('Invalid email or password');
      }
      onAuth(user);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050816] text-white p-4 select-none">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute top-[10%] right-[20%] h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="animate-float absolute bottom-[10%] left-[20%] h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="animate-slide-up w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl relative z-10 text-left">
        <button onClick={onBack} className="absolute left-6 top-6 text-slate-400 hover:text-white transition text-xs font-semibold">
          ← Back
        </button>

        <div className="text-center mt-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 p-0.5 shadow-md shadow-blue-500/10 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <NovaTunesLogo className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white capitalize">
            {mode === 'login' ? 'Welcome Back' : 'Join NovaTunes'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            {mode === 'login' ? 'Enter credentials to access catalog' : 'Create an account to start streaming'}
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-600/10 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <span>🔑</span> Demo Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setEmail('demo@novatunes.com');
                setPassword('password123');
                setError('');
              }}
              className="rounded-xl bg-blue-600/20 px-3 py-1 text-[11px] font-semibold text-blue-300 hover:bg-blue-600/30 transition border border-blue-500/30"
            >
              Fill Demo ID
            </button>
          </div>
          <div className="mt-2.5 space-y-1 font-mono text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-white">demo@novatunes.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Password:</span>
              <span className="font-semibold text-white">password123</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-3 text-center text-xs text-slate-300 font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-slate-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="MusicLover"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none transition focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-slate-400">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-slate-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-xs text-white outline-none transition focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {mode === 'signup' && password.length > 0 && (
              <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(strength / 5) * 100}%`, backgroundColor: strengthColors[strength] }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Strength: <span style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3.5 text-xs font-bold text-white shadow-md transition"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
