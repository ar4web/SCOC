'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/language-store';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { LeaveCalendar } from '@/components/modules/LeaveCalendar';
import { leaveService } from '@/modules/leave-management/service';
import { employees } from '@/lib/mock-data';
import { LeaveRequest } from '@/types';
import { t, formatDate, getLeaveTypeLabel } from '@/lib/utils';
import { Calendar, Plus, CheckCircle2, XCircle, List, Clock } from 'lucide-react';

export default function LeavesPage() {
  const { language, dir } = useLanguageStore();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [leaves, setLeaves] = React.useState<LeaveRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<'list' | 'calendar'>('list');

  React.useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    setLoading(true);
    const res = await leaveService.list();
    if (res.success && res.data) {
      setLeaves(res.data.data);
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
      loadLeaves();
    } else {
      addToast({ type: 'error', title: res.error || 'Action failed' });
    }
    setActionLoading(null);
  };

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
            <LeaveCalendar leaves={leaves} locale={language} dir={dir} />
          ) : loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} cols={6} />
            </div>
          ) : leaves.length === 0 ? (
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Employee', 'الموظف', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Type', 'النوع', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Dates', 'التواريخ', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Days', 'الأيام', language)}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Status', 'الحالة', language)}
                    </th>
                    {isManager && (
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Actions', 'الإجراءات', language)}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leaves.map((leave) => {
                    const emp = employees.get(leave.employeeId);
                    return (
                      <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {emp ? (language === 'ar' ? emp.fullNameAr || emp.fullName : emp.fullName) : leave.employeeId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getLeaveTypeLabel(leave.type, language)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{leave.daysCount}</td>
                        <td className="px-6 py-4">
                          <Badge status={leave.status} locale={language} />
                        </td>
                        {isManager && (
                          <td className="px-6 py-4 text-right">
                            {leave.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
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
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
