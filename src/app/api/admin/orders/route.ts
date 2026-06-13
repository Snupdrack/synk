import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const orders = await db.order.findMany({
      include: { 
        user: { select: { id: true, name: true, email: true } },
        service: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}
