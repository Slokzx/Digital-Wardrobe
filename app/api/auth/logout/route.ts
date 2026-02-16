import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dw_session')?.value;
  if (token) await prisma.session.deleteMany({ where: { token } });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
