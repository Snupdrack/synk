import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const services = await db.service.findMany({
      include: { category: true },
      orderBy: [{ categorySlug: 'asc' }, { sortOrder: 'asc' }],
    });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Admin services error:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const { name, description, price, deliveryTime, categorySlug, requiresData, icon, sortOrder, active } = await req.json();
    
    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Nombre y precio son requeridos' }, { status: 400 });
    }
    
    if (!categorySlug) {
      return NextResponse.json({ error: 'Categoría es requerida' }, { status: 400 });
    }
    
    const service = await db.service.create({
      data: {
        name,
        slug: slugify(name),
        description: description || '',
        price: parseFloat(price),
        deliveryTime: deliveryTime || '',
        categorySlug,
        requiresData: requiresData || '[]',
        icon: icon || 'FileText',
        sortOrder: sortOrder || 0,
        active: active !== false,
      },
      include: { category: true },
    });
    
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}
