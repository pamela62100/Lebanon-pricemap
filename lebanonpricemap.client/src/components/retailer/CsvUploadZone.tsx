import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pricesApi } from "@/api/prices.api";
import { useToastStore } from "@/store/useToastStore";

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

const STEPS = [
  "Download Template",
  "Upload File",
  "Review & Edit",
  "Confirm Import",
];

export function CsvUploadZone() {
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    recordsReceived: number;
    recordsProcessed: number;
    recordsFailed: number;
    status: string;
    message: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore((s) => s.addToast);

  const parseCSV = useCallback(
    (text: string) => {
      try {
        setUploadError(null);
        const lines = text.trim().split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) {
          setUploadError("CSV file is empty or has no data rows.");
          return;
        }

        const delimiter = lines[0].includes(";") ? ";" : ",";
        
        const headers = lines[0].split(delimiter).map(h => 
          h.replace(/^\uFEFF/, '').replace(/^"|"$/g, '').trim().toLowerCase()
        );

        const required = ["product_name", "price_lbp"];
        const hasMissing = required.filter((r) => !headers.includes(r));
        if (hasMissing.length > 0) {
          setUploadError(`CSV missing required columns. Expected at least 'product_name' and 'price_lbp'. Found: ${headers.join(", ")}`);
          return;
        }

        const nameIdx = headers.indexOf("product_name");
        const priceIdx = headers.indexOf("price_lbp");
        const barcodeIdx = headers.indexOf("barcode");
        const unitIdx = headers.indexOf("unit");

        const parsed: ParsedRow[] = lines.slice(1).map((line) => {
          const vals: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i+1] === '"') {
              current += '"'; i++;
            } else if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
              vals.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          vals.push(current);

          const getVal = (idx: number) => idx >= 0 && idx < vals.length ? vals[idx].replace(/^"|"$/g, '').trim() : "";
          
          const name = getVal(nameIdx);
          const priceStr = getVal(priceIdx);
          const barcode = getVal(barcodeIdx);
          const unit = getVal(unitIdx);

          const price = Number(priceStr.replace(/,/g, ""));
          const valid = name.length > 0 && !isNaN(price) && price > 0;

          return {
            product_name: name,
            barcode: barcode,
            price_lbp: priceStr,
            unit: unit,
            valid,
            error: !valid ? "Missing name or invalid price" : undefined,
          };
        });

        setRows(parsed);
        setStep(2);
      } catch (err: any) {
        setUploadError(`System error parsing CSV: ${err?.message || 'Unknown error'}`);
      }
    },
    [],
  );

  const onFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) parseCSV(e.target.result as string);
      };
      reader.readAsText(file);
      setStep(1);
    },
    [parseCSV],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.toLowerCase().endsWith(".csv")) onFile(file);
      else addToast("Please upload a .csv file", "error");
    },
    [onFile, addToast],
  );

  const validRows = rows.filter((r) => r.valid);

  const handleBulkSubmit = async () => {
    if (validRows.length === 0) return;

    setIsSubmitting(true);
    setImportResult(null);
    setSubmitError(null);

    try {
      const payload = {
        rows: validRows.map((row) => ({
          productName: row.product_name,
          barcode: row.barcode,
          priceLbp: Number(row.price_lbp.replace(/,/g, "")),
          unit: row.unit,
        })),
      };

      const response = await pricesApi.bulkSubmit(payload);
      const result = response.data.data;
      setImportResult(result);
      setStep(3);
      addToast("Prices imported and sync run recorded.", "success");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data?.detail || error.response?.data?.title || error.message || "Unable to submit CSV. Please try again.";
      setSubmitError(msg);
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Steps */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  i < step
                    ? "bg-primary border-primary text-white"
                    : i === step
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border-soft text-text-muted bg-bg-base",
                )}
              >
                {i < step ? (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    check
                  </span>
                ) : (
                  i + 1
                )}
              </div>
              <p
                className={cn(
                  "text-[10px] font-semibold whitespace-nowrap",
                  i === step ? "text-primary" : "text-text-muted",
                )}
              >
                {s}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mb-4 mx-2 transition-all",
                  i < step ? "bg-primary" : "bg-border-soft",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Download template */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-4 items-center py-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: "32px" }}
              >
                download
              </span>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-text-main">
                Download the CSV template
              </p>
              <p className="text-sm text-text-muted mt-1">
                Fill your prices into the template, then upload it in the next
                step.
              </p>
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
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  download
                </span>
                Download Template
              </a>
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-border-soft text-sm text-text-sub hover:border-primary hover:text-primary transition-all"
              >
                Skip — I have a file →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border-soft hover:border-primary/50 hover:bg-bg-surface",
              )}
            >
              <span
                className="material-symbols-outlined text-text-muted mb-3"
                style={{ fontSize: "48px" }}
              >
                upload_file
              </span>
              <p className="text-base font-bold text-text-main">
                Drag & drop your CSV here
              </p>
              <p className="text-sm text-text-muted mt-1">or click to browse</p>
              <p className="text-xs text-text-muted mt-3">
                Accepts .csv files only
              </p>
            </div>
            {uploadError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5">error</span>
                <p className="text-sm text-red-700 font-medium">{uploadError}</p>
              </motion.div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
          </motion.div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-text-main">
                  {rows.length} rows parsed — {validRows.length} valid,{" "}
                  {rows.length - validRows.length} with errors
                </p>
                <p className="text-sm text-text-muted">
                  Review before importing. You can edit prices directly.
                </p>
              </div>
              <button
                onClick={() => {
                  setRows([]);
                  setStep(1);
                }}
                className="text-xs text-text-muted hover:text-primary transition-colors"
              >
                ← Re-upload
              </button>
            </div>
            <div className="rounded-xl border border-border-soft overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-soft bg-bg-muted/50">
                    {["Product Name", "Barcode", "Price LBP", "Unit", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-xs font-bold text-text-muted uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className={cn(
                        "border-b border-border-soft last:border-0",
                        !row.valid && "bg-red-400/5",
                      )}
                    >
                      <td className="px-4 py-2.5 text-sm text-text-main">
                        {row.product_name}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-text-muted font-mono">
                        {row.barcode || "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          defaultValue={row.price_lbp}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue = Number(
                              value.replace(/,/g, ""),
                            );
                            const valid =
                              !isNaN(numericValue) && numericValue > 0;
                            setRows((prev) =>
                              prev.map((r, j) =>
                                j === i
                                  ? {
                                      ...r,
                                      price_lbp: value,
                                      valid,
                                      error: valid
                                        ? undefined
                                        : "Missing name or invalid price",
                                    }
                                  : r,
                              ),
                            );
                          }}
                          className="w-28 px-2 py-1 rounded-lg bg-bg-muted border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary font-mono"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-sm text-text-muted">
                        {row.unit || "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        {row.valid ? (
                          <span className="text-xs text-green-500 font-bold">
                            ✓ OK
                          </span>
                        ) : (
                          <span className="text-xs text-red-400 font-bold">
                            ⚠ {row.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {submitError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 mt-4">
                <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5">error</span>
                <p className="text-sm text-red-700 font-medium">{submitError}</p>
              </motion.div>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setRows([]);
                  setStep(1);
                  setSubmitError(null);
                }}
                className="px-4 py-2 rounded-xl border border-border-soft text-sm text-text-sub hover:text-text-main transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                disabled={validRows.length === 0 || isSubmitting}
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 disabled:opacity-40"
              >
                {isSubmitting ? 'Importing...' : `Import ${validRows.length} rows →`}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center py-12 gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-green-500"
                style={{ fontSize: "36px" }}
              >
                check_circle
              </span>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-text-main">
                {importResult ? `${importResult.recordsProcessed} prices imported successfully` : `${validRows.length} prices imported successfully`}
              </p>
              <p className="text-sm text-text-muted mt-1">
                {importResult?.message || 'Prices are now pending verification by the admin team.'}
              </p>
              {importResult && importResult.recordsFailed > 0 && (
                <p className="text-xs text-yellow-600 mt-2">
                  {importResult.recordsFailed} rows were skipped because they could not be matched or had invalid values.
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setStep(0);
                setRows([]);
                setImportResult(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-border-soft text-sm text-text-sub hover:border-primary hover:text-primary transition-all"
            >
              Upload another file
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
