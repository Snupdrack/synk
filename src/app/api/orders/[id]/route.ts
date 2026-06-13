import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: { service: { include: { category: true } }, transactions: true },
    });
    
    if (!order || (user.role !== 'admin' && order.userId !== user.id)) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order detail error:', error);
    return NextResponse.json({ error: 'Error al obtener pedido' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    const { id } = await params;
    const order = await db.order.findUnique({ where: { id } });
    
    if (!order || (user.role !== 'admin' && order.userId !== user.id)) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    
    const body = await req.json();
    
    // User can only cancel their own orders
    if (user.role !== 'admin' && body.status !== 'cancelled') {
      return NextResponse.json({ error: 'Solo puedes cancelar pedidos' }, { status: 403 });
    }
    
    // If cancelling, refund balance
    if (body.status === 'cancelled' && order.status !== 'cancelled') {
      await db.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: order.userId },
          data: { balance: { increment: order.total } },
        });
        
        await tx.transaction.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            type: 'refund',
            amount: order.total,
            status: 'approved',
            notes: 'Reembolso por cancelación de pedido',
          },
        });
        
        await tx.order.update({
          where: { id },
          data: { status: 'cancelled' },
        });
      });
    } else {
      await db.order.update({
        where: { id },
        data: body,
      });
    }
    
    const updated = await db.order.findUnique({
      where: { id },
      include: { service: { include: { category: true } } },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 });
  }
}
