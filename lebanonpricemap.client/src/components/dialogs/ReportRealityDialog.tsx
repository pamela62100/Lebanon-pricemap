import { useState, useEffect } from 'react';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useToastStore } from '@/store/useToastStore';
import { MOCK_STORES } from '@/api/mockData';

export function ReportRealityDialog() {
  const { isOpen, getParam, close } = useRouteDialog();
  const addToast = useToastStore((state) => state.addToast);

  const dialogId = 'report-reality';
  const isVisible = isOpen(dialogId);
  const storeId = getParam('storeId');
  const reportType = getParam('type') as 'market' | 'fuel';

  const [isFuelRationed, setIsFuelRationed] = useState(false);
  const [queueCount, setQueueCount] = useState('');

  const store = MOCK_STORES.find((currentStore) => currentStore.id === storeId);

  useEffect(() => {
    if (!isVisible) {
      setIsFuelRationed(false);
      setQueueCount('');
    }
  }, [isVisible]);

  const handleSubmit = () => {
    addToast('Thanks for the update.');
    close();
  };

  if (!isVisible) return null;

  return (
    <RouteDialog
      dialogId={dialogId}
      title={reportType === 'fuel' ? 'Report fuel station status' : 'Report store status'}
      description={
        reportType === 'fuel'
          ? `Share what is happening now at ${store?.name ?? 'this station'}.`
          : `Share what is happening now at ${store?.name ?? 'this store'}.`
      }
      size="md"
    >
      <div className="space-y-6">
        {reportType === 'fuel' ? (
          <>
            <div className="rounded-3xl border border-border-soft bg-bg-surface px-5 py-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-text-main">Fuel rationing</p>
                <p className="text-sm text-text-muted mt-1">
                  Turn this on if there is a spending or volume limit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFuelRationed((value) => !value)}
                className={`relative w-16 h-9 rounded-full transition-all shrink-0 ${
                  isFuelRationed ? 'bg-text-main' : 'bg-bg-muted border border-border-soft'
                }`}
              >
                <span
                  className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-sm transition-all ${
                    isFuelRationed ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-muted mb-3">
                Approximate queue size
              </label>
              <input
                value={queueCount}
                onChange={(event) => setQueueCount(event.target.value)}
                placeholder="e.g. 15"
                className="w-full h-14 rounded-3xl border border-border-soft bg-bg-surface px-5 text-xl text-text-main placeholder:text-text-muted outline-none focus:border-text-main transition-all"
              />
            </div>
          </>
        ) : null}

        <button
          onClick={handleSubmit}
          className="w-full h-14 rounded-full bg-text-main text-white text-lg font-semibold hover:opacity-95 transition-all"
          type="button"
        >
          Submit Update
        </button>
      </div>
    </RouteDialog>
  );
}