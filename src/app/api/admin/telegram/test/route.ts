import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { testTelegramNotification } from '@/lib/telegram';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
    }
    
    const result = await testTelegramNotification();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Telegram test API error:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}
