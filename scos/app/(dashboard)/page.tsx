'use client';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/utils';
import {
  Users, CalendarClock, DollarSign, UserCheck, TrendingUp, AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  label: { en: string; ar: string };
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
  color: string;
}

const stats: Stat[] = [
  { label: { en: 'Total Employees', ar: 'إجمالي الموظفين' }, value: '148', change: '+6', up: true, icon: Users, color: 'bg-blue-100 text-blue-600' },
  { label: { en: 'Pending Leaves', ar: 'الإجازات المعلقة' }, value: '12', change: '-3', up: false, icon: CalendarClock, color: 'bg-amber-100 text-amber-600' },
  { label: { en: 'Active Payroll', ar: 'الرواتب النشطة' }, value: 'SAR 482K', change: '+4.2%', up: true, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
  { label: { en: 'Present Today', ar: 'الحاضرون اليوم' }, value: '134 / 148', change: '91%', up: true, icon: UserCheck, color: 'bg-purple-100 text-purple-600' },
];

const alerts = [
  { text: { en: '5 leave requests awaiting approval', ar: '5 طلبات إجازة بانتظار الموافقة' }, icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
  { text: { en: 'Payroll run for September scheduled Friday', ar: 'تشغيل رواتب سبتمبر مجدول يوم الجمعة' }, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100' },
  { text: { en: '3 employee contracts expiring this month', ar: '3 عقود موظفين تنتهي هذا الشهر' }, icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
];

export default function DashboardPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Dashboard', 'لوحة القيادة', language)}</h1>
          <p className="text-sm text-gray-500">{t('Welcome to SCOS HR platform', 'مرحباً بك في منصة سكوس للموارد البشرية', language)}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {t('Live', 'مباشر', language)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label.en} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>{s.change}</span>
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{t(s.label.en, s.label.ar, language)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900">
            {t('Headcount by Department', 'عدد الموظفين حسب القسم', language)}
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { name: t('Engineering', 'الهندسة', language), count: 52, pct: 35, color: 'bg-primary' },
              { name: t('Operations', 'العمليات', language), count: 38, pct: 26, color: 'bg-blue-500' },
              { name: t('Finance', 'المالية', language), count: 21, pct: 14, color: 'bg-emerald-500' },
              { name: t('HR', 'الموارد البشرية', language), count: 18, pct: 12, color: 'bg-purple-500' },
              { name: t('Sales', 'المبيعات', language), count: 19, pct: 13, color: 'bg-amber-500' },
            ].map((d) => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{d.name}</span>
                  <span className="text-gray-500">{d.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div className={`h-2.5 rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            {t('Attention Needed', 'يحتاج إلى انتباه', language)}
          </h2>
          <div className="mt-4 space-y-3">
            {alerts.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${a.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-gray-700">{t(a.text.en, a.text.ar, language)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
