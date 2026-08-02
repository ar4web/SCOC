import { users, auditLogs, addAuditLog as createAuditLog } from '@/lib/mock-data';
import { User, AuditLog } from '@/types';

export type { AuditLog };

export function getUsers(): (User & { password?: string })[] {
  return Array.from(users.values()).map(({ password, ...u }) => u);
}

export function getAuditLogs(): AuditLog[] {
  return Array.from(auditLogs.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const addAuditLog = createAuditLog;

export function recordLogin(userId: string, userName: string) {
  return createAuditLog(userId, userName, 'Login', `${userName} logged in`);
}
