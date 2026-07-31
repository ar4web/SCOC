import { create } from 'zustand';
import { Company, Branding, CompanySettings } from '@/types';

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  setCompany: (company: Company) => void;
  updateBranding: (branding: Branding) => Promise<void>;
  updateSettings: (settings: Partial<CompanySettings>) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  isLoading: true,

  setCompany: (company) => set({ company, isLoading: false }),

  updateBranding: async (branding) => {
    const company = get().company;
    if (!company) return;
    set({ company: { ...company, branding } });
  },

  updateSettings: async (settings) => {
    const company = get().company;
    if (!company) return;
    set({ company: { ...company, settings: { ...company.settings, ...settings } } });
  },
}));
