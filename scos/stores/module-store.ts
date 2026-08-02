import { create } from 'zustand';
import { ModuleDefinition, ModuleStates } from '@/types';
import { moduleDefinitions } from '@/lib/mock-data';

interface ModuleState {
  modules: ModuleDefinition[];
  moduleStates: ModuleStates;
  isLoading: boolean;
  toggleModule: (moduleId: string, enabled?: boolean) => Promise<{ success: boolean; error?: string }>;
  isModuleEnabled: (moduleId: string) => boolean;
  getDependencyWarnings: (moduleId: string) => string[];
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  modules: moduleDefinitions,
  moduleStates: moduleDefinitions.reduce((acc, m) => {
    acc[m.id] = m.enabled;
    return acc;
  }, {} as ModuleStates),
  isLoading: false,

  toggleModule: async (moduleId, enabledOverride) => {
    const state = get();
    const moduleDef = state.modules.find((m) => m.id === moduleId);
    if (!moduleDef) return { success: false, error: 'Module not found' };

    const willEnable = enabledOverride ?? !state.moduleStates[moduleId];
    const prospective: ModuleStates = {
      ...state.moduleStates,
      [moduleId]: willEnable,
    };

    if (willEnable) {
      const missingDeps = moduleDef.dependencies.filter((depId) => !prospective[depId]);
      if (missingDeps.length > 0) {
        const names = missingDeps
          .map((depId) => state.modules.find((m) => m.id === depId)?.name || depId)
          .join(', ');
        return { success: false, error: `Required modules: ${names}` };
      }
    } else {
      const dependents = state.modules.filter(
        (m) => prospective[m.id] && m.id !== moduleId && m.dependencies.includes(moduleId)
      );
      if (dependents.length > 0) {
        const names = dependents.map((m) => m.name).join(', ');
        return {
          success: false,
          error: `Cannot disable: ${names} depend${dependents.length === 1 ? 's' : ''} on this module`,
        };
      }
    }

    set((s) => ({
      moduleStates: { ...s.moduleStates, [moduleId]: willEnable },
      modules: s.modules.map((m) =>
        m.id === moduleId ? { ...m, enabled: willEnable } : m
      ),
    }));

    return { success: true };
  },

  isModuleEnabled: (moduleId) => {
    return get().moduleStates[moduleId] ?? false;
  },

  getDependencyWarnings: (moduleId) => {
    const moduleDef = get().modules.find((m) => m.id === moduleId);
    if (!moduleDef) return [];
    return moduleDef.dependencies.filter((depId) => !get().moduleStates[depId]);
  },
}));
