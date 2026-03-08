import { useState } from 'react';
import { motion } from 'framer-motion';
import { StoreVerificationStepper } from '@/components/admin/StoreVerificationStepper';
import { useToastStore } from '@/store/useToastStore';

interface OnboardingApplication {
  id: string;
  storeName: string;
  contactName: string;
  contactEmail: string;
  district: string;
  submittedAt: string;
  currentStep: number;
}

const MOCK_APPLICATIONS: OnboardingApplication[] = [
  { id: 'ob1', storeName: 'Coop d\'Etat Jounieh',   contactName: 'Michel Khoury', contactEmail: 'mk@coop.lb', district: 'Jounieh', submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), currentStep: 1 },
  { id: 'ob2', storeName: 'Alpha Supermarket Tripoli', contactName: 'Ahmad Nassar', contactEmail: 'a@alpha.lb', district: 'Tripoli', submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(), currentStep: 3 },
  { id: 'ob3', storeName: 'Le Marché Saida',           contactName: 'Nadia Fares',  contactEmail: 'nf@marche.lb', district: 'Sidon', submittedAt: new Date(Date.now() - 86400000).toISOString(), currentStep: 0 },
];

export function AdminOnboardingPage() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selected, setSelected] = useState<string | null>(MOCK_APPLICATIONS[0].id);
  const addToast = useToastStore(s => s.addToast);

  const selectedApp = applications.find(a => a.id === selected);

  const advanceStep = (id: string, step: number) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, currentStep: step + 1 } : a));
    addToast('Step completed — moved to next stage', 'success');
  };

  const activate = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    setSelected(applications.find(a => a.id !== id)?.id ?? null);
    addToast('Store activated and live on the platform!', 'success');
  };

  const timeAgo = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-text-main">Retailer Onboarding</h1>
        <p className="text-text-muted text-sm mt-1">{applications.length} store{applications.length !== 1 ? 's' : ''} in the onboarding queue</p>
      </motion.div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-green-500" style={{ fontSize: '48px' }}>check_circle</span>
          <p className="text-base font-bold text-text-main">All stores onboarded!</p>
          <p className="text-sm text-text-muted">No pending applications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          {/* Application list */}
          <div className="col-span-2 flex flex-col gap-2">
            {applications.map(app => (
              <button key={app.id} onClick={() => setSelected(app.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${selected === app.id ? 'border-primary bg-primary/5' : 'border-border-soft bg-bg-surface hover:border-primary/40'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-text-main">{app.storeName}</p>
                    <p className="text-xs text-text-muted mt-0.5">{app.district} · {app.contactName}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                    Step {app.currentStep + 1}/5
                  </span>
                </div>
                <div className="mt-2 h-1 bg-bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(app.currentStep / 4) * 100}%` }} />
                </div>
                <p className="text-[10px] text-text-muted mt-1.5">Applied {timeAgo(app.submittedAt)}</p>
              </button>
            ))}
          </div>

          {/* Stepper detail */}
          {selectedApp && (
            <motion.div key={selectedApp.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="col-span-3">
              <div className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
                {/* Store info header */}
                <div className="px-6 py-5 border-b border-border-soft bg-bg-muted/30">
                  <p className="text-xs text-text-muted mb-1">Onboarding application</p>
                  <p className="text-xl font-black text-text-main">{selectedApp.storeName}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>{selectedApp.contactName}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span>{selectedApp.contactEmail}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>{selectedApp.district}</span>
                  </div>
                </div>
                <StoreVerificationStepper
                  storeName={selectedApp.storeName}
                  currentStep={selectedApp.currentStep}
                  onStepComplete={(step) => advanceStep(selectedApp.id, step)}
                  onActivate={() => activate(selectedApp.id)}
                />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
