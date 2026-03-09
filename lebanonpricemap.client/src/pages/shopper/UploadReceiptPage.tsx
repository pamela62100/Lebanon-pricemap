import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UploadHistoryCard } from '@/components/cards/UploadHistoryCard';
import { UploadSuccessDialog } from '@/components/dialogs/UploadSuccessDialog';
import { getEnrichedPriceEntries } from '@/api/mockData';
import { useAuthStore } from '@/store/useAuthStore';

export function UploadReceiptPage() {
  const user = useAuthStore(s => s.user);
  const [showSuccess, setShowSuccess] = useState(false);
  const entries = useMemo(() => getEnrichedPriceEntries().filter(e => e.submittedBy === (user?.id ?? '')), [user?.id]);

  const handleUpload = () => setShowSuccess(true);

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 px-6 py-12 md:px-12 md:py-16 animate-page">

      {/* Upload Zone */}
      <div className="flex-1">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-primary" />
            <p className="text-overline tracking-[0.4em]">Community_Intelligence</p>
          </div>
          <h1 className="text-5xl font-display text-text-main leading-none mb-4">Data_Submission</h1>
          <p className="text-lg text-text-sub font-medium leading-relaxed max-w-lg">Help the network by submitting receipts or shelf prices for automated verification.</p>
        </div>

        <div
          onClick={handleUpload}
          className="group border border-border-primary bg-bg-surface rounded-[3rem] overflow-hidden p-16 text-center cursor-pointer transition-all hover:border-primary/40 hover:shadow-glass flex flex-col items-center justify-center min-h-[400px] relative"
        >
          <div className="w-24 h-24 bg-primary/5 rounded border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
            <span className="material-symbols-outlined text-primary text-5xl">receipt_long</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-text-main mb-4 group-hover:text-primary transition-colors">
            Initialize_Upload_Protocol
          </h2>
          <p className="text-sm text-text-sub max-w-sm mb-10 leading-relaxed font-medium">
            Drag & drop your receipt or use the camera to extract prices automatically via OCR audit.
          </p>
          <div className="flex gap-4">
            <button className="btn-primary h-12 px-8 shadow-glass">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              Browse_Dossier
            </button>
            <button className="btn-ghost h-12 px-8 border border-border-soft">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              Live_Capture
            </button>
          </div>
        </div>
      </div>

      {/* Upload History */}
      <aside className="w-full lg:w-96 shrink-0 lg:pt-[104px]">
        <div className="bg-bg-surface border border-border-primary rounded overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border-primary bg-bg-muted/5 flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-text-main flex items-center gap-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Submission_Logs
            </h2>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{entries.length} History</span>
          </div>
          <div className="p-4 flex flex-col gap-4 max-h-[600px] overflow-y-auto scrollbar-hide">
            {entries.length > 0 ? entries.map(entry => (
              <UploadHistoryCard key={entry.id} entry={entry} />
            )) : (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-text-muted/30 text-[48px] block mb-4">history</span>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-relaxed">No_Previous_Records_Found</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <UploadSuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        productName="Extracted: 14 items"
        trustPointsEarned={5}
        onViewUpload={() => setShowSuccess(false)}
        onUploadAnother={() => setShowSuccess(false)}
      />
    </div>
  );
}