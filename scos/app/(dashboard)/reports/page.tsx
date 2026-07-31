'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { reportsService, DashboardStats } from '@/modules/reports/service';
import { t, formatCurrency } from '@/lib/utils';
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ReportsPage() {
  const { language, dir } = useLanguageStore();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await reportsService.getStats();
    if (res.success && res.data) setStats(res.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return null;

  const chartTheme = {
    chart: { foreColor: '#6B7280', fontFamily: language === 'ar' ? 'Cairo' : 'Inter' },
    tooltip: { theme: 'light' as const },
  };

  const departmentChart = {
    series: stats.departmentDistribution.map((d) => d.count),
    options: {
      ...chartTheme,
      labels: stats.departmentDistribution.map((d) => d.name),
      colors: ['#009B77', '#00205B', '#FFC72C', '#0DCAF0', '#FD7E14', '#198754'],
      plotOptions: { pie: { donut: { size: '60%' } } },
      legend: { position: 'bottom' as const },
      responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
    },
  };

  const contractChart = {
    series: [{ data: stats.contractDistribution.map((c) => c.count) }],
    options: {
      ...chartTheme,
      chart: { type: 'bar' as const, toolbar: { show: false } },
      xaxis: { categories: stats.contractDistribution.map((c) => c.name) },
      colors: ['#009B77'],
      plotOptions: { bar: { borderRadius: 4 } },
    },
  };

  const statusChart = {
    series: stats.statusDistribution.map((s) => s.count),
    options: {
      ...chartTheme,
      labels: stats.statusDistribution.map((s) => s.name),
      colors: ['#198754', '#6B7280', '#DC3545'],
      plotOptions: { pie: { donut: { size: '60%' } } },
      legend: { position: 'bottom' as const },
    },
  };

  const kpiCards = [
    {
      label: t('Total Employees', 'إجمالي الموظفين', language),
      value: stats.totalEmployees.toString(),
      icon: Users,
      color: 'text-primary bg-primary/10',
    },
    {
      label: t('Active Employees', 'الموظفون النشطون', language),
      value: stats.activeEmployees.toString(),
      icon: TrendingUp,
      color: 'text-success bg-success/10',
    },
    {
      label: t('Pending Leaves', 'الإجازات المعلقة', language),
      value: stats.pendingLeaves.toString(),
      icon: Calendar,
      color: 'text-warning bg-warning/10',
    },
    {
      label: t('Avg Salary', 'متوسط الراتب', language),
      value: formatCurrency(stats.avgSalary),
      icon: DollarSign,
      color: 'text-info bg-info/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('Reports & Analytics', 'التقارير والتحليلات', language)}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('HR analytics and insights', 'تحليلات ورؤى الموارد البشرية', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardBody className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t('Department Distribution', 'توزيع الأقسام', language)}
            </h2>
          </CardHeader>
          <CardBody>
            {stats.departmentDistribution.length > 0 ? (
              <Chart
                options={departmentChart.options}
                series={departmentChart.series}
                type="donut"
                height={300}
              />
            ) : (
              <p className="text-center text-gray-500 py-8">
                {t('No data available', 'لا توجد بيانات', language)}
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t('Contract Types', 'أنواع العقود', language)}
            </h2>
          </CardHeader>
          <CardBody>
            {stats.contractDistribution.length > 0 ? (
              <Chart
                options={contractChart.options}
                series={contractChart.series}
                type="bar"
                height={300}
              />
            ) : (
              <p className="text-center text-gray-500 py-8">
                {t('No data available', 'لا توجد بيانات', language)}
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t('Employee Status', 'حالة الموظفين', language)}
            </h2>
          </CardHeader>
          <CardBody>
            {stats.statusDistribution.some((s) => s.count > 0) ? (
              <Chart
                options={statusChart.options}
                series={statusChart.series}
                type="donut"
                height={300}
              />
            ) : (
              <p className="text-center text-gray-500 py-8">
                {t('No data available', 'لا توجد بيانات', language)}
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t('Summary', 'ملخص', language)}
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              { label: t('Total Payroll', 'إجمالي الرواتب', language), value: formatCurrency(stats.totalPayroll) },
              { label: t('Average Salary', 'متوسط الراتب', language), value: formatCurrency(stats.avgSalary) },
              { label: t('Departments', 'الأقسام', language), value: stats.departmentDistribution.length.toString() },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
