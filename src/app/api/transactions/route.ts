import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      include: { order: { include: { service: true } } },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions error:', error);
    return NextResponse.json({ error: 'Error al obtener transacciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    const { amount, reference, notes } = await req.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }
    
    if (!reference) {
      return NextResponse.json({ error: 'Referencia de pago requerida' }, { status: 400 });
    }
    
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        type: 'deposit',
        amount,
        status: 'pending',
        reference,
        notes: notes || null,
      },
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Create deposit error:', error);
    return NextResponse.json({ error: 'Error al solicitar recarga' }, { status: 500 });
  }
}
