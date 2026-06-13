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
    const mappedServices = services.map(s => {
      let fields = [];
      try {
        fields = typeof s.requiresData === 'string' ? JSON.parse(s.requiresData) : s.requiresData;
      } catch (e) {
        console.error('Error parsing requiresData for service:', s.id, e);
      }
      
      // If fields is just an array of strings (legacy), convert to field definitions
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
    console.error('Services error:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}
