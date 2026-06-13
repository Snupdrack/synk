import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const transactions = await db.transaction.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { include: { service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Admin transactions error:', error);
    return NextResponse.json({ error: 'Error al obtener transacciones' }, { status: 500 });
  }
}
