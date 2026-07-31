'use client';

import React from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { employeeService } from '@/modules/employee-management/service';
import { Employee } from '@/types';
import { t, formatDate, formatEmployeeId } from '@/lib/utils';
import { Users, Plus, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployeesPage() {
  const { language, dir } = useLanguageStore();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const pageSize = 10;

  React.useEffect(() => {
    loadEmployees();
  }, [page, search]);

  const loadEmployees = async () => {
    setLoading(true);
    const res = await employeeService.list({ page, pageSize, search });
    if (res.success && res.data) {
      setEmployees(res.data.data);
      setTotal(res.data.total);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(total / pageSize);

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
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t('Search employees...', 'بحث عن موظف...', language)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={6} cols={6} />
            </div>
          ) : employees.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t('No employees found', 'لم يتم العثور على موظفين', language)}
              description={t('Start adding employees to build your workforce', 'ابدأ بإضافة الموظفين لبناء قوتك العاملة', language)}
              locale={language}
              action={
                <Link href="/employees/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    {t('Add Employee', 'إضافة موظف', language)}
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('ID', 'الرقم', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Name', 'الاسم', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Department', 'القسم', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Position', 'المنصب', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Status', 'الحالة', language)}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Actions', 'الإجراءات', language)}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.employeeId}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {language === 'ar' ? emp.fullNameAr || emp.fullName : emp.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                      <td className="px-6 py-4">
                        <Badge status={emp.status} locale={language} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/employees/${emp.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          {t('View', 'عرض', language)}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            {dir === 'rtl' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <span className="text-sm text-gray-600">
            {t('Page', 'صفحة', language)} {page} {t('of', 'من', language)} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            {dir === 'rtl' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
