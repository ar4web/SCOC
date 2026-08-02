'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { employeeService } from '@/modules/employee-management/service';
import { t } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';

export default function NewEmployeePage() {
  const router = useRouter();
  const { language, dir } = useLanguageStore();
  const { addToast } = useToast();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  const setValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      companyId: 'demo-company',
      fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim(),
      fullNameAr: values.firstNameAr || '',
      email: values.email || '',
      phone: values.phone || '',
      nationalId: values.nationalId || '',
      nationality: values.nationality || 'Saudi',
      religion: 'muslim' as const,
      gender: 'male' as const,
      maritalStatus: 'single' as const,
      dateOfBirth: values.dateOfBirth || '',
      hireDate: values.hireDate || new Date().toISOString().split('T')[0],
      contractType: 'permanent' as const,
      department: values.department || '',
      position: values.role || '',
      salary: {
        basic: parseFloat(values.basicSalary) || 0,
        housing: parseFloat(values.housingAllowance) || 0,
        transportation: parseFloat(values.transportAllowance) || 0,
        otherAllowances: 0,
        total: 0,
        bankName: values.bankName || '',
        bankAccount: values.bankAccount || '',
        iban: values.iban || '',
      },
      address: {
        street: '',
        city: values.city || '',
        region: '',
        postalCode: '',
        country: 'Saudi Arabia',
      },
      emergencyContact: {
        name: '',
        relation: '',
        phone: '',
      },
      status: 'active' as const,
      documents: [],
    };

    const res = await employeeService.create(data);
    setSaving(false);

    if (res.success) {
      addToast({
        type: 'success',
        title: t('Employee created successfully', 'تم إنشاء الموظف بنجاح', language),
      });
      router.push('/employees');
    } else {
      addToast({ type: 'error', title: res.error || t('Failed to create employee', 'فشل في إنشاء الموظف', language) });
    }
  };

  const sectionLabel = (title: string) => (
    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6" dir={dir}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Add Employee', 'إضافة موظف', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Register a new employee record', 'تسجيل سجل موظف جديد', language)}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/employees')}>
          <ArrowLeft className="h-4 w-4" />
          {t('Back', 'رجوع', language)}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            {sectionLabel(t('Personal Details', 'البيانات الشخصية', language))}
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('First Name', 'الاسم الأول', language)}
              value={values.firstName || ''}
              onChange={setValue('firstName')}
              required
            />
            <Input
              label={t('Last Name', 'اسم العائلة', language)}
              value={values.lastName || ''}
              onChange={setValue('lastName')}
              required
            />
            <Input
              label={t('Email', 'البريد الإلكتروني', language)}
              type="email"
              value={values.email || ''}
              onChange={setValue('email')}
            />
            <Input
              label={t('Phone', 'الهاتف', language)}
              value={values.phone || ''}
              onChange={setValue('phone')}
            />
            <Input
              label={t('Nationality', 'الجنسية', language)}
              value={values.nationality || ''}
              onChange={setValue('nationality')}
              placeholder="Saudi"
            />
            <Input
              label={t('Iqama / National ID', 'رقم الهوية / الإقامة', language)}
              value={values.nationalId || ''}
              onChange={setValue('nationalId')}
              required
            />
            <Input
              label={t('Date of Birth', 'تاريخ الميلاد', language)}
              type="date"
              value={values.dateOfBirth || ''}
              onChange={setValue('dateOfBirth')}
            />
            <Input
              label={t('City', 'المدينة', language)}
              value={values.city || ''}
              onChange={setValue('city')}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            {sectionLabel(t('Employment Details', 'البيانات الوظيفية', language))}
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('Department', 'القسم', language)}
              value={values.department || ''}
              onChange={setValue('department')}
              required
            />
            <Input
              label={t('Role', 'الوظيفة', language)}
              value={values.role || ''}
              onChange={setValue('role')}
              required
            />
            <Input
              label={t('Hire Date', 'تاريخ التعيين', language)}
              type="date"
              value={values.hireDate || ''}
              onChange={setValue('hireDate')}
            />
            <Input
              label={t('Bank Name', 'اسم البنك', language)}
              value={values.bankName || ''}
              onChange={setValue('bankName')}
            />
            <Input
              label={t('IBAN', 'الآيبان', language)}
              value={values.iban || ''}
              onChange={setValue('iban')}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            {sectionLabel(t('Salary Info', 'الراتب', language))}
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label={t('Basic Salary', 'الراتب الأساسي', language)}
              type="number"
              min={0}
              value={values.basicSalary || ''}
              onChange={setValue('basicSalary')}
              required
            />
            <Input
              label={t('Housing Allowance', 'بدل السكن', language)}
              type="number"
              min={0}
              value={values.housingAllowance || ''}
              onChange={setValue('housingAllowance')}
            />
            <Input
              label={t('Transport Allowance', 'بدل النقل', language)}
              type="number"
              min={0}
              value={values.transportAllowance || ''}
              onChange={setValue('transportAllowance')}
            />
          </CardBody>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/employees')}>
            {t('Cancel', 'إلغاء', language)}
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            {saving ? t('Saving...', 'جارٍ الحفظ...', language) : t('Save Employee', 'حفظ الموظف', language)}
          </Button>
        </div>
      </form>
    </div>
  );
}
