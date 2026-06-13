import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: [{ categorySlug: 'asc' }, { sortOrder: 'asc' }],
    });
    
    // Map requiresData to fields for frontend
    const mappedServices = services.map(s => ({
      ...s,
      fields: s.requiresData,
    }));
    
    return NextResponse.json(mappedServices);
  } catch (error) {
    console.error('Services error:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}
