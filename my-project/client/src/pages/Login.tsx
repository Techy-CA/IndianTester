import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      if (res.data.role === 'admin' || res.data.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0fdf4] flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="white" />
            <rect x="9" y="1" width="6" height="6" rx="1" fill="white" fillOpacity="0.6" />
            <rect x="1" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.6" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.3" />
          </svg>
        </div>
        <span className="font-bold text-black text-sm tracking-tight">IndianTester</span>
      </div>

      {/* Green Card */}
      <div className="w-full max-w-[400px] rounded-3xl border-2 border-black bg-[#86efac] p-7 space-y-5"
        style={{ boxShadow: '4px 4px 0px 0px #000000' }}>

        {/* Avatar + Title */}
        <div className="flex flex-col items-center space-y-3 pb-2">
          <div className="w-16 h-16 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-2xl">
            🛒
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-black tracking-tight">Welcome Back</h1>
            <p className="text-xs text-black/50 mt-0.5">Login to your buyer account</p>
          </div>
        </div>

        <div className="border-t-2 border-black/10" />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-red-400 bg-red-50 text-red-600 text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M7 4.5V7.5M7 9.5V10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-black uppercase tracking-widest">Email</label>
          <input
            type="email" value={email}
            placeholder="you@example.com"
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-2xl border-2 border-black text-sm text-gray-800 placeholder:text-gray-300 outline-none bg-white transition-all"
            style={{ boxShadow: '2px 2px 0px 0px #000000' }}
            onFocus={e => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
            onBlur={e => e.target.style.boxShadow = '2px 2px 0px 0px #000000'}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-black uppercase tracking-widest">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} value={password}
              placeholder="••••••••••"
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-black text-sm text-gray-800 placeholder:text-gray-300 outline-none bg-white transition-all"
              style={{ boxShadow: '2px 2px 0px 0px #000000' }}
              onFocus={e => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
              onBlur={e => e.target.style.boxShadow = '2px 2px 0px 0px #000000'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
              {showPassword ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} disabled={loading}
          className="w-full py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 border-2 border-black"
          style={{
            backgroundColor: loading ? '#e5e7eb' : '#000000',
            color: loading ? '#9ca3af' : 'white',
            boxShadow: loading ? 'none' : '3px 3px 0px 0px #166534',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px #166534'; }}}
          onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #166534'; }}}>
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Logging in...
            </>
          ) : 'Login →'}
        </button>

        {/* Create Account */}
        <p className="text-center text-xs text-black/50">
          No account?{' '}
          <Link to="/register"
            className="text-black font-bold underline underline-offset-2 hover:text-green-900 transition-colors">
            Create account
          </Link>
        </p>
      </div>

      {/* Admin link — bahar card ke neeche, subtle */}
      <div className="mt-5 flex items-center gap-2">
        <div className="h-px w-12 bg-black/10" />
        <Link to="/admin/login"
          className="text-[11px] text-black/30 hover:text-black/60 transition-colors px-3 py-1.5 rounded-full border border-black/10 hover:border-black/30">
          ⚙️ Admin / SuperAdmin Login
        </Link>
        <div className="h-px w-12 bg-black/10" />
      </div>

      <p className="text-[11px] text-black/25 mt-4">© 2026 IndianTester</p>
    </div>
  );
}
