import { NextRequest, NextResponse } from 'next/server';
import { leaves, addLeave } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get('employeeId');
  const status = searchParams.get('status');

  let list = Array.from(leaves.values());

  if (employeeId) list = list.filter((l) => l.employeeId === employeeId);
  if (status) list = list.filter((l) => l.status === status);

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ data: list, total: list.length });
}

export async function POST(req: Request) {
  const body = await req.json();
  const leave = addLeave({
    ...body,
    companyId: 'demo-company',
    status: 'pending',
  });
  return NextResponse.json(leave, { status: 201 });
}
