import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: { service: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    const { serviceId, formData, notes } = await req.json();
    
    if (!serviceId) {
      return NextResponse.json({ error: 'ID de servicio requerido' }, { status: 400 });
    }
    
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.active) {
      return NextResponse.json({ error: 'Servicio no disponible' }, { status: 400 });
    }
    
    // Check balance
    if (user.balance < service.price) {
      return NextResponse.json({ error: 'Saldo insuficiente. Necesitas recargar tu cuenta.' }, { status: 400 });
    }
    
    // Deduct balance and create order in a transaction
    const order = await db.$transaction(async (tx) => {
      // Deduct from user balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: service.price } },
      });
      
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          serviceId: service.id,
          formData: JSON.stringify(formData || {}),
          notes: notes || null,
          total: service.price,
          status: 'pending',
        },
        include: { service: { include: { category: true } } },
      });
      
      // Create payment transaction
      await tx.transaction.create({
        data: {
          userId: user.id,
          orderId: newOrder.id,
          type: 'payment',
          amount: -service.price,
          status: 'approved',
          notes: `Pago por servicio: ${service.name}`,
        },
      });
      
      return newOrder;
    });
    
    // Return response
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Error al crear pedido' }, { status: 500 });
  }
}
