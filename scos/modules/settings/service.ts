import { api } from '@/lib/api';
import { ModuleDefinition, ModuleStates } from '@/types';

export interface ModulesResponse {
  modules: ModuleDefinition[];
  states: ModuleStates;
}

export const moduleService = {
  get: () => api.get<ModulesResponse>('/modules'),

  updateStates: (moduleStates: ModuleStates) =>
    api.put<ModulesResponse>('/modules', { moduleStates }),
};
