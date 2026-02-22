import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─── Types ─── */
type DealType = 'review' | 'rating' | 'only-order';
type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'refunded';
type ActiveFilter =
  | 'all' | 'pending' | 'accepted' | 'rejected'
  | 'refunded' | 'review-pending' | 'refund-initiated' | 'by-date';

type ProductOption = { code: string; name: string };
type Order = {
  id: string;
  dealType: DealType;
  affiliateName: string;
  brandName: string;
  campaignManager: string;
  agentName?: string;
  orderDate: string;
  orderIdText: string;
  orderAmount: number;
  refundAmount: number;
  screenshotName?: string;
  screenshotUrl?: string;
  productCode?: string;
  productName?: string;
  createdAt: string;
  status: OrderStatus;
  reviewPending: boolean;
  refundInitiated: boolean;
};

/* ─── inp — declared ONCE ─── */
const inp = "w-full px-3 py-2.5 rounded-xl border-2 border-black/15 text-sm outline-none bg-white focus:border-black/40 transition-colors";

/* ─── API helper ─── */
const API = import.meta.env.VITE_API_URL ?? '';

function mapOrder(o: Record<string, unknown>): Order {
  return {
    id:              o._id as string,
    dealType:        o.dealType as DealType,
    affiliateName:   o.affiliateName as string,
    brandName:       o.brandName as string,
    campaignManager: o.campaignManager as string,
    agentName:       (o.agentName as string) || undefined,
    orderDate:       o.orderDate as string,
    orderIdText:     o.orderIdText as string,
    orderAmount:     o.orderAmount as number,
    refundAmount:    o.refundAmount as number,
    screenshotName:  (o.screenshotPath as string) || undefined,
    screenshotUrl:   o.screenshotPath
      ? `${API}/api/orders/screenshot/${o.screenshotPath}`
      : undefined,
    productCode:     (o.productCode as string) || undefined,
    productName:     (o.productName as string) || undefined,
    createdAt:       new Date(o.createdAt as string).toLocaleString(),
    status:          o.status as OrderStatus,
    reviewPending:   o.reviewPending as boolean,
    refundInitiated: o.refundInitiated as boolean,
  };
}

/* ─── Icons ─── */
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconBox = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconBack = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconChevron = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const IconImage = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

/* ─── Badges ─── */
const DEAL_TYPE_LABEL: Record<DealType, string> = {
  review: 'Review', rating: 'Rating', 'only-order': 'Only Order',
};
const dealBadge = (t: DealType) =>
  t === 'review'      ? 'bg-blue-100 text-blue-700 border-blue-300'
  : t === 'rating'    ? 'bg-purple-100 text-purple-700 border-purple-300'
  : 'bg-amber-100 text-amber-700 border-amber-300';

const statusBadge = (s: OrderStatus): string => ({
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-red-100 text-red-700 border-red-300',
  refunded: 'bg-sky-100 text-sky-700 border-sky-300',
  pending:  'bg-amber-100 text-amber-800 border-amber-300',
}[s]);

/* ─── Product Master ─── */
const PRODUCT_MASTER: Record<string, ProductOption[]> = {
  'Arabian Aroma- AMZ': [
    { code: 'B0D8LCTML9', name: "Dark Men's Perfume – Long Lasting Perfume for Men (5 ml)" },
    { code: 'B0D7Q9Z1L2', name: 'Horizon Men Perfume – Long Lasting Perfume for Men (5 ml)' },
    { code: 'B0DFB7H1XK', name: 'Seduction Perfume For Men – Long Lasting (5 ml)' },
    { code: 'B0H5F82F7M', name: 'Body Mist for Women – Any of your choice' },
    { code: 'B0F94K2B7F', name: 'Seduction Perfume For Men – Long Lasting (30ml)' },
    { code: 'B0F2J42ZQP', name: 'OLD MONEY Perfume For Men – Long Lasting (50ml)' },
    { code: 'B0D7V88F7P', name: 'Sauvage OR YSL Y varient only 50ml' },
  ],
  Amazon: [
    { code: 'AMZ-1', name: 'Sample Amazon Product 1' },
    { code: 'AMZ-2', name: 'Sample Amazon Product 2' },
  ],
};

/* ─── Filter Options ─── */
const FILTER_OPTIONS = [
  { key: 'all',              label: 'All Orders',       emoji: '📋' },
  { key: 'pending',          label: 'Pending',          emoji: '🟡' },
  { key: 'accepted',         label: 'Accepted',         emoji: '🟢' },
  { key: 'rejected',         label: 'Rejected',         emoji: '🔴' },
  { key: 'refunded',         label: 'Refunded',         emoji: '🔵' },
  { key: 'refund-initiated', label: 'Refund Initiated', emoji: '💸' },
  { key: 'review-pending',   label: 'Review Pending',   emoji: '⭐' },
] as const;

/* ─── Toast ─── */
function Toast({ message, type = 'success', onDone }: {
  message: string; type?: 'success' | 'error'; onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl
      bg-black/75 backdrop-blur-2xl border border-white/20 shadow-2xl
      flex items-center gap-3 text-sm font-semibold text-white pointer-events-none whitespace-nowrap">
      <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
      {message}
    </div>
  );
}

/* ─── Skeleton loader row ─── */
function SkeletonRow() {
  return (
    <tr className="border-b border-black/5">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-black/8 rounded-full animate-pulse w-16" />
        </td>
      ))}
    </tr>
  );
}

/* ─── Helper Components ─── */
function FormField({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-black/50 uppercase tracking-widest">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3">
      <p className="text-[9px] font-black text-black/35 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-semibold text-black break-words">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-2.5 text-[10px] font-black text-black/40 uppercase tracking-widest whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 align-middle text-[11px] text-black/70 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function MyOrders() {
  const [orders, setOrders]                   = useState<Order[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [saving, setSaving]                   = useState(false);
  const [showForm, setShowForm]               = useState(false);
  const [selectedOrder, setSelectedOrder]     = useState<Order | null>(null);
  const [toast, setToast]                     = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [filterDate, setFilterDate]     = useState('');

  /* Form state */
  const [agree, setAgree]                     = useState(false);
  const [dealType, setDealType]               = useState<DealType>('review');
  const [affiliateName, setAffiliateName]     = useState(localStorage.getItem('name') || '');
  const [brandName, setBrandName]             = useState('');
  const [campaignManager, setCampaignManager] = useState('');
  const [agentName, setAgentName]             = useState('');
  const [orderDate, setOrderDate]             = useState(() => new Date().toISOString().slice(0, 10));
  const [orderIdText, setOrderIdText]         = useState('');
  const [orderAmount, setOrderAmount]         = useState('');
  const [refundAmount, setRefundAmount]       = useState('');
  const [screenshotFile, setScreenshotFile]   = useState<File | undefined>();
  const [productCode, setProductCode]         = useState('');
  const [productName, setProductName]         = useState('');
  const [error, setError]                     = useState('');

  const brandProducts = brandName ? PRODUCT_MASTER[brandName] || [] : [];

  /* ── Fetch orders from API ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders.map(mapOrder));
      } else {
        setToast({ msg: data.message || 'Failed to load orders', type: 'error' });
      }
    } catch {
      setToast({ msg: 'Network error — could not load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* Auto-close detail when filter changes */
  useEffect(() => { setSelectedOrder(null); }, [activeFilter, filterDate]);

  const resetForm = () => {
    setAgree(false); setDealType('review');
    setAffiliateName(localStorage.getItem('name') || '');
    setBrandName(''); setCampaignManager(''); setAgentName('');
    setOrderDate(new Date().toISOString().slice(0, 10));
    setOrderIdText(''); setOrderAmount(''); setRefundAmount('');
    setScreenshotFile(undefined); setProductCode(''); setProductName(''); setError('');
  };

  /* ── Save Order — API call ── */
  const handleSaveOrder = async () => {
    if (!agree) { setError('Please confirm the agreement.'); return; }
    if (!affiliateName.trim() || !brandName || !campaignManager ||
        !orderDate || !orderIdText.trim() || !orderAmount.trim() || !refundAmount.trim()) {
      setError('Please fill all required fields.'); return;
    }
    if (brandProducts.length > 0 && !productCode) {
      setError('Please select a product for this brand.'); return;
    }
    const amount = Number(orderAmount), refund = Number(refundAmount);
    if (isNaN(amount) || isNaN(refund)) { setError('Amounts must be numbers.'); return; }

    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('dealType',        dealType);
      formData.append('affiliateName',   affiliateName.trim());
      formData.append('brandName',       brandName);
      formData.append('campaignManager', campaignManager);
      formData.append('agentName',       agentName.trim());
      formData.append('orderDate',       orderDate);
      formData.append('orderIdText',     orderIdText.trim());
      formData.append('orderAmount',     String(amount));
      formData.append('refundAmount',    String(refund));
      formData.append('productCode',     productCode);
      formData.append('productName',     productName);
      if (screenshotFile) formData.append('screenshot', screenshotFile);

      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/api/orders`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });

      const data = await res.json();
      if (!data.success) { setError(data.message || 'Failed to save order'); return; }

      setOrders(prev => [mapOrder(data.order), ...prev]);
      setShowForm(false);
      setSelectedOrder(null);
      resetForm();
      setToast({ msg: 'Order added successfully!', type: 'success' });

    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Filtered list ── */
  const filteredOrders = useMemo(() => orders.filter(o => {
    if (search) {
      const blob = `${o.brandName} ${o.orderIdText} ${o.productCode ?? ''} ${o.affiliateName}`.toLowerCase();
      if (!blob.includes(search.toLowerCase())) return false;
    }
    if (activeFilter === 'refunded'         && o.status !== 'refunded')  return false;
    if (activeFilter === 'accepted'         && o.status !== 'accepted')  return false;
    if (activeFilter === 'rejected'         && o.status !== 'rejected')  return false;
    if (activeFilter === 'pending'          && o.status !== 'pending')   return false;
    if (activeFilter === 'review-pending'   && !o.reviewPending)         return false;
    if (activeFilter === 'refund-initiated' && !o.refundInitiated)       return false;
    if (activeFilter === 'by-date' && filterDate && o.orderDate !== filterDate) return false;
    return true;
  }), [orders, search, activeFilter, filterDate]);

  const totalRefund       = orders.reduce((s, o) => s + o.refundAmount, 0);
  const reviewsPending    = orders.filter(o => o.reviewPending).length;
  const activeFilterLabel = FILTER_OPTIONS.find(f => f.key === activeFilter)?.label ?? 'Filters';

  /* ════ JSX ════ */
  return (
    <div className="min-h-screen w-full bg-[#f0fdf4] overflow-x-hidden">

      {toast && (
        <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}

      {/* Navbar */}
      <nav className="w-full bg-white border-b-2 border-black px-4 sm:px-6 py-3
        flex items-center justify-between sticky top-0 z-40"
        style={{ boxShadow: '0 2px 0px 0px #000000' }}>
        <div className="flex items-center gap-2 shrink-0">
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
        <Link to="/buyer/dashboard"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-black/20
            hover:border-black text-xs font-bold text-black/50 hover:text-black transition-all">
          <IconBack />
          <span className="hidden sm:block">Dashboard</span>
        </Link>
      </nav>

      {/* MAIN */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">My Orders</h1>
            <p className="text-xs text-black/50 mt-0.5">Track all your affiliate test orders in one place.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search — desktop */}
            <div className="hidden sm:flex items-center px-3 py-2 rounded-xl border-2 border-black/15 bg-white text-xs w-52">
              <input placeholder="Search brand, order ID..."
                className="flex-1 outline-none text-xs bg-transparent"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Refresh */}
            <button onClick={fetchOrders} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-black bg-white
                text-xs font-black hover:bg-gray-50 transition-all disabled:opacity-40"
              style={{ boxShadow: '2px 2px 0px 0px #000000' }}>
              <span className={loading ? 'animate-spin' : ''}><IconRefresh /></span>
              <span className="hidden sm:block">Refresh</span>
            </button>

            {/* Filter */}
            <button onClick={() => setShowFilterPanel(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-black transition-all ${
                activeFilter !== 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-50'
              }`}
              style={{ boxShadow: '2px 2px 0px 0px #000000' }}>
              <IconFilter />
              <span className="hidden sm:block">
                {activeFilter !== 'all' ? activeFilterLabel : 'Filters'}
              </span>
            </button>

            {/* New Order */}
            <button onClick={() => { setShowForm(true); setSelectedOrder(null); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-black
                bg-black text-xs font-black text-white hover:bg-[#16a34a] hover:border-[#14532d] transition-all"
              style={{ boxShadow: '3px 3px 0px 0px #14532d' }}>
              <IconPlus />
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden flex items-center px-3 py-2.5 rounded-xl border-2 border-black/15 bg-white">
          <input placeholder="Search brand, order ID..."
            className="flex-1 outline-none text-xs bg-transparent"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Active filter chip */}
        {activeFilter !== 'all' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-black/50 uppercase font-black tracking-widest">Filtered:</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black text-white text-[11px] font-semibold">
              {FILTER_OPTIONS.find(f => f.key === activeFilter)?.emoji} {activeFilterLabel}
              <button onClick={() => { setActiveFilter('all'); setFilterDate(''); }}
                className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity">
                <IconClose />
              </button>
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { bg: '#fef9c3', label: 'Total Orders',    value: `${orders.length}`,            sub: 'All time' },
            { bg: '#e0f2fe', label: 'Reviews Pending', value: `${reviewsPending}`,            sub: 'Need feedback' },
            { bg: '#dcfce7', label: 'Total Refund',    value: `₹ ${totalRefund.toFixed(0)}`,  sub: 'Combined' },
          ].map(c => (
            <div key={c.label} className="rounded-2xl border-2 border-black p-3 sm:p-4"
              style={{ backgroundColor: c.bg, boxShadow: '3px 3px 0px 0px #000000' }}>
              <p className="text-[9px] sm:text-[10px] font-black text-black/40 uppercase tracking-widest">{c.label}</p>
              <p className="text-lg sm:text-2xl font-black text-black mt-1">{c.value}</p>
              <p className="text-[10px] text-black/50 mt-0.5 hidden sm:block">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-2xl border-2 border-black bg-white overflow-hidden"
          style={{ boxShadow: '3px 3px 0px 0px #000000' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-[#f0fdf4] border-b-2 border-black/10">
                  <Th>Order ID</Th><Th>Brand / Product</Th><Th>Date</Th>
                  <Th>Deal Type</Th><Th>Amount</Th><Th>Refund</Th>
                  <Th>Order Status</Th><Th>Review</Th><Th>Refund Status</Th><Th>&nbsp;</Th>
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

                {!loading && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center text-[11px] text-black/40 py-10">
                      {orders.length === 0
                        ? 'No orders yet. Click "+ New Order" to add your first order.'
                        : 'No orders match. Try changing search or filters.'}
                    </td>
                  </tr>
                )}

                {!loading && filteredOrders.map(order => (
                  <tr key={order.id}
                    className={`border-b border-black/5 hover:bg-[#f0fdf4] cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-[#ecfdf5]' : ''
                    }`}
                    onClick={() => setSelectedOrder(p => p?.id === order.id ? null : order)}>
                    <Td><span className="font-black text-black">{order.orderIdText}</span></Td>
                    <Td>
                      <div className="flex flex-col max-w-xs">
                        <span className="font-semibold text-black">{order.brandName}</span>
                        {order.productCode && (
                          <span className="text-[10px] text-black/50 truncate">
                            {order.productCode} · {order.productName}
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>{order.orderDate}</Td>
                    <Td>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${dealBadge(order.dealType)}`}>
                        {DEAL_TYPE_LABEL[order.dealType]}
                      </span>
                    </Td>
                    <Td>₹ {order.orderAmount}</Td>
                    <Td>₹ {order.refundAmount}</Td>
                    <Td>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusBadge(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </Td>
                    <Td>
                      {order.reviewPending
                        ? <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-semibold">Pending</span>
                        : <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold">Done</span>
                      }
                    </Td>
                    <Td>
                      {order.refundInitiated
                        ? <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300 text-[10px] font-semibold whitespace-nowrap">💸 Initiated</span>
                        : <span className="text-black/25 text-xs">—</span>
                      }
                    </Td>
                    <Td>
                      <button className="px-2 py-1 rounded-full border border-black/20 hover:border-black text-[10px] flex items-center gap-1 transition-all">
                        View <IconChevron />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border-2 border-black bg-white p-3.5 space-y-2"
              style={{ boxShadow: '2px 2px 0px 0px #000' }}>
              <div className="h-4 bg-black/8 rounded-full w-32 animate-pulse" />
              <div className="h-3 bg-black/8 rounded-full w-20 animate-pulse" />
            </div>
          ))}

          {!loading && filteredOrders.length === 0 && (
            <div className="text-center text-[11px] text-black/40 py-8 bg-white rounded-2xl border-2 border-black"
              style={{ boxShadow: '3px 3px 0px 0px #000' }}>
              {orders.length === 0 ? 'No orders yet. Tap "+ New Order".' : 'No orders match.'}
            </div>
          )}

          {!loading && filteredOrders.map(order => (
            <button key={order.id}
              onClick={() => setSelectedOrder(p => p?.id === order.id ? null : order)}
              className={`w-full text-left rounded-2xl border-2 border-black bg-white p-3.5 transition-all ${
                selectedOrder?.id === order.id ? 'bg-[#ecfdf5]' : ''
              }`}
              style={{ boxShadow: '2px 2px 0px 0px #000000' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-black text-sm text-black truncate">{order.orderIdText}</p>
                  <p className="text-[11px] text-black/60">{order.brandName}</p>
                  {order.productCode && (
                    <p className="text-[10px] text-black/40 truncate">{order.productCode}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${dealBadge(order.dealType)}`}>
                    {DEAL_TYPE_LABEL[order.dealType]}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold ${statusBadge(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5">
                <span className="text-[11px] text-black/50">{order.orderDate}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-black">₹ {order.orderAmount}</span>
                  {order.refundInitiated && (
                    <span className="text-[9px] bg-sky-100 text-sky-700 border border-sky-300 px-1.5 py-0.5 rounded-full">💸</span>
                  )}
                  {order.reviewPending && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full">⭐</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Card */}
        {selectedOrder && (
          <div className="rounded-2xl border-2 border-black bg-white overflow-hidden"
            style={{ boxShadow: '3px 3px 0px 0px #000000' }}>
            <div className="flex items-center justify-between bg-[#86efac] border-b-2 border-black px-4 sm:px-5 py-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white shrink-0">
                  <IconBox />
                </div>
                <div>
                  <p className="text-[9px] font-black text-black/50 uppercase tracking-widest">Order Details</p>
                  <p className="text-sm font-black text-black">{selectedOrder.orderIdText}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${statusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
                {selectedOrder.refundInitiated && (
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-300 text-[10px] font-bold whitespace-nowrap">
                    💸 Refund Initiated
                  </span>
                )}
                <button onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full border border-black/20 hover:border-black text-black/60 hover:text-black transition-all">
                  <IconClose />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-black/8">
              <InfoCell label="Deal Type"        value={DEAL_TYPE_LABEL[selectedOrder.dealType]} />
              <InfoCell label="Affiliate Name"   value={selectedOrder.affiliateName} />
              <InfoCell label="Brand"            value={selectedOrder.brandName} />
              <InfoCell label="Campaign Manager" value={selectedOrder.campaignManager} />
              {selectedOrder.agentName && <InfoCell label="Agent Name" value={selectedOrder.agentName} />}
              <InfoCell label="Order Date"       value={selectedOrder.orderDate} />
              <InfoCell label="Order ID"         value={selectedOrder.orderIdText} />
              {selectedOrder.productCode && <InfoCell label="Product Code" value={selectedOrder.productCode} />}
              {selectedOrder.productName && <InfoCell label="Product Name" value={selectedOrder.productName} />}
              <InfoCell label="Order Amount"     value={`₹ ${selectedOrder.orderAmount}`} />
              <InfoCell label="Refund Amount"    value={`₹ ${selectedOrder.refundAmount}`} />
              <InfoCell label="Review Status"    value={selectedOrder.reviewPending ? 'Pending' : 'Done'} />
              <InfoCell label="Refund Initiated" value={selectedOrder.refundInitiated ? 'Yes' : 'No'} />
              <InfoCell label="Added On"         value={selectedOrder.createdAt} />
              {selectedOrder.screenshotUrl && (
                <div className="flex flex-col gap-0.5 px-4 py-3">
                  <p className="text-[9px] font-black text-black/35 uppercase tracking-widest">Screenshot</p>
                  <button
                    onClick={() => window.open(selectedOrder.screenshotUrl, '_blank')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline text-left mt-0.5">
                    <IconImage />
                    <span className="truncate max-w-[160px]">{selectedOrder.screenshotName}</span>
                  </button>
                </div>
              )}
              {selectedOrder.screenshotName && !selectedOrder.screenshotUrl && (
                <InfoCell label="Screenshot" value={selectedOrder.screenshotName} />
              )}
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-black/25 pb-4">© 2026 IndianTester</p>
      </main>

      {/* Filter Panel — bottom sheet on mobile */}
      {showFilterPanel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilterPanel(false)} />
          <div className="relative w-full sm:w-80 bg-white rounded-t-3xl sm:rounded-3xl border-2 border-black p-5 space-y-4 z-10"
            style={{ boxShadow: '0 0 0 2px #000, 4px -4px 0px 0px #000' }}>
            <div className="w-10 h-1 bg-black/20 rounded-full mx-auto sm:hidden" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-black">Filter Orders</p>
              <button onClick={() => setShowFilterPanel(false)}
                className="p-1.5 rounded-full border border-black/20 hover:border-black transition-all">
                <IconClose />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">By Status</p>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_OPTIONS.map(f => (
                  <button key={f.key} type="button"
                    onClick={() => { setActiveFilter(f.key as ActiveFilter); setShowFilterPanel(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      activeFilter === f.key
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black/70 border-black/15 hover:border-black/40'
                    }`}>
                    <span>{f.emoji}</span> {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">By Date</p>
              <input type="date" value={filterDate}
                onChange={e => { setFilterDate(e.target.value); setActiveFilter('by-date'); setShowFilterPanel(false); }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-black/15 text-sm outline-none" />
            </div>
            <button type="button"
              onClick={() => { setActiveFilter('all'); setFilterDate(''); setShowFilterPanel(false); }}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black/15 text-sm font-semibold text-black/60 hover:bg-gray-50 transition-all">
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3">
          <div className="w-full max-w-xl rounded-3xl border-2 border-black bg-white overflow-hidden"
            style={{ boxShadow: '0 0 0 2px #000, 4px 4px 0px 0px #14532d' }}>
            <div className="flex items-center justify-between bg-[#86efac] border-b-2 border-black px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
                  <IconBox />
                </div>
                <div>
                  <p className="text-[9px] font-black text-black/50 uppercase tracking-widest">New Order</p>
                  <p className="text-sm font-black text-black">Add order details</p>
                </div>
              </div>
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="p-1.5 rounded-full border border-black/20 hover:border-black text-black/60 hover:text-black transition-all">
                <IconClose />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3 max-h-[72vh] overflow-y-auto">
              {error && (
                <div className="text-[11px] text-red-600 bg-red-50 border border-red-300 rounded-xl px-3 py-2">{error}</div>
              )}

              <label className="flex items-center gap-2 text-xs text-black/80 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="w-4 h-4" />
                <span>I confirm that these order details are correct.</span>
              </label>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-black/50 uppercase tracking-widest">Deal Type</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  {[['review','Review'],['rating','Rating'],['only-order','Only Order']].map(([v,l]) => (
                    <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" value={v} checked={dealType === v}
                        onChange={() => setDealType(v as DealType)} className="w-3.5 h-3.5" />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormField label="Affiliate Name" required>
                <input type="text" value={affiliateName} onChange={e => setAffiliateName(e.target.value)} className={inp} />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Brand Name" required>
                  <select value={brandName}
                    onChange={e => { setBrandName(e.target.value); setProductCode(''); setProductName(''); }}
                    className={inp}>
                    <option value="">Select brand</option>
                    <option value="Arabian Aroma- AMZ">Arabian Aroma- AMZ</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Flipkart">Flipkart (demo)</option>
                  </select>
                </FormField>
                <FormField label="Campaign Manager" required>
                  <select value={campaignManager} onChange={e => setCampaignManager(e.target.value)} className={inp}>
                    <option value="">Select manager</option>
                    <option value="CS">CS</option>
                    <option value="Manager A">Manager A</option>
                    <option value="Manager B">Manager B</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Agent Name (optional)">
                <input type="text" value={agentName} onChange={e => setAgentName(e.target.value)} className={inp} />
                <p className="text-[10px] text-black/40 mt-0.5">Fill only if manager provided an agent name.</p>
              </FormField>

              {brandProducts.length > 0 && (
                <FormField label="Product" required>
                  <select value={productCode}
                    onChange={e => {
                      setProductCode(e.target.value);
                      setProductName(brandProducts.find(p => p.code === e.target.value)?.name || '');
                    }}
                    className={inp}>
                    <option value="">Select product</option>
                    {brandProducts.map(p => (
                      <option key={p.code} value={p.code}>{p.code} — {p.name}</option>
                    ))}
                  </select>
                </FormField>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Order Date" required>
                  <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className={inp} />
                </FormField>
                <FormField label="Order ID (Text)" required>
                  <input type="text" value={orderIdText} onChange={e => setOrderIdText(e.target.value)}
                    placeholder="e.g. 405-0332034" className={inp} />
                </FormField>
              </div>

              <FormField label="Order Screenshot" required>
                <input type="file" accept="image/*"
                  onChange={e => setScreenshotFile(e.target.files?.[0])}
                  className="w-full text-[11px]" />
                {screenshotFile && (
                  <p className="text-[10px] text-black/50 mt-0.5">Selected: {screenshotFile.name}</p>
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Order Amount" required>
                  <input type="number" value={orderAmount} onChange={e => setOrderAmount(e.target.value)} className={inp} />
                </FormField>
                <FormField label="Refund Amount" required>
                  <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} className={inp} />
                </FormField>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 border-t-2 border-black/10 bg-gray-50/80">
              <button onClick={() => { setShowForm(false); resetForm(); }}
                disabled={saving}
                className="px-4 py-2 rounded-xl border-2 border-black bg-white text-xs font-black hover:bg-gray-100 transition-all disabled:opacity-40">
                Cancel
              </button>
              <button onClick={handleSaveOrder} disabled={saving}
                className="px-4 py-2 rounded-xl border-2 border-black bg-black text-xs font-black text-white hover:bg-[#16a34a] hover:border-[#14532d] transition-all disabled:opacity-60 flex items-center gap-1.5"
                style={{ boxShadow: '2px 2px 0px 0px #14532d' }}>
                {saving && <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {saving ? 'Saving...' : 'Save Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
