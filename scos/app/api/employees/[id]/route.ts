import { NextResponse } from 'next/server';
import { employees } from '@/lib/mock-data';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const employee = employees.get(params.id);
  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }
  return NextResponse.json(employee);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const employee = employees.get(params.id);
  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }
  const body = await req.json();
  Object.assign(employee, body, { updatedAt: new Date().toISOString() });
  return NextResponse.json(employee);
}
