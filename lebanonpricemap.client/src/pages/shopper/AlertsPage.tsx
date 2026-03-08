import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/api/mockData';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { LBPInput } from '@/components/ui/LBPInput';

const REGIONS = ['Beirut', 'Metn', 'Keserwan', 'Tripoli', 'Sidon', 'Zahle'];

interface Alert {
  id: string;
  productId: string;
  productName: string;
  thresholdLbp: number;
  regions: string[];
  verifiedOnly: boolean;
  active: boolean;
  createdAt: string;
}

const DEFAULT_ALERTS: Alert[] = [
  { id: 'a1', productId: 'p5', productName: 'Diesel Fuel per Liter', thresholdLbp: 105000, regions: ['Beirut', 'Metn'], verifiedOnly: true,  active: true,  createdAt: '2025-03-01T00:00:00Z' },
  { id: 'a2', productId: 'p1', productName: 'Whole Milk TL 1L',      thresholdLbp: 120000, regions: ['Beirut'],          verifiedOnly: false, active: true,  createdAt: '2025-03-03T00:00:00Z' },
  { id: 'a3', productId: 'p2', productName: 'Eggs 30 Pack',          thresholdLbp: 380000, regions: ['Beirut', 'Sidon'], verifiedOnly: true,  active: false, createdAt: '2025-02-20T00:00:00Z' },
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const { open, close, getParam } = useRouteDialog();
  const [newProduct, setNewProduct] = useState('');
  const [newThreshold, setNewThreshold] = useState<number | ''>('');
  const [newRegions, setNewRegions] = useState<string[]>(['Beirut']);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const addToast = useToastStore(s => s.addToast);

  const activeAlertId = getParam('id');
  const activeAlert = alerts.find(a => a.id === activeAlertId);

  const toggleActive = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    addToast('Alert deleted', 'info');
    close();
  };

  const saveNewAlert = () => {
    const product = MOCK_PRODUCTS.find(p => p.id === newProduct);
    if (!product || !newThreshold) return;
    const alert: Alert = {
      id: `a${Date.now()}`,
      productId: product.id,
      productName: product.name,
      thresholdLbp: Number(newThreshold),
      regions: newRegions,
      verifiedOnly,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setAlerts(prev => [alert, ...prev]);
    close();
    setNewProduct('');
    setNewThreshold('');
    addToast('Price alert created!', 'success');
  };

  const activeCount = alerts.filter(a => a.active).length;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between border-b-2 border-text-main pb-8">
        <div>
          <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-2 block">USER_PROTOCOL // NOTIFICATION_CENTER</span>
          <h1 className="text-5xl font-serif font-black text-text-main uppercase tracking-tight">Price Monitoring</h1>
          <p className="text-text-muted text-xs font-bold mt-2 uppercase tracking-widest leading-relaxed">
            {activeCount} active surveillance nodes initialized · real-time drop detection active.
          </p>
        </div>
        <button
          onClick={() => open('new-alert')}
          className="btn-consulate h-14 px-8 bg-text-main text-bg-base border-text-main shadow-[4px_4px_0px_#0066FF] flex items-center gap-3"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          INITIALIZE_NEW_MONITOR
        </button>
      </motion.div>

      {/* Alert list - Architectural Grid */}
      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, i) => (
          <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`p-6 border transition-all ${alert.active ? 'bg-bg-surface border-text-main shadow-[6px_6px_0px_rgba(0,102,255,0.1)]' : 'bg-bg-base border-border-soft opacity-40'}`}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className={`w-12 h-12 flex items-center justify-center shrink-0 border ${alert.active ? 'bg-primary/5 border-primary/20' : 'bg-bg-muted border-border-soft'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: alert.active ? 'var(--primary)' : 'var(--text-muted)' }}>radar</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-lg font-black text-text-main uppercase tracking-tight">{alert.productName}</p>
                    {alert.verifiedOnly && (
                       <span className="text-[8px] font-bold bg-blue-600 text-white px-2 py-0.5 uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">VERIFIED_ONLY</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <span>THRESHOLD: <span className="text-primary">LBP {alert.thresholdLbp.toLocaleString()}</span></span>
                    <span className="w-1.5 h-1.5 bg-border-soft" />
                    <span>SCOPE: {alert.regions.join(' / ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleActive(alert.id)}
                  className={`text-[9px] font-black px-4 py-2 border uppercase tracking-[0.2em] transition-all ${alert.active ? 'bg-green-600 border-green-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,0.1)]' : 'bg-bg-muted border-border-soft text-text-muted hover:border-text-main'}`}
                >
                  {alert.active ? 'ACTIVE_SCAN' : 'PAUSED'}
                </button>
                <button
                   onClick={() => open('delete-alert', { id: alert.id })}
                   className="w-10 h-10 border border-border-soft text-text-muted hover:text-red-600 hover:border-red-600 hover:bg-red-600/5 transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_forever</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {alerts.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center bg-bg-base border border-dashed border-border-soft">
            <div className="w-16 h-16 border border-dashed border-border-soft flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '32px' }}>visibility_off</span>
            </div>
            <p className="text-sm font-black text-text-main uppercase tracking-[0.2em]">Zero Active Monitors</p>
            <p className="text-[10px] text-text-muted mt-2 uppercase tracking-widest">No surveillance parameters have been defined.</p>
          </div>
        )}
      </div>

      {/* URL-Driven Alert Dialogs */}
      <RouteDialog dialogId="new-alert" title="Create Price Alert" description="We'll notify you when prices drop below your limit.">
        <div className="flex flex-col gap-6 py-2">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">Target Product</label>
              <select
                value={newProduct}
                onChange={e => setNewProduct(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-bg-muted border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary appearance-none transition-all cursor-pointer"
              >
                <option value="">Select product…</option>
                {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1 text-center">Alert Threshold (LBP)</label>
              <LBPInput
                value={newThreshold}
                onChange={val => setNewThreshold(val)}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">Regions</label>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map(r => (
                <button
                  key={r}
                  onClick={() => setNewRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${newRegions.includes(r) ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-bg-muted text-text-sub border-border-soft hover:border-text-muted'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-bg-muted/50 p-4 rounded-xl border border-border-soft">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-5 h-5 rounded-md accent-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-main">Verified Prices Only</span>
                <span className="text-[10px] text-text-muted">Avoid noise from unverified community submissions</span>
              </div>
            </label>
          </div>

          <button 
            onClick={saveNewAlert} 
            disabled={!newProduct || !newThreshold} 
            className="h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Activate Alert
          </button>
        </div>
      </RouteDialog>

      <ConfirmDialog
        dialogId="delete-alert"
        title="Delete Price Alert"
        description={`Are you sure you want to stop monitoring ${activeAlert?.productName}? You can always recreate this alert later.`}
        confirmLabel="Remove Alert"
        variant="danger"
        onConfirm={() => activeAlertId && deleteAlert(activeAlertId)}
      />
    </div>
  );
}
