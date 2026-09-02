import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // confirm the database is actually reachable, not just that the API process is alive
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: 'Database unreachable' }, { status: 503 });
  }
}