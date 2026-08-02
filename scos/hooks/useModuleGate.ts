'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useModuleStore } from '@/stores/module-store';

const moduleRouteMap: Record<string, string> = {
  '/employees': 'employee-management',
  '/leaves': 'leave-management',
  '/payroll': 'payroll',
  '/attendance': 'attendance',
  '/communication': 'communication',
  '/reports': 'reports',
  '/administration': 'administration',
};

export function useModuleGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { moduleStates, isLoading } = useModuleStore();

  useEffect(() => {
    if (isLoading || !pathname) return;

    const matched = Object.entries(moduleRouteMap).find(
      ([route]) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!matched) return;

    const [, moduleId] = matched;
    const enabled = moduleStates[moduleId];

    if (!enabled) {
      router.replace('/');
    }
  }, [pathname, moduleStates, isLoading, router]);
}
