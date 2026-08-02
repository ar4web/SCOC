'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormBuilder, FormField } from '@/engines/form-engine';
import { employeeService } from '@/modules/employee-management/service';
import { Employee } from '@/types';
import { t } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';

export default function NewEmployeePage() {
  const router = useRouter();
  const { language, dir } = useLanguageStore();
  const { addToast } = useToast();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  const mergeValues = (next: Record<string, string>) =>
    setValues((prev) => ({ ...prev, ...next }));

  const handleSubmit = async () => {
    setSaving(true);

    const data = {
      companyId: 'demo-company',
      fullName: values.fullName || '',
      fullNameAr: values.fullNameAr || '',
      email: values.email || '',
      phone: values.phone || '',
      nationalId: values.nationalId || '',
      nationality: values.nationality || 'Saudi',
      religion: 'muslim' as const,
      gender: (values.gender as 'male' | 'female') || 'male',
      maritalStatus: (values.maritalStatus as 'single' | 'married') || 'single',
      dateOfBirth: values.dateOfBirth || '',
      hireDate: values.hireDate || '',
      contractType: (values.contractType as Employee['contractType']) || 'permanent',
      department: values.department || '',
      position: values.position || '',
      salary: {
        basic: parseFloat(values.basic) || 0,
        housing: parseFloat(values.housing) || 0,
        transportation: parseFloat(values.transportation) || 0,
        otherAllowances: 0,
        total: 0,
        bankName: values.bankName || '',
        bankAccount: values.bankAccount || '',
        iban: values.iban || '',
      },
      address: {
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Saudi Arabia',
      },
      emergencyContact: {
        name: values.emergencyName || '',
        relation: values.emergencyRelation || '',
        phone: values.emergencyPhone || '',
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

  const personalFields: FormField[][] = [
    [
      { name: 'fullName', label: 'Full Name (English)', labelAr: 'الاسم الكامل (إنجليزي)', required: true },
      { name: 'fullNameAr', label: 'Full Name (Arabic)', labelAr: 'الاسم الكامل (عربي)' },
      { name: 'email', label: 'Email', labelAr: 'البريد الإلكتروني', type: 'email', required: true },
      { name: 'phone', label: 'Phone', labelAr: 'رقم الهاتف', type: 'tel', required: true },
      {
        name: 'nationalId',
        label: 'National ID (Iqama)',
        labelAr: 'رقم الهوية/الإقامة',
        required: true,
        helperText: '10 digits',
        helperTextAr: '10 أرقام',
        validation: { pattern: /^\d{10}$/ },
      },
      { name: 'nationality', label: 'Nationality', labelAr: 'الجنسية' },
      { name: 'dateOfBirth', label: 'Date of Birth', labelAr: 'تاريخ الميلاد', type: 'date', required: true },
      { name: 'hireDate', label: 'Hire Date', labelAr: 'تاريخ التعيين', type: 'date', required: true },
    ],
    [
      {
        name: 'gender',
        label: 'Gender',
        labelAr: 'الجنس',
        type: 'select',
        options: [
          { value: 'male', label: 'Male', labelAr: 'ذكر' },
          { value: 'female', label: 'Female', labelAr: 'أنثى' },
        ],
      },
      {
        name: 'maritalStatus',
        label: 'Marital Status',
        labelAr: 'الحالة الاجتماعية',
        type: 'select',
        options: [
          { value: 'single', label: 'Single', labelAr: 'أعزب' },
          { value: 'married', label: 'Married', labelAr: 'متزوج' },
        ],
      },
      {
        name: 'contractType',
        label: 'Contract Type',
        labelAr: 'نوع العقد',
        type: 'select',
        options: [
          { value: 'permanent', label: 'Permanent', labelAr: 'دائم' },
          { value: 'fixed_term', label: 'Fixed Term', labelAr: 'محدد المدة' },
          { value: 'part_time', label: 'Part Time', labelAr: 'دوام جزئي' },
          { value: 'probation', label: 'Probation', labelAr: 'تجريبي' },
        ],
      },
    ],
  ];

  const employmentFields: FormField[][] = [
    [
      { name: 'department', label: 'Department', labelAr: 'القسم', required: true },
      { name: 'position', label: 'Position', labelAr: 'المنصب', required: true },
    ],
  ];

  const salaryFields: FormField[][] = [
    [
      { name: 'basic', label: 'Basic Salary', labelAr: 'الراتب الأساسي', type: 'number' },
      { name: 'housing', label: 'Housing Allowance', labelAr: 'بدل السكن', type: 'number' },
      { name: 'transportation', label: 'Transportation Allowance', labelAr: 'بدل المواصلات', type: 'number' },
      { name: 'bankName', label: 'Bank Name', labelAr: 'اسم البنك' },
      { name: 'bankAccount', label: 'Bank Account', labelAr: 'رقم الحساب' },
      { name: 'iban', label: 'IBAN', labelAr: 'رقم الآيبان' },
    ],
  ];

  const emergencyFields: FormField[][] = [
    [
      { name: 'emergencyName', label: 'Name', labelAr: 'الاسم' },
      { name: 'emergencyRelation', label: 'Relation', labelAr: 'صلة القرابة' },
      { name: 'emergencyPhone', label: 'Phone', labelAr: 'رقم الهاتف', type: 'tel' },
    ],
  ];

  const sections = [
    {
      title: t('Personal Information', 'المعلومات الشخصية', language),
      icon: <UserPlus className="h-5 w-5 text-primary" />,
      fields: personalFields,
    },
    {
      title: t('Employment Details', 'تفاصيل التوظيف', language),
      fields: employmentFields,
    },
    {
      title: t('Salary Information', 'معلومات الراتب', language),
      fields: salaryFields,
    },
    {
      title: t('Emergency Contact', 'جهة الاتصال في الطوارئ', language),
      fields: emergencyFields,
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className={`h-5 w-5 text-gray-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
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

      {sections.map((section, idx) => (
        <Card key={idx}>
          <CardHeader className="flex items-center gap-3">
            {section.icon && (
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {section.icon}
              </div>
            )}
            <h2 className="text-lg font-semibold">{section.title}</h2>
          </CardHeader>
          <CardBody>
            <FormBuilder
              fields={section.fields}
              locale={language}
              onValuesChange={mergeValues}
              showSubmit={false}
            />
          </CardBody>
        </Card>
      ))}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          {t('Cancel', 'إلغاء', language)}
        </Button>
        <Button onClick={handleSubmit} loading={saving}>
          <Save className="h-4 w-4" />
          {t('Save Employee', 'حفظ الموظف', language)}
        </Button>
      </div>
    </div>
  );
}
