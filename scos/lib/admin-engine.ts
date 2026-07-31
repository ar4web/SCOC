import { users } from '@/lib/mock-data';
import { User } from '@/types';

let auditLogs: AuditLog[] = [];

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export function getUsers(): (User & { password?: string })[] {
  return Array.from(users.values()).map(({ password, ...u }) => u);
}

export function getAuditLogs(): AuditLog[] {
  return auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addAuditLog(userId: string, userName: string, action: string, details: string) {
  const log: AuditLog = {
    id: Math.random().toString(36).substring(2, 10),
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  auditLogs.push(log);
  return log;
}

// Seed some audit logs
addAuditLog('user-1', 'Admin User', 'Login', 'Admin logged in');
addAuditLog('user-1', 'Admin User', 'Settings', 'Company profile updated');
addAuditLog('user-2', 'Employee User', 'Login', 'Employee logged in');
