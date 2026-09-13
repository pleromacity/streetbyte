import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Flame, ShoppingBag, ArrowRight, User, Lock, Store } from 'lucide-react';

function AuthCard({ role, icon: Icon, title, subtitle, accentClass, borderClass, bgClass }) {
  const { login } = useOrders();
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }
    setError('');
    login(role, name.trim());
  };

  return (
    <div className={`flex-1 bg-street-card border-2 ${borderClass} rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl transition-all duration-300`}>
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex bg-street-surface rounded-xl p-1 border border-street-border">
        {['login', 'signup'].map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === t ? `${bgClass} text-white shadow-md` : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={role === 'buyer' ? 'Your name' : 'Business / stall name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-street-surface border border-street-border rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-street-surface border border-street-border rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
        {error && <p className="text-xs text-red-400 font-semibold px-1">{error}</p>}
        <button
          type="submit"
          className={`w-full ${bgClass} text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg text-sm tracking-wide`}
        >
          <span>{tab === 'login' ? 'Log In' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-[11px] text-slate-600">
        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
          className={`${accentClass} font-bold hover:underline`}
        >
          {tab === 'login' ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-street-charcoal flex flex-col selection:bg-street-orange selection:text-white">
      <header className="flex items-center gap-2.5 px-6 py-4 border-b border-street-border/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-street-orange to-street-amber flex items-center justify-center shadow-lg shadow-street-orange/20">
          <Flame className="w-5 h-5 text-white animate-pulse" />
        </div>
        <span className="font-extrabold text-lg text-white tracking-tight">StreetByte</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-3xl w-full mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-street-orange/15 border border-street-orange/30 text-street-orange text-xs font-bold mb-5">
            <Flame className="w-3.5 h-3.5" />
            <span>Live Street Food Ordering Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Order Smarter.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-street-orange to-street-amber">
              Cook Faster.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Real-time street food ordering — buyers browse and order, vendors manage their kitchen live. Choose your role to get started.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl">
          <AuthCard
            role="buyer"
            icon={ShoppingBag}
            title="I'm a Buyer"
            subtitle="Browse menus, order and track your meal"
            accentClass="text-street-orange"
            borderClass="border-street-orange/40 hover:border-street-orange/70"
            bgClass="bg-street-orange"
          />
          <AuthCard
            role="vendor"
            icon={Store}
            title="I'm a Vendor"
            subtitle="Manage your kitchen, orders and stock"
            accentClass="text-street-amber"
            borderClass="border-street-amber/40 hover:border-street-amber/70"
            bgClass="bg-street-amber"
          />
        </div>
      </div>

      <footer className="border-t border-street-border/50 py-4 px-6 text-center text-xs text-slate-600">
        © 2026 Wanaemi Watson. All rights reserved.
      </footer>
    </div>
  );
}
