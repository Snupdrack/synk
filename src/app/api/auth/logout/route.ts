import { NextResponse } from 'next/server';
import { getCurrentUser, destroySession } from '@/lib/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await destroySession(user.id);
    }
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('dax-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}
