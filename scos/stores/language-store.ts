import { create } from 'zustand';
import { Language } from '@/types';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: 'ltr' | 'rtl';
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  dir: 'ltr',

  setLanguage: (language) => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    set({ language, dir });
  },

  toggleLanguage: () => {
    const current = get().language;
    const next = current === 'en' ? 'ar' : 'en';
    get().setLanguage(next);
  },
}));
