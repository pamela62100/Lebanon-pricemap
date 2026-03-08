import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UploadHistoryCard } from '@/components/cards/UploadHistoryCard';
import { UploadSuccessDialog } from '@/components/dialogs/UploadSuccessDialog';
import { getEnrichedPriceEntries } from '@/api/mockData';

export function UploadReceiptPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const entries = useMemo(() => getEnrichedPriceEntries().filter(e => e.submittedBy === 'u1'), []);

  const handleUpload = () => {
    setShowSuccess(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-8">
      
      {/* Upload Zone (Left side) */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-main mb-2">Contribute Prices</h1>
          <p className="text-sm text-text-muted">Upload receipts or shelf prices to help the community.</p>
        </div>

        <div
          onClick={handleUpload}
          className="group border-2 border-dashed border-border-primary rounded-3xl p-16 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary-soft/30 hover:shadow-glass bg-bg-surface flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="w-24 h-24 bg-primary-soft rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors">Drag & drop your receipt</h2>
          <p className="text-sm text-text-muted max-w-sm mb-8">
            Supports JPG, PNG and PDF formats up to 10MB. We'll automatically extract items and prices using AI.
          </p>

          <div className="flex gap-4">
            <button className="h-12 px-6 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-hover shadow-md transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>folder_open</span>
              Browse Files
            </button>
            <button className="h-12 px-6 rounded-xl border-2 border-border-soft text-text-main font-bold flex items-center justify-center gap-2 hover:bg-bg-muted hover:border-border-primary transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
              Use Camera
            </button>
          </div>
        </div>
      </div>

      {/* Upload History (Right Side) */}
      <aside className="w-full lg:w-96 shrink-0 lg:pt-[76px]">
        <div className="bg-bg-surface border border-border-soft rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Uploads
            </h2>
          </div>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
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
