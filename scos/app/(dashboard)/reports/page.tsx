'use client';

import React from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { reportsService, DashboardStats } from '@/modules/reports/service';
import { t, formatCurrency } from '@/lib/utils';
import { Chart } from '@/engines/chart-engine';
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, PieChart } from 'lucide-react';

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

  const departmentDistribution = stats.departmentDistribution;
  const contractDistribution = stats.contractDistribution;
  const statusDistribution = stats.statusDistribution;
  const leaveStatus = stats.leaveStatus;

  const leaveStatusLabels: Record<string, { en: string; ar: string }> = {
    approved: { en: 'Approved', ar: 'مقبولة' },
    pending: { en: 'Pending', ar: 'معلقة' },
    rejected: { en: 'Rejected', ar: 'مرفوضة' },
    cancelled: { en: 'Cancelled', ar: 'ملغاة' },
  };

  const getLeaveStatusLabel = (key: string) =>
    language === 'ar'
      ? leaveStatusLabels[key]?.ar || key
      : leaveStatusLabels[key]?.en || key;

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
            {departmentDistribution.length > 0 ? (
              <Chart
                type="donut"
                series={departmentDistribution.map((d) => d.count)}
                labels={departmentDistribution.map((d) => d.name)}
                height={300}
                locale={language}
                dir={dir}
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
            {contractDistribution.length > 0 ? (
              <Chart
                type="bar"
                series={[{ name: t('Employees', 'الموظفون', language), data: contractDistribution.map((c) => c.count) }]}
                categories={contractDistribution.map((c) => c.name)}
                height={300}
                locale={language}
                dir={dir}
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
            {statusDistribution.some((s) => s.count > 0) ? (
              <Chart
                type="donut"
                series={statusDistribution.map((s) => s.count)}
                labels={statusDistribution.map((s) => s.name)}
                colors={['#198754', '#6B7280', '#DC3545']}
                height={300}
                locale={language}
                dir={dir}
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
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t('Leave Requests', 'طلبات الإجازة', language)}
            </h2>
          </CardHeader>
          <CardBody>
            {leaveStatus.some((l) => l.count > 0) ? (
              <Chart
                type="donut"
                series={leaveStatus.map((l) => l.count)}
                labels={leaveStatus.map((l) => getLeaveStatusLabel(l.name))}
                colors={['#198754', '#FFC107', '#DC3545', '#6B7280']}
                height={300}
                locale={language}
                dir={dir}
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
