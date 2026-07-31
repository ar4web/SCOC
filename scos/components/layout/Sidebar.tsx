'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModuleStore } from '@/stores/module-store';
import { useLanguageStore } from '@/stores/language-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { cn, t } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Clock,
  MessageSquare,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Palette,
  Puzzle,
  User,
  CreditCard,
  LifeBuoy,
  CalendarDays,
  Clock as ClockIcon,
  CalendarCheck,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Clock,
  MessageSquare,
  BarChart,
  Settings,
};

const settingsSubLinks = [
  { id: 'company', icon: Building2, route: '/settings/company', label: { en: 'Company Profile', ar: 'الملف الشخصي للشركة' } },
  { id: 'branding', icon: Palette, route: '/settings/branding', label: { en: 'Branding', ar: 'العلامة التجارية' } },
  { id: 'modules', icon: Puzzle, route: '/settings/modules', label: { en: 'Modules', ar: 'الوحدات' } },
  { id: 'billing', icon: CreditCard, route: '/settings/billing', label: { en: 'Billing', ar: 'الفواتير' } },
  { id: 'holidays', icon: CalendarDays, route: '/settings/holidays', label: { en: 'Holidays', ar: 'الإجازات' } },
  { id: 'work-week', icon: ClockIcon, route: '/settings/work-week', label: { en: 'Work Week', ar: 'أسبوع العمل' } },
  { id: 'leave-policies', icon: CalendarCheck, route: '/settings/leave-policies', label: { en: 'Leave Policies', ar: 'سياسات الإجازات' } },
  { id: 'support', icon: LifeBuoy, route: '/settings/support', label: { en: 'Support', ar: 'الدعم' } },
  { id: 'profile', icon: User, route: '/settings/profile', label: { en: 'Profile', ar: 'الملف الشخصي' } },
];

const defaultModules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    nameAr: 'لوحة القيادة',
    icon: 'LayoutDashboard',
    route: '/',
    enabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { modules, moduleStates } = useModuleStore();
  const { language, dir } = useLanguageStore();
  const { user } = useAuthStore();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname, setMobileSidebarOpen]);

  const allModules = [
    ...defaultModules,
    ...modules.map((m) => ({
      id: m.id,
      name: m.name,
      nameAr: m.nameAr,
      icon: m.icon,
      route: m.route,
      enabled: moduleStates[m.id] ?? false,
    })),
    {
      id: 'settings',
      name: 'Settings',
      nameAr: 'الإعدادات',
      icon: 'Settings',
      route: '/settings/company',
      enabled: true,
    },
  ];

  const visibleModules = allModules.filter((m) => m.enabled);

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-white transition-all duration-200',
        'fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto',
        collapsed ? 'w-16' : 'w-64',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[-1] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        {visibleModules.map((mod) => {
          const Icon = iconMap[mod.icon] || LayoutDashboard;
          const isActive = mod.route === '/'
            ? pathname === '/'
            : pathname.startsWith(mod.route);
          const isSettings = mod.id === 'settings';
          const showSubLinks = isSettings && isActive && !collapsed;

          return (
            <div key={mod.id}>
              <Link
                href={mod.route}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  'focus-ring',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                title={collapsed ? t(mod.name, mod.nameAr, language) : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span>{t(mod.name, mod.nameAr, language)}</span>
                )}
              </Link>
              {showSubLinks && (
                <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-primary/20 pl-3">
                  {settingsSubLinks.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = pathname === sub.route;
                    return (
                      <Link
                        key={sub.id}
                        href={sub.route}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                          'focus-ring',
                          isSubActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        )}
                      >
                        <SubIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{t(sub.label.en, sub.label.ar, language)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors focus-ring text-gray-400"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {dir === 'rtl' ? (
            collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
