import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const [
      totalUsers,
      totalOrders,
      totalServices,
      pendingOrders,
      pendingDeposits,
      totalRevenue,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      db.user.count({ where: { role: 'user' } }),
      db.order.count(),
      db.service.count({ where: { active: true } }),
      db.order.count({ where: { status: 'pending' } }),
      db.transaction.count({ where: { type: 'deposit', status: 'pending' } }),
      db.order.aggregate({ where: { status: { in: ['pending', 'processing', 'completed'] } }, _sum: { total: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } }, service: { select: { name: true, category: true } } },
      }),
      db.user.findMany({
        take: 5,
        where: { role: 'user' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
    ]);
    
    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalServices,
      pendingOrders,
      pendingDeposits,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
