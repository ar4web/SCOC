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
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const data = {
      companyId: 'demo-company',
      fullName: form.get('fullName') as string,
      fullNameAr: form.get('fullNameAr') as string || '',
      email: form.get('email') as string,
      phone: form.get('phone') as string,
      nationalId: form.get('nationalId') as string,
      nationality: form.get('nationality') as string || 'Saudi',
      religion: 'muslim' as const,
      gender: (form.get('gender') as 'male' | 'female') || 'male',
      maritalStatus: (form.get('maritalStatus') as 'single' | 'married') || 'single',
      dateOfBirth: form.get('dateOfBirth') as string,
      hireDate: form.get('hireDate') as string,
      contractType: (form.get('contractType') as 'permanent' | 'fixed_term' | 'part_time' | 'probation') || 'permanent',
      department: form.get('department') as string,
      position: form.get('position') as string,
      salary: {
        basic: parseFloat(form.get('basic') as string) || 0,
        housing: parseFloat(form.get('housing') as string) || 0,
        transportation: parseFloat(form.get('transportation') as string) || 0,
        otherAllowances: 0,
        total: 0,
        bankName: form.get('bankName') as string || '',
        bankAccount: form.get('bankAccount') as string || '',
        iban: form.get('iban') as string || '',
      },
      address: {
        street: form.get('street') as string || '',
        city: form.get('city') as string || '',
        region: form.get('region') as string || '',
        postalCode: form.get('postalCode') as string || '',
        country: form.get('country') as string || 'Saudi Arabia',
      },
      emergencyContact: {
        name: form.get('emergencyName') as string || '',
        relation: form.get('emergencyRelation') as string || '',
        phone: form.get('emergencyPhone') as string || '',
      },
      status: 'active' as const,
      documents: [],
    };

    const res = await employeeService.create(data);
    setSaving(false);

    if (res.success) {
      router.push('/employees');
    } else {
      addToast({ type: 'error', title: res.error || t('Failed to create employee', 'فشل في إنشاء الموظف', language) });
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Add Employee', 'إضافة موظف', language)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Add a new employee to the system', 'إضافة موظف جديد للنظام', language)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              {t('Personal Information', 'المعلومات الشخصية', language)}
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t('Full Name (English)', 'الاسم الكامل (إنجليزي)', language)} name="fullName" required />
              <Input label={t('Full Name (Arabic)', 'الاسم الكامل (عربي)', language)} name="fullNameAr" />
              <Input label={t('Email', 'البريد الإلكتروني', language)} name="email" type="email" required />
              <Input label={t('Phone', 'رقم الهاتف', language)} name="phone" type="tel" required />
              <Input
                label={t('National ID (Iqama)', 'رقم الهوية/الإقامة', language)}
                name="nationalId"
                required
                helperText={t('10 digits', '10 أرقام', language)}
              />
              <Input label={t('Nationality', 'الجنسية', language)} name="nationality" defaultValue="Saudi" />
              <Input label={t('Date of Birth', 'تاريخ الميلاد', language)} name="dateOfBirth" type="date" required />
              <Input label={t('Hire Date', 'تاريخ التعيين', language)} name="hireDate" type="date" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Gender', 'الجنس', language)}
                </label>
                <select name="gender" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                  <option value="male">{t('Male', 'ذكر', language)}</option>
                  <option value="female">{t('Female', 'أنثى', language)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Marital Status', 'الحالة الاجتماعية', language)}
                </label>
                <select name="maritalStatus" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                  <option value="single">{t('Single', 'أعزب', language)}</option>
                  <option value="married">{t('Married', 'متزوج', language)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Contract Type', 'نوع العقد', language)}
                </label>
                <select name="contractType" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                  <option value="permanent">{t('Permanent', 'دائم', language)}</option>
                  <option value="fixed_term">{t('Fixed Term', 'محدد المدة', language)}</option>
                  <option value="part_time">{t('Part Time', 'دوام جزئي', language)}</option>
                  <option value="probation">{t('Probation', 'تجريبي', language)}</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">{t('Employment Details', 'تفاصيل التوظيف', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t('Department', 'القسم', language)} name="department" required />
              <Input label={t('Position', 'المنصب', language)} name="position" required />
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">{t('Salary Information', 'معلومات الراتب', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label={t('Basic Salary', 'الراتب الأساسي', language)} name="basic" type="number" />
              <Input label={t('Housing Allowance', 'بدل السكن', language)} name="housing" type="number" />
              <Input label={t('Transportation Allowance', 'بدل المواصلات', language)} name="transportation" type="number" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label={t('Bank Name', 'اسم البنك', language)} name="bankName" />
              <Input label={t('Bank Account', 'رقم الحساب', language)} name="bankAccount" />
              <Input label={t('IBAN', 'رقم الآيبان', language)} name="iban" />
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">{t('Emergency Contact', 'جهة الاتصال في الطوارئ', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label={t('Name', 'الاسم', language)} name="emergencyName" />
              <Input label={t('Relation', 'صلة القرابة', language)} name="emergencyRelation" />
              <Input label={t('Phone', 'رقم الهاتف', language)} name="emergencyPhone" type="tel" />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            {t('Cancel', 'إلغاء', language)}
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            {t('Save Employee', 'حفظ الموظف', language)}
          </Button>
        </div>
      </form>
    </div>
  );
}
