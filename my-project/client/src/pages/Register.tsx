import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function BuyerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim() || !form.password.trim()) {
      setError('All fields are required.'); return;
    }
    if (!/^\d{10}$/.test(form.whatsapp)) {
      setError('Enter a valid 10-digit WhatsApp number.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true); setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...form, role: 'buyer' });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Chinmay Sugandhi', icon: <IconUser />, hint: 'Cannot be changed later' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com', icon: <IconMail />, hint: '' },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '8109838096', icon: <IconPhone />, hint: '10 digits, no country code' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0fdf4] flex flex-col">

      {/* Navbar */}
      <nav className="w-full bg-white border-b-2 border-black px-4 py-3 flex items-center sticky top-0 z-50"
        style={{ boxShadow: '0 2px 0px 0px #000000' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
              <rect x="9" y="1" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="1" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.3"/>
            </svg>
          </div>
          <span className="font-bold text-black text-sm tracking-tight">IndianTester</span>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-4">

          {/* Header */}
          <div className="rounded-2xl border-2 border-black bg-[#86efac] p-5"
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}>
            <h1 className="text-xl font-black text-black">Create Account</h1>
            <p className="text-xs text-black/50 mt-1">Join IndianTester as a Buyer</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-red-400 bg-white text-red-600 text-sm font-semibold"
              style={{ boxShadow: '2px 2px 0px 0px #ef4444' }}>
              <span className="shrink-0">✕</span> {error}
            </div>
          )}

          {/* Fields Card */}
          <form onSubmit={handleSubmit}
            className="rounded-2xl border-2 border-black bg-white p-5 space-y-4"
            style={{ boxShadow: '4px 4px 0px 0px #000000' }}>

            <p className="text-[10px] font-black text-black/25 uppercase tracking-widest">Account Info</p>

            {fields.map(({ key, label, type, placeholder, icon, hint }) => (
              <div key={key} className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] font-black text-black/50 uppercase tracking-widest">
                  {icon} {label}
                  {key === 'name' && (
                    <span className="ml-auto text-[9px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full normal-case tracking-normal">
                      Permanent
                    </span>
                  )}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={update(key)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border-2 border-black/15 text-sm font-semibold text-gray-800 placeholder:text-gray-300 outline-none bg-white transition-all"
                  style={{ boxShadow: '1px 1px 0px 0px #00000010' }}
                  onFocus={e => { e.target.style.borderColor = '#000'; e.target.style.boxShadow = '2px 2px 0px 0px #000000'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.15)'; e.target.style.boxShadow = '1px 1px 0px 0px #00000010'; }}
                />
                {hint && <p className="text-[10px] text-black/30 pl-1">{hint}</p>}
              </div>
            ))}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-black/50 uppercase tracking-widest">
                <IconLock /> Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-black/15 text-sm font-semibold text-gray-800 placeholder:text-gray-300 outline-none bg-white transition-all"
                  style={{ boxShadow: '1px 1px 0px 0px #00000010' }}
                  onFocus={e => { e.target.style.borderColor = '#000'; e.target.style.boxShadow = '2px 2px 0px 0px #000000'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.15)'; e.target.style.boxShadow = '1px 1px 0px 0px #00000010'; }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors p-1">
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black border-2 border-black transition-all mt-2"
              style={{
                backgroundColor: loading ? '#e5e7eb' : '#000',
                color: loading ? '#9ca3af' : '#fff',
                boxShadow: loading ? 'none' : '3px 3px 0px 0px #166534',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px #166534'; }}}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #166534'; }}}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-black/40 pt-1">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-black underline underline-offset-2">Login</Link>
            </p>
          </form>

          <p className="text-center text-[11px] text-black/25 pb-6">© 2026 IndianTester</p>
        </div>
      </div>
    </div>
  );
}
