import { api } from '@/lib/api';
import { LeaveRequest } from '@/types';

export const leaveService = {
  list: (params?: { employeeId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.employeeId) query.set('employeeId', params.employeeId);
    if (params?.status) query.set('status', params.status);
    return api.get<{ data: LeaveRequest[]; total: number }>(`/leaves?${query.toString()}`);
  },

  create: (data: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<LeaveRequest>('/leaves', data),

  approve: (id: string, approvedBy: string) =>
    api.put<LeaveRequest>(`/leaves/${id}`, { action: 'approve', approvedBy }),

  reject: (id: string, approvedBy: string) =>
    api.put<LeaveRequest>(`/leaves/${id}`, { action: 'reject', approvedBy }),
};
