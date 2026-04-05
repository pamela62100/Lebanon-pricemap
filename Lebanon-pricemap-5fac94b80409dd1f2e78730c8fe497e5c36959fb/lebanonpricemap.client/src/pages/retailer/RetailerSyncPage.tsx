import { motion } from 'framer-motion';
import { ApiKeyManager } from '@/components/retailer/ApiKeyManager';
import { SyncStatusCard } from '@/components/retailer/SyncStatusCard';

export function RetailerSyncPage() {
  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-text-main">API Sync & Integration</h1>
        <p className="text-text-muted text-sm mt-1">Connect your POS or inventory system for automatic, real-time price updates</p>
      </motion.div>

      {/* Sync method cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: 'edit', title: 'Manual Entry', desc: 'Update prices one by one. Best for stores with under 20 products.', active: false },
          { icon: 'upload_file', title: 'CSV Upload', desc: 'Upload a spreadsheet weekly. Ideal for medium stores with an Excel price list.', active: false },
          { icon: 'api', title: 'API Sync', desc: 'Connect your POS system directly. Real-time, zero manual work. Active on your account.', active: true },
        ].map(method => (
          <motion.div key={method.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border transition-all ${method.active ? 'border-primary bg-primary/5' : 'border-border-soft bg-bg-surface opacity-70'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${method.active ? 'bg-primary/15' : 'bg-bg-muted'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: method.active ? 'var(--primary)' : 'var(--text-muted)' }}>{method.icon}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-text-main">{method.title}</p>
              {method.active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">ACTIVE</span>}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{method.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* API key manager */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-3 bg-bg-surface rounded-2xl border border-border-soft p-6">
          <h2 className="text-base font-bold text-text-main mb-5">API Credentials</h2>
          <ApiKeyManager />
        </motion.div>

        {/* Sync log */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="col-span-2">
          <h2 className="text-base font-bold text-text-main mb-5">Sync Log</h2>
          <SyncStatusCard />
        </motion.div>
      </div>

      {/* Integration tips */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-bg-surface rounded-2xl border border-border-soft p-6">
        <h2 className="text-base font-bold text-text-main mb-4">Integration checklist</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { done: true,  text: 'Generate your API key above' },
            { done: true,  text: 'Whitelist our IP: 185.210.144.0/24' },
            { done: false, text: 'Configure your POS to POST on price change' },
            { done: false, text: 'Test with a single product first' },
            { done: false, text: 'Schedule a full catalog sync for off-peak hours' },
            { done: true,  text: 'Review the rate limits and error codes' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-green-500/15' : 'bg-bg-muted border border-border-soft'}`}>
                {item.done && <span className="material-symbols-outlined text-green-500" style={{ fontSize: '12px' }}>check</span>}
              </div>
              <p className={`text-sm ${item.done ? 'text-text-main' : 'text-text-muted'}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
