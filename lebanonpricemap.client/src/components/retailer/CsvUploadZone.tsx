import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/store/useToastStore';

interface ParsedRow {
  product_name: string;
  barcode: string;
  price_lbp: string;
  unit: string;
  valid: boolean;
  error?: string;
}

const TEMPLATE_CSV = `product_name,barcode,price_lbp,unit
Whole Milk TL 1L,6221012345001,128000,1L
Eggs 30 Pack,6221012345002,410000,30 pcs
Bread Standard Loaf,6221012345003,89000,loaf
`;

const STEPS = ['Download Template', 'Upload File', 'Review & Edit', 'Confirm Import'];

export function CsvUploadZone() {
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore(s => s.addToast);

  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split('\n').filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const required = ['product_name', 'price_lbp'];
    const hasMissing = required.filter(r => !headers.includes(r));
    if (hasMissing.length > 0) {
      addToast(`CSV missing columns: ${hasMissing.join(', ')}`, 'error');
      return;
    }
    const parsed: ParsedRow[] = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] ?? ''; });
      const price = Number(row['price_lbp']?.replace(/,/g, ''));
      const valid = row['product_name']?.length > 0 && !isNaN(price) && price > 0;
      return {
        product_name: row['product_name'] ?? '',
        barcode: row['barcode'] ?? '',
        price_lbp: row['price_lbp'] ?? '',
        unit: row['unit'] ?? '',
        valid,
        error: !valid ? 'Missing name or invalid price' : undefined,
      };
    });
    setRows(parsed);
    setStep(2);
  }, [addToast]);

  const onFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => { if (e.target?.result) parseCSV(e.target.result as string); };
    reader.readAsText(file);
    setStep(1);
  }, [parseCSV]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) onFile(file);
    else addToast('Please upload a .csv file', 'error');
  }, [onFile, addToast]);

  const validRows = rows.filter(r => r.valid);

  return (
    <div className="flex flex-col gap-6">
      {/* Steps */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                i < step ? 'bg-primary border-primary text-white'
                : i === step ? 'border-primary text-primary bg-primary/10'
                : 'border-border-soft text-text-muted bg-bg-base'
              )}>
                {i < step ? <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span> : i + 1}
              </div>
              <p className={cn('text-[10px] font-semibold whitespace-nowrap', i === step ? 'text-primary' : 'text-text-muted')}>{s}</p>
            </div>
            {i < STEPS.length - 1 && <div className={cn('flex-1 h-0.5 mb-4 mx-2 transition-all', i < step ? 'bg-primary' : 'bg-border-soft')} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Download template */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-4 items-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>download</span>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-text-main">Download the CSV template</p>
              <p className="text-sm text-text-muted mt-1">Fill your prices into the template, then upload it in the next step.</p>
            </div>
            <div className="w-full max-w-md bg-bg-muted rounded-xl p-4 font-mono text-xs text-text-muted border border-border-soft">
              {TEMPLATE_CSV}
            </div>
            <div className="flex gap-3">
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_CSV)}`}
                download="rakis_price_template.csv"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Download Template
              </a>
              <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-border-soft text-sm text-text-sub hover:border-primary hover:text-primary transition-all">
                Skip — I have a file →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={cn('flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed cursor-pointer transition-all',
                dragging ? 'border-primary bg-primary/5' : 'border-border-soft hover:border-primary/50 hover:bg-bg-surface'
              )}
            >
              <span className="material-symbols-outlined text-text-muted mb-3" style={{ fontSize: '48px' }}>upload_file</span>
              <p className="text-base font-bold text-text-main">Drag & drop your CSV here</p>
              <p className="text-sm text-text-muted mt-1">or click to browse</p>
              <p className="text-xs text-text-muted mt-3">Accepts .csv files only</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          </motion.div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-text-main">{rows.length} rows parsed — {validRows.length} valid, {rows.length - validRows.length} with errors</p>
                <p className="text-sm text-text-muted">Review before importing. You can edit prices directly.</p>
              </div>
              <button onClick={() => { setRows([]); setStep(1); }} className="text-xs text-text-muted hover:text-primary transition-colors">← Re-upload</button>
            </div>
            <div className="rounded-xl border border-border-soft overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-soft bg-bg-muted/50">
                    {['Product Name', 'Barcode', 'Price LBP', 'Unit', ''].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={cn('border-b border-border-soft last:border-0', !row.valid && 'bg-red-400/5')}>
                      <td className="px-4 py-2.5 text-sm text-text-main">{row.product_name}</td>
                      <td className="px-4 py-2.5 text-xs text-text-muted font-mono">{row.barcode || '—'}</td>
                      <td className="px-4 py-2.5">
                        <input
                          defaultValue={row.price_lbp}
                          onChange={e => setRows(prev => prev.map((r, j) => j === i ? { ...r, price_lbp: e.target.value, valid: !isNaN(Number(e.target.value.replace(/,/g, ''))) && Number(e.target.value.replace(/,/g, '')) > 0 } : r))}
                          className="w-28 px-2 py-1 rounded-lg bg-bg-muted border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary font-mono"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-sm text-text-muted">{row.unit || '—'}</td>
                      <td className="px-4 py-2.5">
                        {row.valid
                          ? <span className="text-xs text-green-500 font-bold">✓ OK</span>
                          : <span className="text-xs text-red-400 font-bold">⚠ {row.error}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setRows([]); setStep(1); }} className="px-4 py-2 rounded-xl border border-border-soft text-sm text-text-sub hover:text-text-main transition-colors">Cancel</button>
              <button onClick={() => setStep(3)} disabled={validRows.length === 0} className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 disabled:opacity-40">
                Import {validRows.length} rows →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center py-12 gap-5">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500" style={{ fontSize: '36px' }}>check_circle</span>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-text-main">{validRows.length} prices imported successfully</p>
              <p className="text-sm text-text-muted mt-1">Prices are now pending verification by the admin team.</p>
            </div>
            <button onClick={() => { setStep(0); setRows([]); }} className="px-5 py-2.5 rounded-xl border border-border-soft text-sm text-text-sub hover:border-primary hover:text-primary transition-all">Upload another file</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
