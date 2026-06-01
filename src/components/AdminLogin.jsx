import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Loader2, ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://snt-server.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Invalid server response');
      }

      console.log('response.status:', res.status);
      console.log('response.data:', data);

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      localStorage.setItem('adminToken', data.token);
      onLoginSuccess();
    } catch (err) {
      console.error('[Admin Login Error]:', err);
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full glass-panel p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange-sm mb-2">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-outfit font-black text-2xl md:text-3xl text-white tracking-tight leading-none">
            Admin Access Portal
          </h2>
          <p className="text-slate-400 font-inter text-xs max-w-[280px] mx-auto leading-relaxed">
            Enter administrative credentials to log into the Shree Nathji Transport console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2.5 text-red-400 text-xs font-inter font-medium leading-relaxed"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label className="font-outfit text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <User className="w-3.5 h-3.5 mr-2 text-brand-orange" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter administrator username"
              disabled={loading}
              className="w-full bg-brand-navy/60 border border-white/10 focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 focus:outline-none text-sm transition-all focus:ring-1 focus:ring-brand-orange/30 placeholder-slate-600 font-inter"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="font-outfit text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-2 text-brand-orange" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full bg-brand-navy/60 border border-white/10 focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 focus:outline-none text-sm transition-all focus:ring-1 focus:ring-brand-orange/30 placeholder-slate-600 font-inter"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg border border-brand-orange/30 text-white font-outfit font-black tracking-wider uppercase py-3.5 rounded-lg flex items-center justify-center space-x-2 transition-all text-sm hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <span>Enter Dashboard</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
