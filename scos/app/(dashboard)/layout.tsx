'use client';
import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useCompanyStore } from '@/stores/company-store';
import { useModuleStore } from '@/stores/module-store';
import { useLanguageStore } from '@/stores/language-store';
import { useModuleGate } from '@/hooks/useModuleGate';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const { setLanguage } = useLanguageStore();
  const { fetchCompany } = useCompanyStore();
  const { fetchModules } = useModuleStore();

  useModuleGate();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchCompany();
      fetchModules();
    }
  }, [isAuthenticated, fetchCompany, fetchModules]);

  React.useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    }
  }, [user?.language, setLanguage]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
