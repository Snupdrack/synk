import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      balance: user.balance,
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 });
  }
}
