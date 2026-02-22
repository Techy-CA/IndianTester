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
const IconUPI = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function BuyerProfile() {
  const navigate = useNavigate();
  const name     = localStorage.getItem('name')     || 'User';
  const role     = localStorage.getItem('role')     || 'buyer';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email:    localStorage.getItem('email')    || '',
    whatsapp: localStorage.getItem('whatsapp') || '',
    upiId:    localStorage.getItem('upiId')    || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass]   = useState({ current: false, newPass: false, confirm: false });
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const updatePass = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords(prev => ({ ...prev, [field]: e.target.value }));

  const handleUpdate = async () => {
    if (!form.email.trim() || !form.whatsapp.trim()) { setError('Email and WhatsApp are required.'); return; }
    if (!/^\d{10}$/.test(form.whatsapp))              { setError('Enter a valid 10-digit WhatsApp number.'); return; }
    if (passwords.newPass && passwords.newPass !== passwords.confirm) { setError('New passwords do not match.'); return; }
    if (passwords.newPass && passwords.newPass.length < 6)            { setError('New password must be at least 6 characters.'); return; }
    if (passwords.newPass && !passwords.current)                      { setError('Enter your current password to change it.'); return; }

    setLoading(true); setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const payload: any = { email: form.email, whatsapp: form.whatsapp, upiId: form.upiId || undefined };
      if (passwords.newPass) { payload.currentPassword = passwords.current; payload.newPassword = passwords.newPass; }

      const res = await axios.put('http://localhost:5000/api/user/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('email',    res.data.email    || form.email);
      localStorage.setItem('whatsapp', res.data.whatsapp || form.whatsapp);
      localStorage.setItem('upiId',    res.data.upiId    || form.upiId);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border-2 border-black/15 text-sm font-semibold text-gray-800 placeholder:text-gray-300 outline-none bg-white transition-all";
  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#000'; e.target.style.boxShadow = '2px 2px 0px 0px #000000'; };
  const blurStyle  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(0,0,0,0.15)'; e.target.style.boxShadow = 'none'; };

  const viewFields = [
    { icon: <IconUser />,   label: 'Full Name', value: name,              locked: true  },
    { icon: <IconMail />,   label: 'Email',     value: form.email,        locked: false },
    { icon: <IconPhone />,  label: 'WhatsApp',  value: form.whatsapp,     locked: false },
    { icon: <IconUPI />,    label: 'UPI ID',    value: form.upiId || '—', locked: false },
    { icon: <IconShield />, label: 'Role',      value: role.charAt(0).toUpperCase() + role.slice(1), locked: true },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0fdf4] overflow-x-hidden">

      {/* Sticky Navbar */}
      <nav className="w-full bg-white border-b-2 border-black px-3 py-2.5 flex items-center justify-between sticky top-0 z-50"
        style={{ boxShadow: '0 2px 0px 0px #000000' }}>

        {/* Left */}
        <div className="flex items-center gap-1.5 shrink-0">
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

        {/* Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link to="/buyer/dashboard"
            className="flex items-center gap-1 px-2 py-1.5 rounded-full border-2 border-black/20 hover:border-black text-xs font-bold text-black/50 hover:text-black transition-all"
            style={{ boxShadow: '1px 1px 0px 0px #00000015' }}>
            <IconArrow />
            <span className="hidden sm:block">Dashboard</span>
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full border-2 border-black bg-white text-xs font-black text-black hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all"
            style={{ boxShadow: '2px 2px 0px 0px #000000' }}>
            <IconLogout />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="w-full max-w-lg mx-auto px-3 py-5 space-y-3">

        {/* Header Card */}
        <div className="rounded-2xl border-2 border-black bg-[#86efac] p-4"
          style={{ boxShadow: '3px 3px 0px 0px #000000' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 border-2 border-black flex items-center justify-center text-base font-black text-black shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black text-black tracking-tight truncate">{name}</h1>
              <p className="text-xs text-black/50 truncate">{form.email || 'No email'}</p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-black/10 border border-black/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-700 shrink-0"/>
                <span className="text-[9px] font-black text-black/60 uppercase tracking-widest">{role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-green-500 bg-white text-green-700 text-sm font-semibold"
            style={{ boxShadow: '2px 2px 0px 0px #16a34a' }}>
            <IconCheck /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-red-400 bg-white text-red-600 text-sm font-semibold"
            style={{ boxShadow: '2px 2px 0px 0px #ef4444' }}>
            <IconX /> {error}
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border-2 border-black bg-white p-4 space-y-3"
          style={{ boxShadow: '3px 3px 0px 0px #000000' }}>

          {!editing ? (
            <>
              <p className="text-[9px] font-black text-black/25 uppercase tracking-widest">Account Details</p>

              {viewFields.map(({ icon, label, value, locked }, i, arr) => (
                <div key={label}
                  className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b-2 border-dashed border-black/10' : ''}`}>
                  <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border-2 border-black/10 flex items-center justify-center text-black/35 shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-black text-black truncate">{value}</p>
                  </div>
                  {locked && (
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0">
                      Fixed
                    </span>
                  )}
                </div>
              ))}

              <button
                onClick={() => { setEditing(true); setError(''); setSuccess(''); }}
                className="w-full py-3 rounded-xl text-sm font-black border-2 border-black flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: '#000', color: '#fff', boxShadow: '3px 3px 0px 0px #166534' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px #166534'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #166534'; }}>
                <IconEdit /> Edit Profile
              </button>
            </>
          ) : (
            <>
              <p className="text-[9px] font-black text-black/25 uppercase tracking-widest">Edit Profile</p>

              {/* Name locked */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.03] border-2 border-dashed border-black/10">
                <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border-2 border-black/10 flex items-center justify-center text-black/30 shrink-0">
                  <IconUser />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Name — Cannot be changed</p>
                  <p className="text-sm font-black text-black/40 truncate">{name}</p>
                </div>
                <IconLock />
              </div>

              {/* Editable fields */}
              {[
                { key: 'email',    label: 'Email Address',   icon: <IconMail />,  type: 'email', placeholder: 'you@email.com'  },
                { key: 'whatsapp', label: 'WhatsApp Number', icon: <IconPhone />, type: 'tel',   placeholder: '10-digit number' },
                { key: 'upiId',    label: 'UPI ID',          icon: <IconUPI />,   type: 'text',  placeholder: 'name@upi'        },
              ].map(({ key, label, icon, type, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[9px] font-black text-black/40 uppercase tracking-widest">
                    {icon} {label}
                  </label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={updateForm(key)} placeholder={placeholder}
                    className={inputClass}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              ))}

              {/* Password */}
              <div className="pt-2 border-t-2 border-dashed border-black/10 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <IconLock />
                  <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">Change Password — optional</p>
                </div>
                {([
                  { key: 'current', label: 'Current Password',     show: showPass.current, toggle: () => setShowPass(p => ({ ...p, current: !p.current })) },
                  { key: 'newPass', label: 'New Password',         show: showPass.newPass, toggle: () => setShowPass(p => ({ ...p, newPass: !p.newPass })) },
                  { key: 'confirm', label: 'Confirm New Password', show: showPass.confirm, toggle: () => setShowPass(p => ({ ...p, confirm: !p.confirm })) },
                ] as { key: 'current'|'newPass'|'confirm', label: string, show: boolean, toggle: () => void }[]).map(({ key, label, show, toggle }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[9px] font-black text-black/30 uppercase tracking-widest">{label}</label>
                    <div className="relative">
                      <input type={show ? 'text' : 'password'} value={passwords[key]}
                        onChange={updatePass(key)} placeholder="••••••••"
                        className={`${inputClass} pr-10`}
                        onFocus={focusStyle} onBlur={blurStyle} />
                      <button type="button" onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors p-1">
                        {show ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel + Save */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setEditing(false); setError(''); setPasswords({ current: '', newPass: '', confirm: '' }); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black border-2 border-black bg-white flex items-center justify-center gap-1.5 transition-all"
                  style={{ boxShadow: '2px 2px 0px 0px #000000' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #000000'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000000'; }}>
                  <IconX /> Cancel
                </button>
                <button onClick={handleUpdate} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black border-2 border-black flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: loading ? '#e5e7eb' : '#000',
                    color:           loading ? '#9ca3af' : '#fff',
                    boxShadow:       loading ? 'none' : '3px 3px 0px 0px #166534',
                    cursor:          loading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px #166534'; }}}
                  onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #166534'; }}}>
                  {loading ? 'Saving...' : <><IconCheck /> Save</>}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-black/25 pb-6">© 2026 IndianTester</p>
      </div>
    </div>
  );
}
