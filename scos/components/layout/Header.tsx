'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguageStore } from '@/stores/language-store';
import { useCompanyStore } from '@/stores/company-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useModuleStore } from '@/stores/module-store';
import { useUIStore } from '@/stores/ui-store';
import { cn, t, formatDate } from '@/lib/utils';
import {
  Bell, Globe, LogOut, User, Menu, X as XIcon,
  Info, AlertTriangle, CheckCircle, AlertCircle,
} from 'lucide-react';

const notifIcons: Record<string, React.ElementType> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const notifColors: Record<string, string> = {
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  error: 'text-error bg-error/10',
  info: 'text-info bg-info/10',
};

export function Header() {
  const { user, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { company } = useCompanyStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { mobileSidebarOpen, toggleMobileSidebar, setMobileSidebarOpen } = useUIStore();
  const [showNotifs, setShowNotifs] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6 shadow-sm">
      <button
        onClick={toggleMobileSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus-ring lg:hidden"
        aria-label={mobileSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileSidebarOpen ? <XIcon className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
      </button>
      <div className="flex items-center gap-3 flex-1">
        {company?.branding.logo ? (
          <img src={company.branding.logo} alt={company.name} className="h-8 w-auto" />
        ) : (
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: company?.branding.primaryColor || '#009B77' }}
          >
            S
          </div>
        )}
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {language === 'ar' ? company?.nameAr || company?.name : company?.name}
          </h1>
          <p className="text-xs text-gray-500">SCOS Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors focus-ring"
          aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
        </button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus-ring"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-white shadow-dropdown animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('Notifications', 'الإشعارات', language)}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => { markAllAsRead(); }}
                    className="text-xs text-primary hover:text-primary-dark transition-colors"
                  >
                    {t('Mark all read', 'تحديد الكل كمقروء', language)}
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">{t('No notifications', 'لا توجد إشعارات', language)}</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => {
                    const Icon = notifIcons[n.type] || Info;
                    return (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${!n.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${notifColors[n.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {t(n.title, n.titleAr, language)}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {t(n.message, n.messageAr, language)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                        </div>
                        {!n.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {language === 'ar' ? user?.nameAr || user?.name : user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus-ring text-gray-400 hover:text-error"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
