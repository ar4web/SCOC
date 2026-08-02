'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/language-store';
import { useCompanyStore } from '@/stores/company-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { reportsService, DashboardStats } from '@/modules/reports/service';
import { t, formatCurrency } from '@/lib/utils';
import {
  Users,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  PieChart,
  UserPlus,
  ArrowRight,
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardPage() {
  const { language, dir } = useLanguageStore();
  const { company } = useCompanyStore();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await reportsService.getStats();
      if (mounted && res.success && res.data) setStats(res.data);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const chartTheme = {
    chart: { foreColor: '#6B7280', fontFamily: language === 'ar' ? 'Cairo' : 'Inter' },
    tooltip: { theme: 'light' as const },
  };

  const departmentChart = {
    series: stats?.departmentDistribution.map((d) => d.count) ?? [],
    options: {
      ...chartTheme,
      labels: stats?.departmentDistribution.map((d) => d.name) ?? [],
      colors: ['#009B77', '#00205B', '#FFC72C', '#0DCAF0', '#FD7E14', '#198754'],
      plotOptions: { pie: { donut: { size: '65%' } } },
      legend: { position: 'bottom' as const },
      dataLabels: { enabled: false },
      responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
    },
  };

  const kpiCards = [
    {
      label: t('Total Employees', 'إجمالي الموظفين', language),
      value: stats ? stats.totalEmployees.toString() : '--',
      icon: Users,
      color: 'text-primary bg-primary/10',
      route: '/employees',
    },
    {
      label: t('Active Employees', 'الموظفون النشطون', language),
      value: stats ? stats.activeEmployees.toString() : '--',
      icon: Activity,
      color: 'text-success bg-success/10',
      route: '/employees',
    },
    {
      label: t('Pending Leaves', 'الإجازات المعلقة', language),
      value: stats ? stats.pendingLeaves.toString() : '--',
      icon: Calendar,
      color: 'text-warning bg-warning/10',
      route: '/leaves',
    },
    {
      label: t('Avg Salary', 'متوسط الراتب', language),
      value: stats ? formatCurrency(stats.avgSalary) : '--',
      icon: DollarSign,
      color: 'text-info bg-info/10',
      route: '/payroll',
    },
  ];

  const greeting =
    language === 'ar'
      ? `مرحباً بك في ${company?.nameAr || company?.name || 'SCOS'}`
      : `Welcome to ${company?.name || 'SCOS'}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Dashboard', 'لوحة القيادة', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{greeting}</p>
        </div>
        <Link
          href="/employees/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors focus-ring"
        >
          <UserPlus className="h-4 w-4" />
          {t('Add Employee', 'إضافة موظف', language)}
        </Link>
      </div>

      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link key={kpi.label} href={kpi.route} className="group">
                <Card className="transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5">
                  <CardBody className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      <p className="text-sm text-gray-500 truncate">{kpi.label}</p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t('Department Distribution', 'توزيع الأقسام', language)}
            </h2>
          </CardHeader>
          <CardBody>
            {stats && stats.departmentDistribution.length > 0 ? (
              <Chart
                options={departmentChart.options}
                series={departmentChart.series}
                type="donut"
                height={280}
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {t('No data available', 'لا توجد بيانات', language)}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {t('Summary', 'ملخص', language)}
              </h2>
            </div>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
            >
              {t('View reports', 'عرض التقارير', language)}
              <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </CardHeader>
          <CardBody className="space-y-3">
            {!stats ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse h-8 rounded-md bg-gray-100" />
                ))}
              </div>
            ) : (
              [
                {
                  label: t('Total Payroll', 'إجمالي الرواتب', language),
                  value: formatCurrency(stats.totalPayroll),
                },
                {
                  label: t('Average Salary', 'متوسط الراتب', language),
                  value: formatCurrency(stats.avgSalary),
                },
                {
                  label: t('Departments', 'الأقسام', language),
                  value: stats.departmentDistribution.length.toString(),
                },
                {
                  label: t('Contract Types', 'أنواع العقود', language),
                  value: stats.contractDistribution.length.toString(),
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
