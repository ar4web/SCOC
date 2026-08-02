import { Attendance, AttendanceStatus } from '@/types';
import { generateId } from '@/lib/utils';
import { employees } from '@/lib/mock-data';

let attendanceRecords: Map<string, Attendance> = new Map();

function resolveEmployeeId(employeeId: string): string | null {
  if (employees.has(employeeId)) return employeeId;
  const linked = Array.from(employees.values()).find((e) => e.userId === employeeId);
  return linked ? linked.id : null;
}

export function getAttendance(date?: string, employeeId?: string) {
  let list = Array.from(attendanceRecords.values());
  if (date) list = list.filter((a) => a.date === date);
  if (employeeId) {
    const resolved = resolveEmployeeId(employeeId) || employeeId;
    list = list.filter((a) => a.employeeId === resolved);
  }
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function clockIn(employeeId: string): { success: boolean; record?: Attendance; error?: string } {
  const resolved = resolveEmployeeId(employeeId);
  if (!resolved) {
    return { success: false, error: 'Employee not found' };
  }

  const today = new Date().toISOString().split('T')[0];
  const existing = Array.from(attendanceRecords.values()).find(
    (a) => a.employeeId === resolved && a.date === today
  );

  if (existing) {
    return { success: false, error: 'Already clocked in today' };
  }

  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const status: AttendanceStatus = hour >= 9 ? (hour === 9 && minutes <= 15 ? 'present' : 'late') : 'present';

  const record: Attendance = {
    id: generateId(),
    employeeId: resolved,
    companyId: 'demo-company',
    date: today,
    clockIn: time,
    status,
  };

  attendanceRecords.set(record.id, record);
  return { success: true, record };
}

export function clockOut(employeeId: string): { success: boolean; record?: Attendance; error?: string } {
  const resolved = resolveEmployeeId(employeeId);
  if (!resolved) {
    return { success: false, error: 'Employee not found' };
  }

  const today = new Date().toISOString().split('T')[0];
  const existing = Array.from(attendanceRecords.values()).find(
    (a) => a.employeeId === resolved && a.date === today
  );

  if (!existing) {
    return { success: false, error: 'No clock-in record found for today' };
  }

  if (existing.clockOut) {
    return { success: false, error: 'Already clocked out today' };
  }

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  existing.clockOut = time;

  return { success: true, record: existing };
}
