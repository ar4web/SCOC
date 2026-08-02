'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Employee } from '@/types';
import { t, getLeaveTypeLabel } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { CalendarDays, Save, ArrowLeft } from 'lucide-react';

export default function NewLeavePage() {
  const router = useRouter();
  const { language, dir } = useLanguageStore();
  const { addToast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState('');
  const [leaveType, setLeaveType] = React.useState('annual');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await api.get<{ data: Employee[]; total: number }>('/employees');
    if (res.success && res.data) {
      setEmployees(res.data.data);
    }
    setLoading(false);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!selectedEmployee) {
      addToast({ type: 'warning', title: t('Please select an employee', 'الرجاء اختيار موظف', language) });
      setSaving(false);
      return;
    }

    const res = await api.post('/leaves', {
      employeeId: selectedEmployee,
      type: leaveType,
      startDate,
      endDate,
      reason,
    });

    setSaving(false);

    if (res.success) {
      addToast({
        type: 'success',
        title: t('Leave request submitted', 'تم إرسال طلب الإجازة', language),
      });
      router.push('/leaves');
    } else {
      addToast({ type: 'error', title: res.error || t('Failed to create leave request', 'فشل في إنشاء طلب الإجازة', language) });
    }
  };

  const selectClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary';

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className={`h-5 w-5 text-gray-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Request Leave', 'طلب إجازة', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Submit a new leave request', 'تقديم طلب إجازة جديد', language)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('Leave Details', 'تفاصيل الإجازة', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Employee', 'الموظف', language)}
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">
                  {loading
                    ? t('Loading...', 'جار التحميل...', language)
                    : t('Select employee...', 'اختر موظف...', language)}
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeId} - {language === 'ar' ? emp.fullNameAr || emp.fullName : emp.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Leave Type', 'نوع الإجازة', language)}
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className={selectClass}
              >
                {(['annual', 'sick', 'unpaid', 'emergency'] as const).map((type) => (
                  <option key={type} value={type}>
                    {getLeaveTypeLabel(type, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('Start Date', 'تاريخ البداية', language)}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label={t('End Date', 'تاريخ النهاية', language)}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            {startDate && endDate && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                <span className="font-medium text-primary">
                  {calculateDays()} {t('day(s)', 'يوم', language)}
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Reason', 'السبب', language)}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                placeholder={t('Enter reason for leave...', 'أدخل سبب الإجازة...', language)}
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            {t('Cancel', 'إلغاء', language)}
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            {t('Submit Request', 'تقديم الطلب', language)}
          </Button>
        </div>
      </form>
    </div>
  );
}
