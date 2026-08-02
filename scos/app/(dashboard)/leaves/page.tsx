'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/language-store';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/engines/table-engine';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { LeaveCalendar } from '@/components/modules/LeaveCalendar';
import { leaveService } from '@/modules/leave-management/service';
import { employeeService } from '@/modules/employee-management/service';
import { Employee, LeaveRequest } from '@/types';
import { t, formatDate, getLeaveTypeLabel } from '@/lib/utils';
import { Calendar, Plus, CheckCircle2, XCircle, List, Clock } from 'lucide-react';

export default function LeavesPage() {
  const { language, dir } = useLanguageStore();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [leaves, setLeaves] = React.useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = React.useState<Map<string, Employee>>(new Map());
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<'list' | 'calendar'>('list');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [leaveRes, empRes] = await Promise.all([
      leaveService.list(),
      employeeService.getActive(),
    ]);
    if (leaveRes.success && leaveRes.data) {
      setLeaves(leaveRes.data.data);
    }
    if (empRes.success && empRes.data) {
      setEmployees(new Map(empRes.data.data.map((e) => [e.id, e])));
    }
    setLoading(false);
  };

  const isManager = user?.role === 'admin' || user?.role === 'hr_manager';

  const handleAction = async (leave: LeaveRequest, action: 'approve' | 'reject') => {
    setActionLoading(leave.id);
    const res = action === 'approve'
      ? await leaveService.approve(leave.id, user?.id || '')
      : await leaveService.reject(leave.id, user?.id || '');

    if (res.success) {
      addToast({
        type: 'success',
        title: action === 'approve'
          ? t('Leave approved', 'تمت الموافقة على الإجازة', language)
          : t('Leave rejected', 'تم رفض الإجازة', language),
      });
      loadData();
    } else {
      addToast({ type: 'error', title: res.error || 'Action failed' });
    }
    setActionLoading(null);
  };

  const getEmployeeName = (leave: LeaveRequest) => {
    const emp = employees.get(leave.employeeId);
    return emp ? (language === 'ar' ? emp.fullNameAr || emp.fullName : emp.fullName) : leave.employeeId;
  };

  const columns: Column<LeaveRequest>[] = [
    {
      key: 'employee',
      header: t('Employee', 'الموظف', language),
      render: (leave) => <span className="font-medium text-gray-900">{getEmployeeName(leave)}</span>,
    },
    {
      key: 'type',
      header: t('Type', 'النوع', language),
      render: (leave) => <span>{getLeaveTypeLabel(leave.type, language)}</span>,
    },
    {
      key: 'dates',
      header: t('Dates', 'التواريخ', language),
      render: (leave) => `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
    },
    { key: 'daysCount', header: t('Days', 'الأيام', language) },
    {
      key: 'status',
      header: t('Status', 'الحالة', language),
      render: (leave) => <Badge status={leave.status} locale={language} />,
    },
    ...(isManager
      ? [{
          key: 'actions',
          header: t('Actions', 'الإجراءات', language),
          render: (leave: LeaveRequest) =>
            leave.status === 'pending' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAction(leave, 'approve')}
                  disabled={actionLoading === leave.id}
                  className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-colors disabled:opacity-50"
                  aria-label={t('Approve', 'موافقة', language)}
                  title={t('Approve', 'موافقة', language)}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction(leave, 'reject')}
                  disabled={actionLoading === leave.id}
                  className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                  aria-label={t('Reject', 'رفض', language)}
                  title={t('Reject', 'رفض', language)}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400">
                {leave.approvedAt ? formatDate(leave.approvedAt) : '--'}
              </span>
            ),
        } as Column<LeaveRequest>]
      : []),
  ];

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Leave Management', 'إدارة الإجازات', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Manage leave requests and approvals', 'إدارة طلبات الإجازات والموافقات', language)}
          </p>
        </div>
        <Link href="/leaves/new">
          <Button>
            <Plus className="h-4 w-4" />
            {t('Request Leave', 'طلب إجازة', language)}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('list')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4 inline mr-1" />
              {t('List', 'قائمة', language)}
            </button>
            <button
              onClick={() => setTab('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-1" />
              {t('Calendar', 'التقويم', language)}
            </button>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-warning font-medium">
              <Clock className="h-3.5 w-3.5" />
              {t(`${pendingCount} pending`, `${pendingCount} قيد الانتظار`, language)}
            </div>
          )}
        </CardHeader>
        <CardBody className={tab === 'calendar' ? 'p-4' : 'p-0'}>
          {tab === 'calendar' ? (
            <LeaveCalendar leaves={leaves} employees={employees} locale={language} dir={dir} />
          ) : leaves.length === 0 && !loading ? (
            <EmptyState
              icon={Calendar}
              title={t('No leave requests yet', 'لا توجد طلبات إجازات بعد', language)}
              description={t('Submit a leave request to get started', 'قدّم طلب إجازة للبدء', language)}
              locale={language}
              action={
                <Link href="/leaves/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    {t('Request Leave', 'طلب إجازة', language)}
                  </Button>
                </Link>
              }
            />
          ) : (
            <DataTable<LeaveRequest>
              columns={columns}
              data={leaves}
              loading={loading}
              locale={language}
              dir={dir}
              emptyMessage={t('No leave requests yet', 'لا توجد طلبات إجازات بعد', language)}
              emptyMessageAr={t('No leave requests yet', 'لا توجد طلبات إجازات بعد', language)}
              getRowKey={(leave) => leave.id}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
