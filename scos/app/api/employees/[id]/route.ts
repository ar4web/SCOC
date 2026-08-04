import { NextResponse } from 'next/server';
import { getEmployeeById, updateEmployee } from '@/modules/employee-management/service';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const employee = getEmployeeById(params.id);
  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }
  return NextResponse.json(employee);
}

export async function PUT(req: Request, { params }: Params) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const employee = updateEmployee(params.id, body as Parameters<typeof updateEmployee>[1]);
  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }
  return NextResponse.json(employee);
}
