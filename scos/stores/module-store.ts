import { create } from 'zustand';
import { ModuleDefinition, ModuleStates } from '@/types';
import { moduleDefinitions } from '@/lib/mock-data';

interface ModuleState {
  modules: ModuleDefinition[];
  moduleStates: ModuleStates;
  isLoading: boolean;
  toggleModule: (moduleId: string) => Promise<{ success: boolean; error?: string }>;
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

  toggleModule: async (moduleId) => {
    const state = get();
    const moduleDef = state.modules.find((m) => m.id === moduleId);
    if (!moduleDef) return { success: false, error: 'Module not found' };

    const willEnable = !state.moduleStates[moduleId];

    if (willEnable) {
      const warnings = state.getDependencyWarnings(moduleId);
      if (warnings.length > 0) {
        return { success: false, error: `Required modules: ${warnings.join(', ')}` };
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
