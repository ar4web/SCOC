import { NextResponse } from 'next/server';
import { companies, moduleDefinitions } from '@/lib/mock-data';

export async function GET() {
  const company = companies.get('demo-company');
  return NextResponse.json({
    modules: moduleDefinitions,
    states: company?.moduleStates,
  });
}

export async function PUT(req: Request) {
  const company = companies.get('demo-company');
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  const { moduleStates } = await req.json();
  company.moduleStates = moduleStates;
  return NextResponse.json({ moduleStates });
}
