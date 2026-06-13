import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const { id } = await params;
    const body = await req.json();
    
    const updateData: any = {};
    if (body.name !== undefined) {
      updateData.name = body.name;
      updateData.slug = slugify(body.name);
    }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.deliveryTime !== undefined) updateData.deliveryTime = body.deliveryTime;
    if (body.categorySlug !== undefined) updateData.categorySlug = body.categorySlug;
    if (body.fields !== undefined) updateData.requiresData = JSON.stringify(body.fields);
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.active !== undefined) updateData.active = body.active;
    
    const service = await db.service.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    let fields = [];
    try {
      fields = typeof service.requiresData === 'string' ? JSON.parse(service.requiresData) : service.requiresData;
    } catch (e) {
      console.error('Error parsing requiresData for service:', service.id, e);
    }

    const normalizedFields = Array.isArray(fields) ? fields.map(f => {
      if (typeof f === 'string') {
        return {
          key: f,
          label: f.charAt(0).toUpperCase() + f.slice(1).replace(/_/g, ' '),
          type: 'text',
          required: true,
          placeholder: ''
        };
      }
      return f;
    }) : [];

    return NextResponse.json({
      ...service,
      fields: JSON.stringify(normalizedFields)
    });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const { id } = await params;
    
    await db.service.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 });
  }
}
