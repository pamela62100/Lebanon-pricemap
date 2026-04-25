import { useState, useEffect, useRef } from 'react';
import { UploadHistoryCard } from '@/components/cards/UploadHistoryCard';
import { UploadSuccessDialog } from '@/components/dialogs/UploadSuccessDialog';
import { pricesApi } from '@/api/prices.api';
import { useAuthStore } from '@/store/useAuthStore';

export function UploadReceiptPage() {
  const user = useAuthStore(s => s.user);
  const [showSuccess, setShowSuccess] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    pricesApi.getByUser(user.id)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load submissions:', err);
      });
  }, [user?.id]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setShowSuccess(true);
      e.target.value = '';
    }
  };

  const handleUpload = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 lg:px-8 py-8 animate-page">

      {/* Upload Zone */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-main mb-1">Submit a Price</h1>
          <p className="text-sm text-text-muted">
            Upload a receipt or enter a shelf price to help the community track live prices.
          </p>
        </div>

        <div
          onClick={handleUpload}
          className="group border-2 border-dashed border-border-primary bg-bg-surface rounded-2xl overflow-hidden p-12 text-center cursor-pointer transition-all hover:border-primary/40 hover:bg-bg-muted/30 flex flex-col items-center justify-center min-h-[360px]"
        >
          <div className="w-16 h-16 bg-primary/5 rounded-2xl border border-primary/15 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-4xl">receipt_long</span>
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">
            Upload Receipt or Photo
          </h2>
          <p className="text-sm text-text-muted max-w-sm mb-8 leading-relaxed">
            Drag & drop your receipt or use the camera to extract prices automatically.
          </p>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileSelected}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelected}
            />
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="btn-primary h-10 px-6 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              Browse Files
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
              className="btn-ghost h-10 px-6 text-sm border border-border-soft"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              Take Photo
            </button>
          </div>
        </div>
      </div>

      {/* Upload History */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-main">My Submissions</h2>
            <span className="text-xs font-medium text-text-muted">{entries.length} total</span>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-[520px] overflow-y-auto">
            {entries.length > 0 ? entries.map(entry => (
              <UploadHistoryCard key={entry.id} entry={entry} />
            )) : (
              <div className="py-10 text-center">
                <span className="material-symbols-outlined text-text-muted/30 text-5xl block mb-3">history</span>
                <p className="text-sm text-text-muted">No submissions yet</p>
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
