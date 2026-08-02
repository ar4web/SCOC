'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/engines/table-engine';
import { employeeService } from '@/modules/employee-management/service';
import { Employee } from '@/types';
import { t, formatCurrency } from '@/lib/utils';
import { Users, Plus, Eye } from 'lucide-react';

export default function EmployeesPage() {
  const router = useRouter();
  const { language, dir } = useLanguageStore();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    const res = await employeeService.list({ page: 1, pageSize: 1000 });
    if (res.success && res.data) {
      setEmployees(res.data.data);
      setTotal(res.data.total);
    }
    setLoading(false);
  };

  const columns: Column<Employee>[] = [
    {
      key: 'employeeId',
      header: t('Employee ID', 'رقم الموظف', language),
      render: (emp) => <span className="font-medium text-gray-900">{emp.employeeId}</span>,
    },
    {
      key: 'fullName',
      header: t('Full Name', 'الاسم الكامل', language),
      render: (emp) => (
        <div>
          <p className="font-medium text-gray-900">
            {language === 'ar' ? emp.fullNameAr || emp.fullName : emp.fullName}
          </p>
          <p className="text-xs text-gray-500">{emp.email}</p>
        </div>
      ),
    },
    { key: 'department', header: t('Department', 'القسم', language) },
    { key: 'position', header: t('Role', 'الوظيفة', language) },
    { key: 'nationality', header: t('Nationality', 'الجنسية', language) },
    {
      key: 'total',
      header: t('Total Salary', 'إجمالي الراتب', language),
      render: (emp) => <span className="font-semibold text-gray-900">{formatCurrency(emp.salary.total)}</span>,
    },
    {
      key: 'actions',
      header: t('Actions', 'الإجراءات', language),
      render: (emp) => (
        <Link
          href={`/employees/${emp.id}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
        >
          <Eye className="h-4 w-4" />
          {t('View', 'عرض', language)}
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Employee Management', 'إدارة الموظفين', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Manage your workforce', 'إدارة القوى العاملة لديك', language)}
          </p>
        </div>
        <Link href="/employees/new">
          <Button>
            <Plus className="h-4 w-4" />
            {t('Add Employee', 'إضافة موظف', language)}
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody className="p-4 sm:p-6">
          <DataTable<Employee>
            columns={columns}
            data={employees}
            loading={loading}
            locale={language}
            dir={dir}
            emptyMessage={t('No employees found', 'لم يتم العثور على موظفين', language)}
            emptyMessageAr={t('No employees found', 'لم يتم العثور على موظفين', language)}
            getRowKey={(emp) => emp.id}
            onRowClick={(emp) => {
              router.push(`/employees/${emp.id}`);
            }}
          />
        </CardBody>
      </Card>

      {employees.length === 0 && !loading && (
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Users className="h-4 w-4" />
          {t('Start adding employees to build your workforce', 'ابدأ بإضافة الموظفين لبناء قوتك العاملة', language)}
        </div>
      )}
    </div>
  );
}
