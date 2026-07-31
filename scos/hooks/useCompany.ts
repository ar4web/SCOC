import { useAuthStore } from '@/stores/auth-store';
import { useCompanyStore } from '@/stores/company-store';
import { useEffect } from 'react';
import { companies } from '@/lib/mock-data';

export function useCompany() {
  const { user } = useAuthStore();
  const { company, setCompany } = useCompanyStore();

  useEffect(() => {
    if (user && !company) {
      const c = companies.get(user.companyId);
      if (c) setCompany(c);
    }
  }, [user, company, setCompany]);

  return { company };
}
