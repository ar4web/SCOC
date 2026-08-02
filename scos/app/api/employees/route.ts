import { NextResponse } from 'next/server';
import { Employee } from '@/types';
import { getAllEmployees, createEmployee } from '@/modules/employee-management/service';

export async function GET() {
  const data = getAllEmployees();
  return NextResponse.json({ data, total: data.length });
}

export async function POST(req: Request) {
  let body: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !body.fullName || !body.email) {
    return NextResponse.json({ error: 'fullName and email are required' }, { status: 400 });
  }

  const employee = createEmployee({
    ...body,
    companyId: 'demo-company',
  });

  return NextResponse.json(employee, { status: 201 });
}
