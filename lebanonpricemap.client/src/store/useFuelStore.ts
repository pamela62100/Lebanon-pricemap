import { create } from 'zustand';
import { getEnrichedStationReports } from '@/api/mockData';
import type { StationReport, FuelType } from '@/types';

interface FuelState {
  reports: StationReport[];
  isLoading: boolean;
  addReport: (report: Omit<StationReport, 'id' | 'createdAt' | 'confirmedBy'>) => void;
  confirmReport: (reportId: string, userId: string) => void;
  getReportsByType: (type: FuelType) => StationReport[];
}

export const useFuelStore = create<FuelState>((set, get) => ({
  reports: getEnrichedStationReports(),
  isLoading: false,

  addReport: (report) => {
    const newReport: StationReport = {
      ...report,
      id: `sr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      confirmedBy: [],
    };
    set(state => ({ reports: [newReport, ...state.reports] }));
  },

  // Weighted confidence: each confirm = +1. 3+ = "High Confidence"
  confirmReport: (reportId, userId) => {
    set(state => ({
      reports: state.reports.map(r =>
        r.id === reportId && !r.confirmedBy.includes(userId)
          ? { ...r, confirmedBy: [...r.confirmedBy, userId] }
          : r
      )
    }));
  },

  // Sort by recency — newest reports first
  getReportsByType: (type) =>
    get().reports
      .filter(r => r.fuelType === type)
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
}));
