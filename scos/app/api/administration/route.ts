import { NextResponse } from 'next/server';
import { getUsers, getAuditLogs, addAuditLog } from '@/lib/admin-engine';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'users';

  if (type === 'audit') {
    return NextResponse.json({ data: getAuditLogs() });
  }

  return NextResponse.json({ data: getUsers() });
}
