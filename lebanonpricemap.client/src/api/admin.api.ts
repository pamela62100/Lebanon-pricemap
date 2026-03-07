import type { ApiResponse, AuditLog } from '@/types';
import { getEnrichedAuditLogs } from './mockData';

export const adminApi = {
  getStats: async () => {
    return {
      data: {
        success: true,
        data: {
          totalUsers: 12840,
          totalUploads: 45201,
          flaggedEntries: 128,
          activeStores: 842,
          usersTrend: 12,
          uploadsTrend: 5,
          flaggedTrend: -2,
          storesTrend: 8,
        },
      },
    };
  },

  getLogs: async () => {
    const logs = getEnrichedAuditLogs();
    return { data: { success: true, data: logs } as ApiResponse<AuditLog[]> };
  },

  getRegionalData: async () => {
    return {
      data: {
        success: true,
        data: [
          { region: "Beirut District",   activeUsers: 4812, newStores: 124, flagRate: 0.8, status: "Stable" as const },
          { region: "Mount Lebanon",     activeUsers: 3205, newStores: 82,  flagRate: 1.2, status: "Stable" as const },
          { region: "North Lebanon",     activeUsers: 2140, newStores: 45,  flagRate: 2.4, status: "Warning" as const },
          { region: "South Lebanon",     activeUsers: 1950, newStores: 38,  flagRate: 1.5, status: "Stable" as const },
        ],
      },
    };
  },
};
