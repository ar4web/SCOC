import { NextRequest, NextResponse } from 'next/server';
import { employees, addEmployee } from '@/lib/mock-data';
import { Employee } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const department = searchParams.get('department');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let list = Array.from(employees.values());

  if (search) {
    list = list.filter(
      (e) =>
        e.fullName.toLowerCase().includes(search) ||
        e.employeeId.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search)
    );
  }
  if (department) {
    list = list.filter((e) => e.department === department);
  }
  if (status) {
    list = list.filter((e) => e.status === status);
  }

  const total = list.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  return NextResponse.json({ data, total, page, pageSize, totalPages });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>;
  const employee = addEmployee({
    ...body,
    companyId: 'demo-company',
  });
  return NextResponse.json(employee, { status: 201 });
}
