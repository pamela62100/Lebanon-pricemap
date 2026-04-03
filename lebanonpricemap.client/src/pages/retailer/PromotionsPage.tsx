import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatLBP, getCountdown } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { storesApi } from '@/api/stores.api';
import { catalogApi } from '@/api/catalog.api';
import { useToastStore } from '@/store/useToastStore';

interface PromoEntry {
  id: string;
  productId: string;
  officialPriceLbp: number;
  promoPriceLbp?: number;
  promoEndsAt?: string | null;
  product?: { name: string; category?: string; unit?: string };
}

export function PromotionsPage() {
  const navigate = useNavigate();
  const { open, getParam } = useRouteDialog();
  const addToast = useToastStore(s => s.addToast);
  const [promos, setPromos] = useState<PromoEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storesApi.getMine().then(async (res) => {
      const store = res.data?.data ?? res.data;
      if (store?.id) {
        const catRes = await catalogApi.getByStore(store.id);
        const data = catRes.data?.data ?? catRes.data;
        const all = Array.isArray(data) ? data : [];
        setPromos(all.filter((e: PromoEntry) => e.promoPriceLbp && e.promoPriceLbp > 0));
      }
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const activeId = getParam('id');

  const removePromo = async () => {
    if (!activeId) return;
    try {
      await catalogApi.update(activeId, { isPromotion: false, promoPriceLbp: undefined, promoEndsAt: null });
      setPromos(prev => prev.filter(p => p.id !== activeId));
      addToast('Promotion removed', 'success');
    } catch {
      addToast('Failed to remove promotion');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-8 py-8 flex flex-col gap-8">

      <div className="flex items-center justify-between pb-6 border-b border-border-soft">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Active Promotions</h1>
          <p className="text-sm text-text-muted mt-1">Manage discounts to attract more shoppers</p>
        </div>
        <button onClick={() => navigate('/retailer/products')} className="h-11 px-6 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          New Promotion
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-bg-muted animate-pulse" />)}
        </div>
      ) : promos.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '48px' }}>local_offer</span>
          <p className="text-base font-bold text-text-main">No active promotions</p>
          <p className="text-sm text-text-muted">Edit a catalog item and set a promo price to create a promotion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const isExpired = promo.promoEndsAt ? new Date(promo.promoEndsAt).getTime() < Date.now() : false;
            const countdown = promo.promoEndsAt ? getCountdown(promo.promoEndsAt) : 'No end date';

            return (
              <div key={promo.id} className={`bg-bg-surface border rounded-3xl p-6 shadow-card flex flex-col gap-4 relative overflow-hidden transition-all ${isExpired ? 'border-border-soft opacity-60' : 'border-primary/30 hover:shadow-glass hover:border-primary'}`}>
                {!isExpired && (
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-soft rounded-full blur-2xl pointer-events-none" />
                )}
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-bg-muted flex items-center justify-center border border-border-soft">
                    <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '28px' }}>shopping_bag</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isExpired ? 'bg-bg-muted text-text-sub' : 'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] shadow-card'}`}>
                    {isExpired ? 'Expired' : countdown}
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{promo.product?.category ?? '—'}</p>
                  <h3 className="text-lg font-bold text-text-main mb-1 line-clamp-1">{promo.product?.name ?? promo.productId}</h3>
                  <p className="text-sm text-text-muted">{promo.product?.unit}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border-soft flex items-end justify-between relative z-10">
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Promo Price</p>
                    <p className="text-2xl font-display font-bold text-[var(--status-pending-text)]">{formatLBP(promo.promoPriceLbp ?? 0)}</p>
                  </div>
                  <p className="text-sm text-text-muted line-through mb-1">{formatLBP(promo.officialPriceLbp)}</p>
                </div>
                <div className="flex gap-2 mt-4 relative z-10">
                  <button onClick={() => navigate('/retailer/products')} className="flex-1 h-10 rounded-xl bg-bg-muted text-sm font-semibold text-text-main hover:bg-border-soft transition-colors cursor-pointer">
                    {isExpired ? 'Renew' : 'Edit'}
                  </button>
                  {!isExpired && (
                    <button
                      onClick={() => open('delete-promo', { id: promo.id })}
                      className="h-10 px-4 rounded-xl border border-border-soft text-text-sub hover:bg-[var(--status-flagged-bg)] hover:text-[var(--status-flagged-text)] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        dialogId="delete-promo"
        title="Remove Promotion"
        description="Are you sure you want to end this promotion early? The price will revert to the standard retail rate immediately."
        confirmLabel="Remove Promo"
        variant="warning"
        onConfirm={removePromo}
      />
    </motion.div>
  );
}
