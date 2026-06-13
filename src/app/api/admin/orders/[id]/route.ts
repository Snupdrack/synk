import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const { id } = await params;
    const body = await req.json();
    
    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;
    
    // If cancelling, refund balance
    if (body.status === 'cancelled') {
      const order = await db.order.findUnique({ where: { id } });
      if (order && order.status !== 'cancelled') {
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
              notes: 'Reembolso por cancelación (admin)',
            },
          });
          await tx.order.update({
            where: { id },
            data: updateData,
          });
        });
      }
    } else {
      await db.order.update({
        where: { id },
        data: updateData,
      });
    }
    
    const updated = await db.order.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } }, service: { include: { category: true } } },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin update order error:', error);
    return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 });
  }
}
