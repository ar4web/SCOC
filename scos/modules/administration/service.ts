import { api } from '@/lib/api';
import { User } from '@/types';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export const adminService = {
  getUsers: () => api.get<{ data: User[] }>('/administration?type=users'),
  getAuditLogs: () => api.get<{ data: AuditLog[] }>('/administration?type=audit'),
};
