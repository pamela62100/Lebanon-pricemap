import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin.api';
import { useToastStore } from '@/store/useToastStore';

interface OnboardingApp {
  id: string;
  contactName: string;
  email: string;
  phone?: string;
  proposedStoreName: string;
  city?: string;
  district?: string;
  currentStep: number;
  totalSteps: number;
  status: string;
  adminNotes?: string;
  appliedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  in_review: 'bg-blue-100 text-blue-700',
};

export function AdminOnboardingPage() {
  const [apps, setApps] = useState<OnboardingApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const addToast = useToastStore(s => s.addToast);

  useEffect(() => {
    adminApi.getOnboarding()
      .then(res => {
        const data = (res as any).data?.data ?? [];
        setApps(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleAdvanceStep = async (app: OnboardingApp) => {
    const nextStep = app.currentStep + 1;
    const newStatus = nextStep > app.totalSteps ? 'approved' : app.status;
    try {
      await adminApi.updateOnboardingStep(app.id, { step: nextStep, status: newStatus });
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, currentStep: nextStep, status: newStatus } : a));
      addToast(newStatus === 'approved' ? 'Application approved!' : `Advanced to step ${nextStep}`, 'success');
    } catch {
      addToast('Failed to update step', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.updateOnboardingStep(id, { step: 0, status: 'rejected' });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
      addToast('Application rejected', 'info');
    } catch {
      addToast('Failed to reject', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-text-main">Retailer Onboarding</h1>
        <p className="text-text-muted text-sm mt-1">Manage store onboarding applications</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-bg-muted animate-pulse" />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-green-500" style={{ fontSize: '48px' }}>check_circle</span>
          <p className="text-base font-bold text-text-main">No pending applications</p>
          <p className="text-sm text-text-muted">New retailer onboarding applications will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {apps.map(app => (
            <div key={app.id} className="bg-bg-surface border border-border-soft rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-base font-bold text-text-main">{app.proposedStoreName}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[app.status] ?? 'bg-bg-muted text-text-muted'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-sub">{app.contactName} · {app.email}</p>
                  {app.city && <p className="text-xs text-text-muted mt-0.5">{app.city}{app.district ? `, ${app.district}` : ''}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex gap-1">
                      {Array.from({ length: app.totalSteps }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-1.5 rounded-full ${i < app.currentStep ? 'bg-primary' : 'bg-bg-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">Step {app.currentStep}/{app.totalSteps}</span>
                  </div>
                </div>
                {app.status !== 'approved' && app.status !== 'rejected' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(app.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAdvanceStep(app)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
                    >
                      {app.currentStep >= app.totalSteps ? 'Approve' : 'Next Step'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
