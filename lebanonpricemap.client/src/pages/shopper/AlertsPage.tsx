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
    id: 'a1',
    productId: 'p5',
    productName: 'Diesel Fuel per Liter',
    thresholdLbp: 105000,
    regions: ['Beirut', 'Metn'],
    verifiedOnly: true,
    active: true,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'a2',
    productId: 'p1',
    productName: 'Whole Milk TL 1L',
    thresholdLbp: 120000,
    regions: ['Beirut'],
    verifiedOnly: false,
    active: true,
    createdAt: '2025-03-03T00:00:00Z',
  },
  {
    id: 'a3',
    productId: 'p2',
    productName: 'Eggs 30 Pack',
    thresholdLbp: 380000,
    regions: ['Beirut', 'Sidon'],
    verifiedOnly: true,
    active: false,
    createdAt: '2025-02-20T00:00:00Z',
  },
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const { open, close, getParam } = useRouteDialog();
  const [newProduct, setNewProduct] = useState('');
  const [newThreshold, setNewThreshold] = useState<number | ''>('');
  const [newRegions, setNewRegions] = useState<string[]>(['Beirut']);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const addToast = useToastStore((state) => state.addToast);

  const activeAlertId = getParam('id');
  const activeAlert = alerts.find((alert) => alert.id === activeAlertId);

  const toggleActive = (id: string) => {
    setAlerts((previousAlerts) =>
      previousAlerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((previousAlerts) => previousAlerts.filter((alert) => alert.id !== id));
    addToast('Alert deleted', 'info');
    close();
  };

  const saveNewAlert = () => {
    const product = MOCK_PRODUCTS.find((item) => item.id === newProduct);
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

    setAlerts((previousAlerts) => [alert, ...previousAlerts]);
    close();
    setNewProduct('');
    setNewThreshold('');
    setNewRegions(['Beirut']);
    setVerifiedOnly(true);
    addToast('Price alert created!', 'success');
  };

  const activeCount = alerts.filter((alert) => alert.active).length;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col gap-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
              Price alerts
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-text-main tracking-tighter">
              Stay updated.
            </h1>
            <p className="text-sm font-medium text-text-muted mt-4 opacity-60">
              <span className="text-text-main font-bold font-data">{activeCount}</span> active
              alerts out of {alerts.length}
            </p>
          </div>

          <button
            onClick={() => open('new-alert')}
            className="btn-primary h-14 px-8 rounded-2xl shadow-lg shadow-text-main/10"
          >
            <span className="material-symbols-outlined">add</span>
            Create Alert
          </button>
        </header>

        <section className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all',
                  !alert.active && 'opacity-40 grayscale-[0.8]'
                )}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0 group-hover:bg-bg-base transition-colors">
                    <span className="material-symbols-outlined text-2xl">notifications</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-text-main truncate">{alert.productName}</h3>
                      {alert.verifiedOnly && (
                        <div className="px-2 py-0.5 bg-text-main/10 text-text-main text-[8px] font-bold uppercase tracking-widest rounded-full">
                          Verified only
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      <span>
                        Below{' '}
                        <span className="text-text-main font-data text-xs">
                          {alert.thresholdLbp.toLocaleString()}
                        </span>{' '}
                        LBP
                      </span>
                      <span className="opacity-20">•</span>
                      <span>{alert.regions.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(alert.id)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all',
                      alert.active
                        ? 'bg-text-main text-white shadow-lg shadow-text-main/10'
                        : 'bg-bg-muted text-text-muted hover:text-text-main'
                    )}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>

                  <button
                    onClick={() => open('delete-alert', { id: alert.id })}
                    className="w-11 h-11 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {alerts.length === 0 && (
            <EmptyState
              icon="notifications_off"
              title="No alerts yet"
              subtitle="Create a price alert and WenArkhass will notify you when prices drop."
            />
          )}
        </section>

        <RouteDialog
          dialogId="new-alert"
          title="Create a price alert"
          description="Choose a product, set your target price, and select the regions you want to monitor."
        >
          <div className="space-y-10 py-4">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                Product
              </p>

              <div className="relative group">
                <select
                  value={newProduct}
                  onChange={(event) => setNewProduct(event.target.value)}
                  className="w-full h-14 pl-5 pr-12 rounded-2xl bg-bg-muted border-none text-sm font-bold text-text-main focus:ring-2 focus:ring-text-main/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a product...</option>
                  {MOCK_PRODUCTS.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  unfold_more
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center">
                Target price (LBP)
              </p>
              <LBPInput value={newThreshold} onChange={(value) => setNewThreshold(value)} autoFocus />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                Regions
              </p>

              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() =>
                      setNewRegions((previousRegions) =>
                        previousRegions.includes(region)
                          ? previousRegions.filter((item) => item !== region)
                          : [...previousRegions, region]
                      )
                    }
                    className={cn(
                      'px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border',
                      newRegions.includes(region)
                        ? 'bg-text-main text-white border-text-main'
                        : 'bg-white text-text-muted border-border-soft hover:border-text-main/20'
                    )}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-muted/50 border border-border-soft">
              <label className="flex items-center gap-4 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(event) => setVerifiedOnly(event.target.checked)}
                    className="w-6 h-6 rounded-lg bg-white border-border-soft text-text-main focus:ring-0 cursor-pointer"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-main">
                    Verified data only
                  </p>
                  <p className="text-[10px] text-text-muted font-medium mt-1 leading-tight opacity-60">
                    Only use trusted and verified price updates for this alert.
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={saveNewAlert}
              disabled={!newProduct || !newThreshold}
              className="btn-primary w-full h-14 rounded-2xl shadow-xl shadow-text-main/10"
            >
              <span className="material-symbols-outlined">notifications_active</span>
              Save Alert
            </button>
          </div>
        </RouteDialog>

        <ConfirmDialog
          dialogId="delete-alert"
          title="Delete alert"
          description={`Are you sure you want to stop tracking ${activeAlert?.productName}?`}
          confirmLabel="Delete Alert"
          variant="danger"
          onConfirm={() => activeAlertId && deleteAlert(activeAlertId)}
        />
      </div>
    </div>
  );
}