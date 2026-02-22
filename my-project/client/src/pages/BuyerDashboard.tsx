import { useNavigate, Link } from 'react-router-dom';

const IconBox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconCart = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconPackage = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconStarSm = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'User';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const stats = [
    { icon: <IconBox />,   label: 'Orders',   value: '0', bg: '#fde68a' },
    { icon: <IconStar />,  label: 'Reviews',  value: '0', bg: '#c4b5fd' },
    { icon: <IconHeart />, label: 'Wishlist', value: '0', bg: '#fca5a5' },
  ];

  const actions = [
    { icon: <IconCart />,    label: 'Browse Products', desc: 'Explore all listings',  to: '/buyer/products' },
    { icon: <IconPackage />, label: 'My Orders',        desc: 'Track your orders',     to: '/buyer/orders'   },
    { icon: <IconStarSm />, label: 'My Reviews',       desc: 'Manage your reviews',   to: '/buyer/reviews'  },
    { icon: <IconUser />,   label: 'My Profile',       desc: 'Edit your account',     to: '/buyer/profile'  },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0fdf4] overflow-x-hidden">

      {/* Navbar */}
      <nav className="w-full bg-white border-b-2 border-black px-3 py-2.5 flex items-center justify-between sticky top-0 z-50"
        style={{ boxShadow: '0 2px 0px 0px #000000' }}>

        {/* Left */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
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
          <Link to="/buyer/profile"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-full border-2 border-black bg-white hover:bg-[#86efac] transition-all"
            style={{ boxShadow: '2px 2px 0px 0px #000000' }}>
            <div className="w-6 h-6 rounded-full bg-yellow-400 border border-black flex items-center justify-center text-[10px] font-black text-black shrink-0">
              {initials}
            </div>
            <span className="text-xs font-bold text-black hidden sm:block max-w-[70px] truncate">{name}</span>
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
      <main className="w-full max-w-2xl mx-auto px-3 py-5 space-y-3">

        {/* Welcome */}
        <div className="rounded-2xl border-2 border-black bg-[#86efac] p-4"
          style={{ boxShadow: '3px 3px 0px 0px #000000' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-yellow-400 border-2 border-black flex items-center justify-center text-sm font-black text-black shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Welcome back</p>
              <h1 className="text-base font-black text-black tracking-tight leading-tight truncate">Hello, {name}!</h1>
              <p className="text-[10px] text-black/50 mt-0.5">Here's your account overview.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ icon, label, value, bg }) => (
            <div key={label}
              className="rounded-xl border-2 border-black p-3 flex flex-col gap-1.5"
              style={{ backgroundColor: bg, boxShadow: '2px 2px 0px 0px #000000' }}>
              <div className="w-7 h-7 rounded-lg bg-black/10 border border-black/15 flex items-center justify-center text-black shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xl font-black text-black leading-none">{value}</p>
                <p className="text-[9px] font-bold text-black/50 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border-2 border-black bg-white p-4 space-y-2.5"
          style={{ boxShadow: '3px 3px 0px 0px #000000' }}>
          <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">Quick Actions</p>
          <div className="space-y-2">
            {actions.map(({ icon, label, desc, to }) => (
              <Link key={label} to={to}
                className="flex items-center justify-between px-3 py-3 rounded-xl border-2 border-black bg-[#f0fdf4] hover:bg-[#86efac] transition-all group"
                style={{ boxShadow: '2px 2px 0px 0px #000000' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px 0px #000000'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000000'; }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-black truncate">{label}</p>
                    <p className="text-[11px] text-black/40 truncate">{desc}</p>
                  </div>
                </div>
                <span className="text-black/25 group-hover:text-black transition-colors shrink-0 ml-2">
                  <IconChevron />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-black/25 pb-4">© 2026 IndianTester</p>
      </main>
    </div>
  );
}
