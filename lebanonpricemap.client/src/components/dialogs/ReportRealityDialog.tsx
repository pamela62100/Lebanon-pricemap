import { useState, useEffect } from 'react';
import { RouteDialog } from './RouteDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useToastStore } from '@/store/useToastStore';
import { formatLBP } from '@/lib/utils';
import { MOCK_STORES } from '@/api/mockData';
import type { PowerStatus } from '@/types';

export function ReportRealityDialog() {
  const { isOpen, getParam, close } = useRouteDialog();
  const addToast = useToastStore(s => s.addToast);
  
  const dialogId = 'report-reality';
  const isVisible = isOpen(dialogId);
  const storeId = getParam('storeId');
  const type = getParam('type') as 'market' | 'fuel';

  const [rate, setRate] = useState<string>('');
  const [power, setPower] = useState<PowerStatus>('stable');
  const [isRationed, setIsRationed] = useState(false);
  const [limit, setLimit] = useState('');
  const [queue, setQueue] = useState('');

  const store = MOCK_STORES.find(s => s.id === storeId);

  useEffect(() => {
    if (isVisible && store) {
      setRate(store.internalRateLbp?.toString() || '');
      setPower(store.powerStatus || 'stable');
    }
  }, [isVisible, store]);

  if (!isVisible) return null;

  const handleSubmit = () => {
    // In a real app, this would be an API call
    console.log('Reporting Reality:', { storeId, rate, power, isRationed, limit, queue });
    addToast('Thank you! Your report helps the whole community. 🇱🇧', 'success');
    close();
  };

  return (
    <RouteDialog
      dialogId={dialogId}
      title={type === 'market' ? 'Report Store Status' : 'Fuel Station Status'}
      description={`Helping others know the reality at ${store?.name || 'this location'}.`}
    >
      <div className="space-y-8">
        {/* Internal Rate - Precision Input */}
        {type === 'market' && (
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2 block">
              Internal Exchange Rate [TASA3IR]
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 91500"
                value={rate}
                onChange={e => setRate(e.target.value)}
                className="w-full h-14 bg-bg-base border border-border-soft px-4 font-serif font-black text-xl text-text-main focus:border-primary outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary uppercase tracking-widest">LBP</span>
            </div>
            <p className="text-[9px] text-text-muted uppercase font-medium tracking-widest">
              Live cashier rate verification required.
            </p>
          </div>
        )}

        {/* Power / Fridge Status - Structural Grid */}
        {type === 'market' && (
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2 block">
              Cold-Chain Integrity [POWER]
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['stable', 'unstable', 'reported_warm'] as PowerStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setPower(status)}
                  className={`py-4 border text-[9px] font-black uppercase tracking-widest transition-all ${
                    power === status 
                      ? 'bg-text-main border-text-main text-bg-base shadow-[2px_2px_0px_#0066FF]' 
                      : 'bg-bg-surface border-border-soft text-text-muted hover:border-text-main'
                  }`}
                >
                  {status === 'stable' ? '❄️ STABLE' : status === 'unstable' ? '⚡ WEAK' : '⚠️ WARM'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fuel Specifics - Technical Toggles */}
        {type === 'fuel' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 border border-blue-500/20 bg-blue-500/5">
              <div>
                <p className="text-[10px] font-black text-text-main uppercase tracking-widest mb-1">Fuel Rationing Protocol</p>
                <p className="text-[9px] text-text-muted uppercase font-medium">Active volume limits per unit</p>
              </div>
              <button 
                onClick={() => setIsRationed(!isRationed)}
                className={`w-12 h-6 border relative transition-all ${isRationed ? 'bg-primary border-primary' : 'bg-bg-muted border-border-soft'}`}
              >
                <div className={`absolute top-px w-[20px] h-[20px] transition-all ${isRationed ? 'right-px bg-white' : 'left-px bg-text-muted'}`} />
              </button>
            </div>

            {isRationed && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2 block">
                  Volume Limit [LBP]
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2000000"
                  value={limit}
                  onChange={e => setLimit(e.target.value)}
                  className="w-full h-14 bg-bg-base border border-border-soft px-4 font-serif font-black text-xl text-text-main outline-none focus:border-primary transition-all"
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2 block">
                Queue Density [UNIT_COUNT]
              </label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={queue}
                onChange={e => setQueue(e.target.value)}
                className="w-full h-14 bg-bg-base border border-border-soft px-4 font-mono font-bold text-text-main outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="btn-consulate w-full h-16 bg-text-main text-bg-base border-text-main shadow-[4px_4px_0px_#0066FF]"
        >
          INITIALIZE_INSIGHT_DESTRUCTION
        </button>
      </div>
    </RouteDialog>
  );
}
