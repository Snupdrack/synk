import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { notifyNewUser } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son requeridos' }, { status: 400 });
    }
    
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'user',
      }
    });
    
    const token = await createSession(user.id);
    
    // Notify via Telegram (don't await to avoid blocking)
    notifyNewUser(name, email).catch(() => {});
    
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
    });
    
    response.cookies.set('dax-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}
