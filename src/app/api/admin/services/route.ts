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
    
    // Map requiresData to fields for frontend
    const mappedServices = services.map(s => {
      let fields = [];
      try {
        fields = typeof s.requiresData === 'string' ? JSON.parse(s.requiresData) : s.requiresData;
      } catch (e) {
        console.error('Error parsing requiresData for service:', s.id, e);
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

      return {
        ...s,
        fields: JSON.stringify(normalizedFields),
      };
    });
    
    return NextResponse.json(mappedServices);
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
    
    const { name, description, price, deliveryTime, categorySlug, fields, icon, sortOrder, active } = await req.json();
    
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
        requiresData: JSON.stringify(fields || []),
        icon: icon || 'FileText',
        sortOrder: sortOrder || 0,
        active: active !== false,
      },
      include: { category: true },
    });
    
    let responseFields = [];
    try {
      responseFields = typeof service.requiresData === 'string' ? JSON.parse(service.requiresData) : service.requiresData;
    } catch (e) {
      console.error('Error parsing requiresData for service:', service.id, e);
    }

    const normalizedFields = Array.isArray(responseFields) ? responseFields.map(f => {
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
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create service error:', error);
    if (error?.code === 'P2003' || error?.message?.includes('Foreign key')) {
      return NextResponse.json({ error: 'La categoría especificada no existe en la base de datos' }, { status: 400 });
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un servicio con ese nombre (slug duplicado)' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}
