'use client';

import React from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { useCompanyStore } from '@/stores/company-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { employees } from '@/lib/mock-data';
import { Users, Calendar, Clock, DollarSign, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { language } = useLanguageStore();
  const { company } = useCompanyStore();
  const employeeList = Array.from(employees.values());
  const activeEmployees = employeeList.filter((e) => e.status === 'active');

  const stats = [
    {
      label: language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees',
      value: employeeList.length.toString(),
      icon: Users,
      color: 'text-primary bg-primary/10',
    },
    {
      label: language === 'ar' ? 'الموظفون النشطون' : 'Active Employees',
      value: activeEmployees.length.toString(),
      icon: Activity,
      color: 'text-success bg-success/10',
    },
    {
      label: language === 'ar' ? 'الإجازات المعلقة' : 'Pending Leaves',
      value: '0',
      icon: Calendar,
      color: 'text-warning bg-warning/10',
    },
    {
      label: language === 'ar' ? 'معدل الحضور' : 'Attendance Rate',
      value: '--',
      icon: Clock,
      color: 'text-info bg-info/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'لوحة القيادة' : 'Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {language === 'ar'
            ? `مرحباً بك في ${company?.nameAr || company?.name || 'SCOS'}`
            : `Welcome to ${company?.name || 'SCOS'}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardBody className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'ar' ? 'الموظفون الجدد' : 'Recent Employees'}
            </h2>
          </CardHeader>
          <CardBody>
            {employeeList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {language === 'ar'
                    ? 'لم يتم إضافة أي موظفين بعد'
                    : 'No employees added yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {employeeList.slice(0, 5).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.fullName}</p>
                      <p className="text-xs text-gray-500">{emp.employeeId} - {emp.position}</p>
                    </div>
                    <span className="text-xs text-gray-400">{emp.department}</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'ar' ? 'نشاط الشركة' : 'Company Activity'}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                {language === 'ar' ? 'ابدأ بإضافة الموظفين' : 'Start by adding employees'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'ar'
                  ? 'سيتم عرض النشاطات هنا'
                  : 'Activity will be displayed here'}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
