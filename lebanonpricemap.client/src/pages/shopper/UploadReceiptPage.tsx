import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UploadHistoryCard } from '@/components/cards/UploadHistoryCard';
import { UploadSuccessDialog } from '@/components/dialogs/UploadSuccessDialog';
import { getEnrichedPriceEntries } from '@/api/mockData';

export function UploadReceiptPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const entries = useMemo(() => getEnrichedPriceEntries().filter(e => e.submittedBy === 'u1'), []);

  const handleUpload = () => setShowSuccess(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6 p-6">

      {/* Upload Zone */}
      <div className="flex-1">
        <div className="mb-6">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Contribute</p>
          <h1 className="text-3xl font-black text-text-main mb-1">Upload a Price</h1>
          <p className="text-sm text-text-muted">Help the community by submitting receipts or shelf prices.</p>
        </div>

        <div
          onClick={handleUpload}
          className="group border-2 border-dashed border-border-primary rounded-2xl p-14 text-center cursor-pointer transition-all hover:border-primary hover:bg-bg-surface flex flex-col items-center justify-center min-h-[380px]"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
          </div>
          <h2 className="text-xl font-black text-text-main mb-2 group-hover:text-primary transition-colors">Drag & drop your receipt</h2>
          <p className="text-sm text-text-muted max-w-sm mb-7">
            Supports JPG, PNG and PDF up to 10MB. We'll extract items and prices automatically.
          </p>
          <div className="flex gap-3">
            <button className="h-11 px-6 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:opacity-90 shadow-md transition-all text-sm">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              Browse Files
            </button>
            <button className="h-11 px-6 rounded-xl border border-border-soft text-text-main font-bold flex items-center gap-2 hover:bg-bg-muted transition-all text-sm">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              Use Camera
            </button>
          </div>
        </div>
      </div>

      {/* Upload History */}
      <aside className="w-full lg:w-88 shrink-0 lg:pt-[72px]">
        <div className="bg-bg-surface border border-border-soft rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-black text-text-main flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary text-[18px]">history</span>
            Recent Uploads
          </h2>
          <div className="flex flex-col gap-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-hide">
            {entries.length > 0 ? entries.map(entry => (
              <UploadHistoryCard key={entry.id} entry={entry} />
            )) : (
              <p className="text-sm text-text-muted text-center py-8">No recent uploads found.</p>
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
    </motion.div>
  );
}