import { api } from '@/lib/api';
import { Payroll } from '@/types';

export const payrollService = {
  list: (params?: { period?: string; employeeId?: string }) => {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.employeeId) query.set('employeeId', params.employeeId);
    return api.get<{ data: Payroll[]; total: number }>(`/payroll?${query.toString()}`);
  },

  process: (period: string) =>
    api.post<{ success: boolean; count: number; errors: string[] }>('/payroll', { period }),

  getSalaries: () =>
    api.get<{ data: any[]; total: number }>('/payroll/salaries'),

  getWPS: (period: string) =>
    api.get<string>(`/payroll/wps?period=${period}`),

  getPayslipUrl: (payrollId: string) => `/api/payroll/payslip/${payrollId}`,
};
