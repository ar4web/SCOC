import { api } from '@/lib/api';
import { Employee, PaginatedResponse } from '@/types';

export const employeeService = {
  list: (params?: { page?: number; pageSize?: number; search?: string; department?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.pageSize) query.set('pageSize', params.pageSize.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.department) query.set('department', params.department);
    if (params?.status) query.set('status', params.status);
    return api.get<PaginatedResponse<Employee>>(`/employees?${query.toString()}`);
  },

  getById: (id: string) => api.get<Employee>(`/employees/${id}`),

  create: (data: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>) =>
    api.post<Employee>('/employees', data),

  update: (id: string, data: Partial<Employee>) =>
    api.put<Employee>(`/employees/${id}`, data),
};
