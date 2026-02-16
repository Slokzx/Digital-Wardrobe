import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Name, email and password (min 6 chars) required' },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email).toLowerCase(),
        passwordHash,
      },
    });
    const token = await createSession(user.id);
    await setSessionCookie(token);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
