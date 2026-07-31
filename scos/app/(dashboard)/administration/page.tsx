'use client';

import React from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/engines/table-engine';
import { adminService, AuditLog } from '@/modules/administration/service';
import { User } from '@/types';
import { t, formatDate } from '@/lib/utils';
import { Shield, Activity, Users, ClipboardList } from 'lucide-react';

export default function AdministrationPage() {
  const { language, dir } = useLanguageStore();
  const [users, setUsers] = React.useState<User[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState<'users' | 'audit'>('users');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, auditRes] = await Promise.all([
      adminService.getUsers(),
      adminService.getAuditLogs(),
    ]);
    if (usersRes.success && usersRes.data) setUsers(usersRes.data.data);
    if (auditRes.success && auditRes.data) setAuditLogs(auditRes.data.data);
    setLoading(false);
  };

  const userColumns: Column<User>[] = [
    { key: 'name', header: t('Name', 'الاسم', language) },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: t('Role', 'الدور', language),
      render: (u) => (
        <Badge
          status={u.role === 'admin' ? 'active' : 'present'}
          locale={language}
        />
      ),
    },
    {
      key: 'language',
      header: t('Language', 'اللغة', language),
      render: (u) => <span className="capitalize text-sm">{u.language === 'ar' ? 'العربية' : 'English'}</span>,
    },
  ];

  const auditColumns: Column<AuditLog>[] = [
    { key: 'userName', header: t('User', 'المستخدم', language) },
    { key: 'action', header: t('Action', 'الإجراء', language) },
    { key: 'details', header: t('Details', 'التفاصيل', language) },
    {
      key: 'timestamp',
      header: t('Date', 'التاريخ', language),
      render: (l) => formatDate(l.timestamp),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('Administration', 'الإدارة', language)}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('User management and system monitoring', 'إدارة المستخدمين ومراقبة النظام', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-500">{t('Users', 'المستخدمون', language)}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              <p className="text-sm text-gray-500">{t('Audit Logs', 'سجلات التدقيق', language)}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.role === 'admin').length}</p>
              <p className="text-sm text-gray-500">{t('Admins', 'المديرون', language)}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.role === 'employee').length}</p>
              <p className="text-sm text-gray-500">{t('Employees', 'الموظفون', language)}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setTab('users')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === 'users' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" />
              {t('Users', 'المستخدمون', language)}
            </button>
            <button
              onClick={() => setTab('audit')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === 'audit' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Activity className="h-4 w-4 inline mr-1" />
              {t('Audit Log', 'سجل التدقيق', language)}
            </button>
          </div>
        </CardHeader>
        <CardBody>
          {tab === 'users' ? (
            <DataTable
              columns={userColumns}
              data={users}
              loading={loading}
              locale={language}
              dir={dir}
              getRowKey={(u) => u.id}
            />
          ) : (
            <DataTable
              columns={auditColumns}
              data={auditLogs}
              loading={loading}
              locale={language}
              dir={dir}
              getRowKey={(l) => l.id}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
