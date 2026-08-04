'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/engines/table-engine';
import { payrollService } from '@/modules/payroll/service';
import { employeeService } from '@/modules/employee-management/service';
import { Employee, Payroll } from '@/types';
import { t, formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { DollarSign, Play, Download, FileText, ExternalLink } from 'lucide-react';

export default function PayrollPage() {
  const { language, dir } = useLanguageStore();
  const [payrolls, setPayrolls] = React.useState<Payroll[]>([]);
  const [employees, setEmployees] = React.useState<Map<string, Employee>>(new Map());
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const { addToast } = useToast();
  const [period, setPeriod] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [payrollRes, empRes] = await Promise.all([
      payrollService.list(),
      employeeService.getActive(),
    ]);
    if (payrollRes.success && payrollRes.data) setPayrolls(payrollRes.data.data);
    if (empRes.success && empRes.data) {
      setEmployees(new Map(empRes.data.data.map((e) => [e.id, e])));
    }
    setLoading(false);
  };

  const handleProcess = async () => {
    setProcessing(true);
    const res = await payrollService.process(period);
    if (res.success && res.data) {
      addToast({ type: 'success', title: t(
          `Payroll processed! ${res.data.count} employees. Errors: ${res.data.errors.length}`,
          `تمت معالجة الرواتب! ${res.data.count} موظف. الأخطاء: ${res.data.errors.length}`,
          language
        ) });
      loadData();
    }
    setProcessing(false);
  };

  const handleDownloadWPS = async () => {
    const res = await payrollService.getWPS(period);
    if (res.success && res.data) {
      const blob = new Blob([res.data as string], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WPS_${period}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      addToast({ type: 'error', title: res.error || t('Failed to generate WPS file', 'فشل في إنشاء ملف WPS', language) });
    }
  };

  const columns: Column<Payroll>[] = [
    {
      key: 'employeeId',
      header: t('Employee', 'الموظف', language),
      render: (p) => {
        const emp = employees.get(p.employeeId);
        return emp ? (language === 'ar' ? emp.fullNameAr || emp.fullName : emp.fullName) : p.employeeId;
      },
    },
    {
      key: 'period',
      header: t('Period', 'الفترة', language),
    },
    {
      key: 'netPay',
      header: t('Net Pay', 'صافي الراتب', language),
      render: (p) => <span className="font-medium">{formatCurrency(p.netPay)}</span>,
    },
    {
      key: 'gosiContribution',
      header: 'GOSI',
      render: (p) => <span className="text-sm text-gray-500">{formatCurrency(p.gosiContribution)}</span>,
    },
    {
      key: 'status',
      header: t('Status', 'الحالة', language),
      render: (p) => <Badge status={p.status} locale={language} />,
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex items-center gap-2">
          <a
            href={payrollService.getPayslipUrl(p.id)}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark"
          >
            <FileText className="h-3 w-3" />
            {t('Payslip', 'قسيمة الراتب', language)}
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Payroll Management', 'إدارة الرواتب', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Process payroll with GOSI/WPS compliance', 'معالجة الرواتب مع التوافق مع التأمينات و WPS', language)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-100 pb-3">
        <span className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white">
          {t('Payroll Runs', 'تشغيل الرواتب', language)}
        </span>
        <Link href="/payroll/employees">
          <span className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {t('Salary Setup', 'إعداد الرواتب', language)}
          </span>
        </Link>
        <Link href="/payroll/gosi">
          <span className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {t('GOSI Calculator', 'حاسبة التأمينات', language)}
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t('Process Payroll', 'معالجة الرواتب', language)}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('Generate monthly payroll', 'إنشاء كشف رواتب شهري', language)}
                </p>
              </div>
            </div>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <Button onClick={handleProcess} loading={processing} className="w-full">
              <Play className="h-4 w-4" />
              {t('Run Payroll', 'تشغيل كشف الرواتب', language)}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">WPS</h3>
                <p className="text-xs text-gray-500">
                  {t('Bank transfer file (WPS format)', 'ملف التحويل البنكي (صيغة WPS)', language)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {t('Generate WPS-compliant file for salary transfers', 'إنشاء ملف متوافق مع WPS لتحويل الرواتب', language)}
            </p>
            <Button variant="outline" onClick={handleDownloadWPS} className="w-full">
              <Download className="h-4 w-4" />
              {t('Download WPS', 'تنزيل WPS', language)}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-info" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">GOSI</h3>
                <p className="text-xs text-gray-500">
                  {t('Social Insurance compliance', 'الامتثال للتأمينات الاجتماعية', language)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {t('9.5% employee + 9.5% employer contribution', '9.5% اشتراك الموظف + 9.5% اشتراك صاحب العمل', language)}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            {t('Payroll History', 'سجل الرواتب', language)}
          </h2>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={columns}
            data={payrolls}
            loading={loading}
            locale={language}
            dir={dir}
            getRowKey={(p) => p.id}
          />
        </CardBody>
      </Card>
    </div>
  );
}
