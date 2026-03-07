import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getEnrichedPriceEntries } from '@/api/mockData';
import { MapComponent } from '@/components/ui/MapComponent';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All items');
  
  const allEntries = useMemo(() => getEnrichedPriceEntries(), []);
  
  const filteredEntries = useMemo(() => {
    let results = [...allEntries];
    if (query) {
      results = results.filter(e => 
        e.product?.name.toLowerCase().includes(query.toLowerCase()) || 
        e.store?.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (activeCategory !== 'All items') {
      results = results.filter(e => e.product?.category.toLowerCase().includes(activeCategory.toLowerCase().replace('ies', 'y')));
    }
    return results;
  }, [allEntries, query, activeCategory]);

  // Lebanon coordinates
  const LEBANON_CENTER: [number, number] = [33.8938, 35.5018];

  const mapMarkers = useMemo(() => {
    return filteredEntries.map(e => ({
      position: [33.89 + (Math.random() - 0.5) * 0.5, 35.50 + (Math.random() - 0.5) * 0.5] as [number, number],
      label: e.product?.name || 'Unknown',
      price: e.priceLbp.toLocaleString(),
      category: e.product?.category
    }));
  }, [filteredEntries]);

  return (
    <div className="flex w-full h-[calc(100dvh-64px)] overflow-hidden bg-bg-base relative">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-[400px] h-full bg-bg-surface border-r border-border-soft flex flex-col z-20 shadow-xl overflow-hidden focus-within:ring-0">
        
        {/* Sidebar Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>map</span>
              </div>
              <h1 className="text-xl font-bold text-text-main tracking-tight font-display">Lebanon Price Map</h1>
            </div>
            <div className="bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[var(--status-pending-text)]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-pending-text)] animate-pulse" />
              Golden Hour
            </div>
          </div>
          
          <p className="text-sm text-text-muted mb-8 leading-relaxed">
            Essential goods pricing across the Mediterranean coast.
          </p>

          {/* Search Bar */}
          <div className="relative group mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>search</span>
            </div>
            <input 
              type="text"
              placeholder="Search product or region..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 bg-bg-muted border border-transparent rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-bg-surface focus:border-primary focus:shadow-[0_0_0_4px_var(--primary-soft)] outline-none transition-all placeholder:text-text-muted"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {['All items', 'Groceries', 'Fuel'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shadow-sm",
                  activeCategory === cat 
                    ? "bg-primary text-white border-primary shadow-primary/20" 
                    : "bg-bg-surface text-text-sub border-border-soft hover:border-border-primary"
                )}
              >
                <div className="flex items-center gap-2">
                  {cat === 'Groceries' && <span className="material-symbols-outlined" style={{ fontSize: '16px'}}>shopping_cart</span>}
                  {cat === 'Fuel' && <span className="material-symbols-outlined" style={{ fontSize: '16px'}}>local_gas_station</span>}
                  {cat}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto px-6 scrollbar-thin">
           <div className="flex flex-col gap-4 pb-8">
              {filteredEntries.map((entry, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={entry.id}
                  className={cn(
                    "group p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden",
                    idx === 2 ? "border-primary bg-primary-soft/5" : "bg-bg-surface border-border-soft hover:border-border-primary hover:shadow-md"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{entry.product?.name}</h3>
                      <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        {entry.store?.name}, {entry.store?.district}
                      </p>
                    </div>
                    <div className="text-right">
                       <p className={cn(
                         "text-sm font-bold font-display",
                         idx === 2 ? "text-primary" : "text-[var(--status-pending-text)]"
                       )}>
                         LBP {entry.priceLbp.toLocaleString()}
                       </p>
                       <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontSize: '14px' }}>schedule</span>
                          <span className="text-[10px] font-bold text-text-muted uppercase">2h ago</span>
                          <span className={cn(
                            "text-[10px] font-bold ml-1",
                            idx === 1 ? "text-[var(--status-flagged-text)]" : "text-[var(--status-verified-text)]"
                          )}>
                            {idx === 1 ? "+5%" : "-2%"}
                          </span>
                       </div>
                    </div>
                  </div>
                  
                  {idx === 2 && (
                    <div className="mt-3 flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>verified</span>
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified Source</span>
                    </div>
                  )}
                </motion.div>
              ))}
              
              <button className="py-8 text-xs font-bold text-text-muted flex flex-col items-center gap-2 hover:text-primary transition-colors group">
                <span className="material-symbols-outlined group-hover:animate-bounce">expand_more</span>
                Load more results for your area
              </button>
           </div>
        </div>

        {/* Sidebar Footer (User Profile) */}
        <div className="p-6 bg-bg-muted/30 border-t border-border-soft flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-soft border border-primary/20 overflow-hidden flex items-center justify-center">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Habib`} alt="Habib" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-main">Habib's Market</h4>
                <p className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Contributor</p>
              </div>
           </div>
           <button className="w-10 h-10 rounded-xl bg-bg-surface border border-border-soft flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
           </button>
        </div>
      </aside>

      {/* MAIN MAP AREA */}
      <main className="flex-1 relative h-full">
        
        {/* Breadcrumb Pill Overlay */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
           <div className="bg-bg-surface/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl px-6 py-3 flex items-center gap-3">
              <span className="text-xs font-medium text-text-muted">Lebanon</span>
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '14px' }}>chevron_right</span>
              <span className="text-xs font-medium text-text-muted">Mount Lebanon</span>
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '14px' }}>chevron_right</span>
              <span className="text-xs font-bold text-primary">All Municipalities</span>
           </div>
        </div>

        {/* Interactive Map */}
        <div className="w-full h-full bg-slate-300">
           <MapComponent 
             center={LEBANON_CENTER} 
             zoom={9} 
             markers={mapMarkers}
           />
        </div>

        {/* Floating Map Controls (Right) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
           <div className="flex flex-col bg-bg-surface/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden">
             <button className="w-12 h-12 flex items-center justify-center text-text-main hover:bg-bg-muted transition-colors border-b border-border-soft">
               <span className="material-symbols-outlined">add</span>
             </button>
             <button className="w-12 h-12 flex items-center justify-center text-text-main hover:bg-bg-muted transition-colors">
               <span className="material-symbols-outlined">remove</span>
             </button>
           </div>
           
           <button className="w-12 h-12 bg-bg-surface/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl flex items-center justify-center text-text-main hover:text-primary transition-all">
             <span className="material-symbols-outlined">my_location</span>
           </button>
           
           <button className="w-12 h-12 bg-bg-surface/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl flex items-center justify-center text-text-main hover:text-primary transition-all">
             <span className="material-symbols-outlined">layers</span>
           </button>
        </div>

        {/* Regional Overview Overlay (Bottom Right) */}
        <div className="absolute bottom-10 right-10 z-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-bg-surface/90 backdrop-blur-lg border border-white/50 shadow-2xl rounded-[32px] p-8 w-80"
           >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-text-muted tracking-widest uppercase">Regional Overview</h3>
                <div className="w-2 h-2 rounded-full bg-[var(--status-verified-text)]" />
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-sub">Market Volatility</span>
                    <span className="text-sm font-bold text-[var(--status-flagged-text)]">Low</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-sub">Average Bread Cost</span>
                    <span className="text-sm font-bold text-text-main">LBP 62k</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-sub">Updates (Last 24h)</span>
                    <span className="text-sm font-bold text-text-main">1,429</span>
                 </div>
              </div>
           </motion.div>
        </div>

      </main>

    </div>
  );
}
