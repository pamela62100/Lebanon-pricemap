import { motion } from 'framer-motion';
import { CsvUploadZone } from '@/components/retailer/CsvUploadZone';
import { useNavigate } from 'react-router-dom';

export function BulkUploadPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate('/retailer/products')} className="flex items-center gap-1 text-text-sub hover:text-primary transition-colors text-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Products
        </button>
        <div>
          <h1 className="text-3xl font-black text-text-main">CSV Bulk Upload</h1>
          <p className="text-text-muted text-sm mt-1">Import your price list in bulk — ideal for weekly updates</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-bg-surface rounded-2xl border border-border-soft p-8">
        <CsvUploadZone />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 rounded-xl bg-bg-surface border border-border-soft flex flex-col gap-3">
        <p className="text-sm font-bold text-text-main">Format requirements</p>
        <ul className="text-sm text-text-muted flex flex-col gap-1.5">
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Column headers must be: <code className="text-xs bg-bg-muted px-1.5 py-0.5 rounded font-mono">product_name, barcode, price_lbp, unit</code></li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> <code className="text-xs bg-bg-muted px-1.5 py-0.5 rounded font-mono">product_name</code> and <code className="text-xs bg-bg-muted px-1.5 py-0.5 rounded font-mono">price_lbp</code> are required; others optional</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Prices must be whole numbers in LBP (no currency symbol)</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Max 500 rows per upload</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">·</span> Imported prices go to <em>pending</em> status and are reviewed within 2 hours</li>
        </ul>
      </motion.div>
    </div>
  );
}
