import { motion } from 'framer-motion';
import { getEnrichedProducts } from '@/api/mockData';
import { formatLBP, getCountdown } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';

export function PromotionsPage() {
  const navigate = useNavigate();
  const { open, getParam } = useRouteDialog();
  const products = getEnrichedProducts().slice(0, 3);
  
  // Create mock promotions
  const promos = [
    { p: products[0], price: 85000, old: 105000, end: new Date(Date.now() + 86400000 * 2) },
    { p: products[1], price: 420000, old: 480000, end: new Date(Date.now() + 86400000 * 1) },
    { p: products[2], price: 65000, old: 75000, end: new Date(Date.now() - 86400000 * 3) } // Expired
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto flex flex-col gap-8">
      
      <div className="flex items-center justify-between pb-6 border-b border-border-soft">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Active Promotions</h1>
          <p className="text-sm text-text-muted mt-1">Manage discounts to attract more shoppers</p>
        </div>
        <button onClick={() => navigate('/retailer')} className="h-11 px-6 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary-hover  transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          New Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {promos.map((promo, i) => {
          const isExpired = promo.end.getTime() < Date.now();
          const countdown = getCountdown(promo.end.toISOString());

          return (
            <div key={i} className={`bg-bg-surface border rounded-3xl p-6 shadow-card flex flex-col gap-4 relative overflow-hidden transition-all ${isExpired ? 'border-border-soft opacity-60' : 'border-primary/30 hover:shadow-glass hover:border-primary'}`}>
              
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
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{promo.p.category}</p>
                <h3 className="text-lg font-bold text-text-main mb-1 line-clamp-1">{promo.p.name}</h3>
                <p className="text-sm text-text-muted">{promo.p.unit}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-border-soft flex items-end justify-between relative z-10">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Promo Price</p>
                  <p className="text-2xl font-display font-bold text-[var(--status-pending-text)]">{formatLBP(promo.price)}</p>
                </div>
                <p className="text-sm text-text-muted line-through mb-1">{formatLBP(promo.old)}</p>
              </div>

              <div className="flex gap-2 mt-4 relative z-10">
                <button onClick={() => navigate(`/retailer/price/${promo.p.id}/edit`)} className="flex-1 h-10 rounded-xl bg-bg-muted text-sm font-semibold text-text-main hover:bg-border-soft transition-colors cursor-pointer">
                  {isExpired ? 'Renew' : 'Edit'}
                </button>
                {!isExpired && (
                  <button
                    onClick={() => open('delete-promo', { id: i.toString() })}
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

      {/* URL-Driven Retailer Dialogs */}
      <ConfirmDialog
        dialogId="delete-promo"
        title="Remove Promotion"
        description="Are you sure you want to end this promotion early? The price will revert to the standard retail rate immediately."
        confirmLabel="Remove Promo"
        variant="warning"
        onConfirm={() => {
          console.log('Promotion removed:', getParam('id'));
        }}
      />
    </motion.div>
  );
}
