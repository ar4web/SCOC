'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { employeeService } from '@/modules/employee-management/service';
import { Employee } from '@/types';
import { t, formatDate, formatCurrency, getContractTypeLabel, calculateAge } from '@/lib/utils';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Heart, SearchX } from 'lucide-react';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguageStore();
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    const res = await employeeService.getById(id as string);
    if (res.success && res.data) {
      setEmployee(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!employee) {
    return (
      <EmptyState
        icon={SearchX}
        title={t('Employee not found', 'لم يتم العثور على الموظف', language)}
        description={t('The employee record you are looking for does not exist', 'سجل الموظف الذي تبحث عنه غير موجود', language)}
        locale={language}
        action={
          <Button variant="outline" onClick={() => router.push('/employees')}>
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Employees', 'العودة للموظفين', language)}
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? employee.fullNameAr || employee.fullName : employee.fullName}
          </h1>
          <p className="text-sm text-gray-500">{employee.employeeId} - {employee.position}</p>
        </div>
        <Badge status={employee.status} locale={language} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('Personal Info', 'معلومات شخصية', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('National ID', 'رقم الهوية', language)}</span>
              <span className="text-sm font-medium">{employee.nationalId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Date of Birth', 'تاريخ الميلاد', language)}</span>
              <span className="text-sm font-medium">{formatDate(employee.dateOfBirth)} ({calculateAge(employee.dateOfBirth)} years)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Gender', 'الجنس', language)}</span>
              <span className="text-sm font-medium capitalize">{employee.gender}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Marital Status', 'الحالة الاجتماعية', language)}</span>
              <span className="text-sm font-medium capitalize">{employee.maritalStatus}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('Employment', 'التوظيف', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Department', 'القسم', language)}</span>
              <span className="text-sm font-medium">{employee.department}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Position', 'المنصب', language)}</span>
              <span className="text-sm font-medium">{employee.position}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Contract', 'العقد', language)}</span>
              <span className="text-sm font-medium">{getContractTypeLabel(employee.contractType, language)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Hire Date', 'تاريخ التعيين', language)}</span>
              <span className="text-sm font-medium">{formatDate(employee.hireDate)}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('Salary', 'الراتب', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Basic', 'أساسي', language)}</span>
              <span className="text-sm font-medium">{formatCurrency(employee.salary.basic)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Housing', 'سكن', language)}</span>
              <span className="text-sm font-medium">{formatCurrency(employee.salary.housing)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">{t('Transportation', 'مواصلات', language)}</span>
              <span className="text-sm font-medium">{formatCurrency(employee.salary.transportation)}</span>
            </div>
            {employee.salary.otherAllowances > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500">{t('Other Allowances', 'بدلات أخرى', language)}</span>
                <span className="text-sm font-medium">{formatCurrency(employee.salary.otherAllowances)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-t pt-3">
              <span className="text-sm font-semibold text-gray-900">{t('Total', 'الإجمالي', language)}</span>
              <span className="text-sm font-bold text-primary">
                {formatCurrency(employee.salary.total)}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('Contact & Address', 'جهات الاتصال والعنوان', language)}</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{employee.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="text-sm">
                <p>{employee.address.street}</p>
                <p>{employee.address.city}, {employee.address.region}</p>
              </div>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-error" />
                <span className="text-sm font-medium">{t('Emergency Contact', 'جهة اتصال طارئة', language)}</span>
              </div>
              <p className="text-sm">{employee.emergencyContact.name} ({employee.emergencyContact.relation})</p>
              <p className="text-sm text-gray-500">{employee.emergencyContact.phone}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
