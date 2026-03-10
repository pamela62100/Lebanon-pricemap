import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/api/mockData';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { LBPInput } from '@/components/ui/LBPInput';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

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
  {
    id: 'a1', productId: 'p5', productName: 'Diesel Fuel per Liter',
    thresholdLbp: 105000, regions: ['Beirut', 'Metn'], verifiedOnly: true,
    active: true, createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'a2', productId: 'p1', productName: 'Whole Milk TL 1L',
    thresholdLbp: 120000, regions: ['Beirut'], verifiedOnly: false,
    active: true, createdAt: '2025-03-03T00:00:00Z',
  },
  {
    id: 'a3', productId: 'p2', productName: 'Eggs 30 Pack',
    thresholdLbp: 380000, regions: ['Beirut', 'Sidon'], verifiedOnly: true,
    active: false, createdAt: '2025-02-20T00:00:00Z',
  },
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const { open, close, getParam } = useRouteDialog();
  const [newProduct, setNewProduct] = useState('');
  const [newThreshold, setNewThreshold] = useState<number | ''>('');
  const [newRegions, setNewRegions] = useState<string[]>(['Beirut']);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  const activeAlertId = getParam('id');
  const activeAlert = alerts.find((a) => a.id === activeAlertId);

  const toggleActive = (id: string) =>
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    addToast('Alert removed');
    close();
  };

  const saveNewAlert = () => {
    const product = MOCK_PRODUCTS.find((p) => p.id === newProduct);
    if (!product || !newThreshold) return;
    setAlerts((prev) => [{
      id: `a${Date.now()}`, productId: product.id, productName: product.name,
      thresholdLbp: Number(newThreshold), regions: newRegions,
      verifiedOnly, active: true, createdAt: new Date().toISOString(),
    }, ...prev]);
    close();
    setNewProduct(''); setNewThreshold(''); setNewRegions(['Beirut']); setVerifiedOnly(true);
    addToast('Price alert created');
  };

  const activeCount = alerts.filter((a) => a.active).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-10 sm:py-12 md:py-16 animate-page">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.18em] mb-3">
              Price alerts
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-main tracking-tighter">
              Stay updated
            </h1>
            <p className="text-sm font-medium text-text-muted mt-3">
              <span className="text-text-main font-bold">{activeCount}</span> active alerts out of {alerts.length}
            </p>
          </div>
          <button
            onClick={() => open('new-alert')}
            className="btn-primary h-12 px-6 rounded-full self-start md:self-auto"
            type="button"
          >
            <span className="material-symbols-outlined">add</span>
            Create Alert
          </button>
        </header>

        <section className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all',
                  !alert.active && 'opacity-60'
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="text-base font-bold text-text-main truncate">{alert.productName}</h3>
                      {alert.verifiedOnly && (
                        <span className="px-2 py-0.5 bg-bg-muted text-text-muted text-[10px] font-semibold uppercase tracking-wide rounded-full">
                          Verified only
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">
                      Below <span className="text-text-main font-semibold">{alert.thresholdLbp.toLocaleString()} LBP</span>
                      <span className="mx-2 opacity-30">·</span>
                      {alert.regions.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(alert.id)}
                    className={cn(
                      'px-4 h-9 rounded-full text-sm font-semibold transition-all',
                      alert.active ? 'bg-text-main text-white' : 'bg-bg-muted text-text-muted hover:text-text-main'
                    )}
                    type="button"
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => open('delete-alert', { id: alert.id })}
                    className="w-9 h-9 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {alerts.length === 0 && (
            <EmptyState
              icon="notifications_off"
              title="No alerts yet"
              subtitle="Create a price alert and WenArkhas will notify you when prices drop."
            />
          )}
        </section>

        {/* Create alert dialog — compact, fits without scrolling */}
        <RouteDialog
          dialogId="new-alert"
          title="Create a price alert"
          size="sm"
        >
          <div className="space-y-4">
            {/* Product */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Product</label>
              <div className="relative">
                <select
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 rounded-xl bg-bg-muted border border-border-soft text-sm font-medium text-text-main outline-none focus:border-text-main/30 appearance-none cursor-pointer"
                >
                  <option value="">Select a product</option>
                  {MOCK_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">
                  unfold_more
                </span>
              </div>
            </div>

            {/* Target price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Target price</label>
              <LBPInput value={newThreshold} onChange={setNewThreshold} className="max-w-none" />
            </div>

            {/* Regions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Regions</label>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() =>
                      setNewRegions((prev) =>
                        prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
                      )
                    }
                    className={cn(
                      'px-3 py-1.5 rounded-full border text-xs font-semibold transition-all',
                      newRegions.includes(region)
                        ? 'bg-text-main text-white border-text-main'
                        : 'bg-white text-text-muted border-border-soft hover:border-text-main/20 hover:text-text-main'
                    )}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified only toggle */}
            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-bg-muted cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-text-main">Verified data only</p>
                <p className="text-xs text-text-muted mt-0.5">Only use trusted, verified prices</p>
              </div>
              <div
                className={cn(
                  'w-10 h-6 rounded-full transition-all shrink-0 relative',
                  verifiedOnly ? 'bg-text-main' : 'bg-border-soft'
                )}
                onClick={() => setVerifiedOnly((v) => !v)}
              >
                <div className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                  verifiedOnly ? 'left-5' : 'left-1'
                )} />
              </div>
            </label>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={close}
                className="flex-1 h-10 rounded-full border border-border-soft text-sm text-text-muted hover:bg-bg-muted hover:text-text-main transition-all font-semibold"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={saveNewAlert}
                disabled={!newProduct || !newThreshold}
                className="flex-1 h-10 rounded-full bg-text-main text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                type="button"
              >
                Save alert
              </button>
            </div>
          </div>
        </RouteDialog>

        <ConfirmDialog
          dialogId="delete-alert"
          title="Remove alert"
          description={`You'll stop receiving updates for "${activeAlert?.productName ?? 'this item'}".`}
          confirmLabel="Remove alert"
          variant="primary"
          onConfirm={() => { if (activeAlertId) deleteAlert(activeAlertId); }}
        />
      </div>
    </div>
  );
}