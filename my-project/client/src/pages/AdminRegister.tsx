import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !secretKey) {
      setError('Please fill in all fields.'); return;
    }
    if (secretKey !== 'INDIANTESTER@ADMIN') {
      setError('Invalid secret key. Contact SuperAdmin.'); return;
    }
    setLoading(true); setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role: 'admin'
      });
      navigate('/admin/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0eeff] flex flex-col items-center justify-center px-4 py-10">

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

      {/* Purple Card */}
      <div className="w-full max-w-[400px] rounded-3xl border-2 border-black bg-[#c4b5fd] p-7 space-y-5"
        style={{ boxShadow: '4px 4px 0px 0px #000000' }}>

        {/* Avatar + Title */}
        <div className="flex flex-col items-center space-y-3 pb-2">
          <div className="w-16 h-16 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-2xl">
            🔐
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-black tracking-tight">Create Admin Account</h1>
            <p className="text-xs text-black/50 mt-0.5">Secret key required for registration</p>
          </div>
        </div>

        <div className="border-t-2 border-black/10" />

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-red-400 bg-red-50 text-red-600 text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M7 4.5V7.5M7 9.5V10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {/* Fields */}
        {[
          { label: 'Full Name', value: name, setter: setName, placeholder: 'Admin Name', type: 'text' },
          { label: 'Email', value: email, setter: setEmail, placeholder: 'admin@indiantester.com', type: 'email' },
          { label: 'Password', value: password, setter: setPassword, placeholder: '••••••••••', type: 'password' },
        ].map(({ label, value, setter, placeholder, type }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-bold text-black uppercase tracking-widest">{label}</label>
            <input
              type={type} value={value} placeholder={placeholder}
              onChange={e => setter(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
              className="w-full px-4 py-3 rounded-2xl border-2 border-black text-sm text-gray-800 placeholder:text-gray-300 outline-none bg-white"
              style={{ boxShadow: '2px 2px 0px 0px #000000' }}
              onFocus={e => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
              onBlur={e => e.target.style.boxShadow = '2px 2px 0px 0px #000000'}
            />
          </div>
        ))}

        {/* Secret Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-black uppercase tracking-widest">
            🔑 Secret Key
          </label>
          <input
            type="password" value={secretKey}
            placeholder="Enter secret key"
            onChange={e => setSecretKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="w-full px-4 py-3 rounded-2xl border-2 border-black text-sm text-gray-800 placeholder:text-gray-300 outline-none bg-white"
            style={{ boxShadow: '2px 2px 0px 0px #000000' }}
            onFocus={e => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
            onBlur={e => e.target.style.boxShadow = '2px 2px 0px 0px #000000'}
          />
          <p className="text-[10px] text-black/40 pl-1">Contact your SuperAdmin for the secret key</p>
        </div>

        {/* Submit */}
        <button onClick={handleRegister} disabled={loading}
          className="w-full py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 border-2 border-black"
          style={{
            backgroundColor: loading ? '#e5e7eb' : '#000000',
            color: loading ? '#9ca3af' : 'white',
            boxShadow: loading ? 'none' : '3px 3px 0px 0px #5b21b6',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px #5b21b6'; }}}
          onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #5b21b6'; }}}>
          {loading ? 'Creating...' : 'Create Admin Account →'}
        </button>

        <p className="text-center text-xs text-black/50">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-black font-bold underline underline-offset-2 hover:text-purple-900 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-[11px] text-black/30 mt-6">© 2026 IndianTester</p>
    </div>
  );
}
