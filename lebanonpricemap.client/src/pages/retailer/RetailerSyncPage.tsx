import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ApiKeyManager } from '@/components/retailer/ApiKeyManager';
import { SyncStatusCard } from '@/components/retailer/SyncStatusCard';

const POS_SYSTEMS = [
  { name: 'Odoo', icon: 'store', desc: 'Connect your Odoo POS' },
  { name: 'QuickBooks', icon: 'receipt_long', desc: 'Sync from QuickBooks' },
  { name: 'Custom System', icon: 'settings', desc: 'Any other system' },
];

const METHODS = [
  {
    id: 'manual',
    icon: 'edit_note',
    title: 'Update manually',
    desc: 'Update prices one by one from the Products page.',
    path: '/retailer/products',
  },
  {
    id: 'csv',
    icon: 'upload_file',
    title: 'Upload a spreadsheet',
    desc: 'Export from Excel or Google Sheets and upload weekly.',
    path: '/retailer/upload',
  },
  {
    id: 'connect',
    icon: 'sync',
    title: 'Connect your system',
    desc: 'Link your POS or inventory system for automatic updates.',
    active: true,
  },
];

export function RetailerSyncPage() {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Connect your system</h1>
        <p className="text-sm text-text-muted mt-1">
          Keep your prices up to date automatically — no manual work needed.
        </p>
      </div>

      {/* How do you want to sync? */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">How would you like to update prices?</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {METHODS.map(method => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => method.path ? navigate(method.path) : undefined}
              className={`p-4 rounded-xl border text-left transition-all ${
                method.active
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20 cursor-default'
                  : 'border-border-soft bg-white hover:border-primary/30 hover:bg-bg-base cursor-pointer'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${method.active ? 'bg-primary/10' : 'bg-bg-muted'}`}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: method.active ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {method.icon}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-text-main">{method.title}</p>
                {method.active && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                )}
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{method.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Connection status */}
      <div className="bg-white border border-border-soft rounded-xl p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-main">Sync status</p>
            <p className="text-xs text-text-muted mt-0.5">Last sync activity from your connected system</p>
          </div>
        </div>
        <SyncStatusCard />
      </div>

      {/* Compatible POS systems */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Compatible systems</p>
        <div className="grid grid-cols-3 gap-3">
          {POS_SYSTEMS.map(pos => (
            <div key={pos.name} className="bg-white border border-border-soft rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-bg-muted flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-text-muted">{pos.icon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">{pos.name}</p>
                <p className="text-xs text-text-muted">{pos.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced / Connection key */}
      <div className="border border-border-soft rounded-xl overflow-hidden">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-bg-base transition-colors text-left"
        >
          <div>
            <p className="text-sm font-semibold text-text-main">Advanced: Connection key</p>
            <p className="text-xs text-text-muted mt-0.5">For custom or developer-managed integrations</p>
          </div>
          <span className="material-symbols-outlined text-[18px] text-text-muted">
            {showAdvanced ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {showAdvanced && (
          <div className="px-5 pb-5 border-t border-border-soft bg-white">
            <p className="text-xs text-text-muted mt-4 mb-4">
              Your connection key is used to authenticate your system. Share it only with your IT team.
            </p>
            <ApiKeyManager />
          </div>
        )}
      </div>
    </div>
  );
}
