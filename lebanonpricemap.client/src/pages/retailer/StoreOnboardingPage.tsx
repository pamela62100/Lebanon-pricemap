import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storesApi } from '@/api/stores.api';
import { useToastStore } from '@/store/useToastStore';

const LEBANESE_CITIES = ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh', 'Zahle', 'Baalbek', 'Byblos', 'Other'];

export function StoreOnboardingPage() {
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.addToast);

  const [name, setName] = useState('');
  const [chain, setChain] = useState('');
  const [city, setCity] = useState('Beirut');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) { setError('Store name is required.'); return; }
    if (!city.trim()) { setError('Please select a city.'); return; }

    setLoading(true);
    try {
      await storesApi.createMine({
        name: name.trim(),
        chain: chain.trim() || undefined,
        city: city.trim(),
        district: district.trim() || undefined,
      });
      addToast('Store created. Admin will review for approval.', 'success');
      navigate('/retailer');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Failed to create store.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-[24px]">storefront</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Set up your store</h1>
          <p className="text-sm text-text-muted">
            Tell us a bit about your store. An admin will review and approve it within 24 hours.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white border border-border-soft rounded-xl p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Store name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Habib Market Gemmayzeh"
              className="w-full h-11 px-4 bg-bg-base border border-border-soft rounded-xl text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Chain or brand (optional)</label>
            <input
              type="text"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              placeholder="e.g. Spinneys, Carrefour, Habib"
              className="w-full h-11 px-4 bg-bg-base border border-border-soft rounded-xl text-sm focus:border-primary focus:outline-none"
            />
            <p className="text-[11px] text-text-muted mt-1">Leave blank if you're an independent store.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3 bg-bg-base border border-border-soft rounded-xl text-sm focus:border-primary focus:outline-none"
              >
                {LEBANESE_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">District / area</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Achrafieh"
                className="w-full h-11 px-4 bg-bg-base border border-border-soft rounded-xl text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60"
          >
            {loading ? 'Creating store...' : 'Create my store'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
