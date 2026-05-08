import { AdminCatalogReviewPanel } from '@/components/admin/AdminCatalogReviewPanel';

export function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Discrepancy Reports</h1>
        <p className="text-sm text-text-muted mt-0.5">Review and resolve community-reported pricing issues</p>
      </div>
      <AdminCatalogReviewPanel />
    </div>
  );
}
