'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useCompanyStore } from '@/stores/company-store';
import { useLanguageStore } from '@/stores/language-store';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageTransition } from '@/components/PageTransition';
import { companies } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();
  const { setCompany } = useCompanyStore();
  const { setLanguage } = useLanguageStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (user) {
      const company = companies.get(user.companyId);
      if (company) setCompany(company);
      setLanguage(user.language || 'en');
    }
  }, [user, setCompany, setLanguage]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <ErrorBoundary>
            <PageTransition>{children}</PageTransition>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
