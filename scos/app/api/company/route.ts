import { NextResponse } from 'next/server';
import { companies } from '@/lib/mock-data';

export async function GET() {
  const company = companies.get('demo-company');
  return NextResponse.json(company);
}

export async function PUT(req: Request) {
  const company = companies.get('demo-company');
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  const body = await req.json();
  Object.assign(company, body);
  return NextResponse.json(company);
}
