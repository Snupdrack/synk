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
    
    const transaction = await db.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 });
    }
    
    // If approving a deposit, add balance to user
    if (body.status === 'approved' && transaction.type === 'deposit' && transaction.status === 'pending') {
      await db.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: transaction.userId },
          data: { balance: { increment: transaction.amount } },
        });
        await tx.transaction.update({
          where: { id },
          data: { status: 'approved' },
        });
      });
    } else if (body.status === 'rejected' && transaction.status === 'pending') {
      await db.transaction.update({
        where: { id },
        data: { status: 'rejected' },
      });
    } else {
      await db.transaction.update({
        where: { id },
        data: body,
      });
    }
    
    const updated = await db.transaction.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json({ error: 'Error al actualizar transacción' }, { status: 500 });
  }
}
