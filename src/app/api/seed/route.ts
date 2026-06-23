import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST() {
  try {
    // Delete existing data in reverse dependency order
    await db.transaction.deleteMany();
    await db.order.deleteMany();
    await db.service.deleteMany();
    await db.category.deleteMany();
    await db.setting.deleteMany();
    await db.user.deleteMany();

    // ─── 1. Create Admin User ───
    const adminPassword = await hashPassword('admin123');
    await db.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@tramfast.io',
        password: adminPassword,
        role: 'admin',
        balance: 9999,
      },
    });

    // ─── 2. Create Sample User ───
    const userPassword = await hashPassword('user123');
    await db.user.create({
      data: {
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: userPassword,
        phone: '+52 55 1234 5678',
        role: 'user',
        balance: 500,
      },
    });

    // ─── 3. Create Categories ───
    const categoriesData = [
      { name: 'Actas y Certificados', slug: 'actas', icon: '📄', order: 1 },
      { name: 'Trámites Fiscales', slug: 'fiscales', icon: '💰', order: 2 },
      { name: 'IMSS e Infonavit', slug: 'imss', icon: '🏥', order: 3 },
      { name: 'Buró y Crédito', slug: 'creditos', icon: '🏦', order: 4 },
      { name: 'Permisos de Conducir', slug: 'conducir', icon: '🚗', order: 5 },
      { name: 'Licencias y Software', slug: 'licencias', icon: '💿', order: 6 },
      { name: 'Streaming e IPTV', slug: 'streaming', icon: '📺', order: 7 },
      { name: 'Identidad y CURP', slug: 'identidad', icon: '🪪', order: 8 },
      { name: 'Plataformas de Streaming', slug: 'plataformas', icon: '🎬', order: 9 },
      { name: 'Software y Herramientas', slug: 'software', icon: '🛠️', order: 10 },
      { name: 'OSINT e Inteligencia', slug: 'osint', icon: '🔍', order: 11 },
    ];

    for (const cat of categoriesData) {
      await db.category.create({ data: cat });
    }

    // ─── 4. Create Services ───
    const servicesData = [
      // ═══ Actas ═══
      { name: 'Certificado De No Deudor Alimentario', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","curp"]', icon: '📄', sortOrder: 1 },
      { name: 'Acta de Defunción con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]', icon: '📄', sortOrder: 2 },
      { name: 'Acta de Defunción Folio', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha_defuncion"]', icon: '📄', sortOrder: 3 },
      { name: 'Acta de Defunción México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha_defuncion"]', icon: '📄', sortOrder: 4 },
      { name: 'Acta de Defunción México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 5 },
      { name: 'Acta de Divorcio con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]', icon: '📄', sortOrder: 6 },
      { name: 'Acta de Divorcio Folio', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha"]', icon: '📄', sortOrder: 7 },
      { name: 'Acta de Divorcio México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 8 },
      { name: 'Acta de Divorcio México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 9 },
      { name: 'Acta de Matrimonio con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]', icon: '📄', sortOrder: 10 },
      { name: 'Acta de Matrimonio Folio', price: 40, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha"]', icon: '📄', sortOrder: 11 },
      { name: 'Acta de Matrimonio México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 12 },
      { name: 'Acta de Matrimonio México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 13 },
      { name: 'Acta de Nacimiento con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]', icon: '📄', sortOrder: 14 },
      { name: 'Acta de Nacimiento Folio', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '📄', sortOrder: 15 },
      { name: 'Acta de Nacimiento México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 16 },
      { name: 'Acta de Nacimiento México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]', icon: '📄', sortOrder: 17 },

      // ═══ Fiscales ═══
      { name: 'Alta Contribuyente sin Acudir', price: 700, deliveryTime: '15-25 Días', categorySlug: 'fiscales', requiresData: '["nombre","curp","rfc"]', icon: '💰', sortOrder: 1 },
      { name: 'Antecedentes No Penales Estatal (Reseteo)', price: 110, deliveryTime: '24-72 Hrs', categorySlug: 'fiscales', requiresData: '["nombre_completo","curp"]', icon: '💰', sortOrder: 2 },
      { name: 'Antecedentes No Penales Estatal (Primera Vez)', price: 100, deliveryTime: '1-24 Hrs', categorySlug: 'fiscales', requiresData: '["nombre_completo","curp"]', icon: '💰', sortOrder: 3 },
      { name: 'Antecedentes No Penales Federal Original', price: 280, deliveryTime: '2-3 Hrs', categorySlug: 'fiscales', requiresData: '["nombre_completo","curp"]', icon: '💰', sortOrder: 4 },
      { name: 'Cédula de Datos Fiscales', price: 40, deliveryTime: '10-45 MIN', categorySlug: 'fiscales', requiresData: '["rfc","curp"]', icon: '💰', sortOrder: 5 },
      { name: 'Constancia de No Afiliación al ISSTE', price: 15, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["nombre","curp"]', icon: '💰', sortOrder: 6 },
      { name: 'Opinión Cumplimiento Obligaciones Fiscales 32-D', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["rfc"]', icon: '💰', sortOrder: 7 },
      { name: 'Generar CURP a RFC', price: 6, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["curp"]', icon: '💰', sortOrder: 8 },
      { name: 'Refacturación Registrada SAT', price: 90, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["rfc","uuid"]', icon: '💰', sortOrder: 9 },

      // ═══ IMSS ═══
      { name: 'Asignación NSS IMSS', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp"]', icon: '🏥', sortOrder: 1 },
      { name: 'Aviso Retención Infonavit', price: 200, deliveryTime: '10-45 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 2 },
      { name: 'Captura Promedio de Salario', price: 140, deliveryTime: '10-45 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 3 },
      { name: 'Desbloqueo + Cambio Contraseña Infonavit', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 4 },
      { name: 'Desbloqueo Buró Infonavit (OCI)', price: 10, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 5 },
      { name: 'Desvinculación Dispositivo Infonavit', price: 200, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 6 },
      { name: 'Estado Cuenta Histórico Infonavit', price: 120, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 7 },
      { name: 'Localizar Afore', price: 90, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp"]', icon: '🏥', sortOrder: 8 },
      { name: 'Número Seguro Social IMSS', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp"]', icon: '🏥', sortOrder: 9 },
      { name: 'Precalificación Infonavit Bansefi', price: 16, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 10 },
      { name: 'Precalificación Infonavit + Desbloqueo', price: 50, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 11 },
      { name: 'Precalificación Infonavit Sistema (OCI)', price: 400, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 12 },
      { name: 'Precalificación Mejoravit', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 13 },
      { name: 'Recibo CFE Solo Número Servicio', price: 190, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["numero_servicio"]', icon: '🏥', sortOrder: 14 },
      { name: 'Registro Nuevo Infonavit', price: 120, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp","nss"]', icon: '🏥', sortOrder: 15 },
      { name: 'Reporte Personalizado IMSS (RPCI)', price: 40, deliveryTime: '10-45 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 16 },
      { name: 'Reseteo Infonavit', price: 40, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 17 },
      { name: 'Resumen Movimientos Infonavit', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 18 },
      { name: 'Semanas Cotizadas Detalladas (Premium)', price: 110, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 19 },
      { name: 'Semanas Cotizadas Sencilla (Premium)', price: 140, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 20 },
      { name: 'SINDO de Pensión (Nómina)', price: 40, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 21 },
      { name: 'SINDO de Pensión (Status)', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 22 },
      { name: 'SINDO de Pensión (Viudas)', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 23 },
      { name: 'SINDO Fechas Último Retiro', price: 150, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 24 },
      { name: 'SINDO Promedio', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 25 },
      { name: 'SINDOS Completos', price: 340, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 26 },
      { name: 'Vigencia (Premium)', price: 70, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]', icon: '🏥', sortOrder: 27 },
      { name: 'Cambio Contraseña Mejoravit', price: 120, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 28 },
      { name: 'Eliminación Cuenta Mejoravit', price: 60, deliveryTime: 'Lunes a Viernes', categorySlug: 'imss', requiresData: '["nss","nombre"]', icon: '🏥', sortOrder: 29 },

      // ═══ Buró y Crédito ═══
      { name: 'Buró de Crédito sin Datos Original', price: 160, deliveryTime: '2-24 Hrs', categorySlug: 'creditos', requiresData: '["nombre_completo","curp"]', icon: '🏦', sortOrder: 1 },
      { name: 'CSF con CURP Persona Física Original', price: 140, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["curp"]', icon: '🏦', sortOrder: 2 },
      { name: 'CSF con CURP Verificable Express', price: 70, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["curp"]', icon: '🏦', sortOrder: 3 },
      { name: 'CSF con CURP Verificable Lento', price: 65, deliveryTime: '10-45 MIN', categorySlug: 'creditos', requiresData: '["curp"]', icon: '🏦', sortOrder: 4 },
      { name: 'CSF con RFC e IDCIF', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["rfc"]', icon: '🏦', sortOrder: 5 },
      { name: 'CSF Solo con CURP Clon', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["curp"]', icon: '🏦', sortOrder: 6 },
      { name: 'CSF Persona Moral Original', price: 180, deliveryTime: '10-45 MIN', categorySlug: 'creditos', requiresData: '["rfc","idcif"]', icon: '🏦', sortOrder: 7 },
      { name: 'Localizar IDCIF Express', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["nombre_completo"]', icon: '🏦', sortOrder: 8 },
      { name: 'Localizar IDCIF Lento', price: 500, deliveryTime: '3 Hrs', categorySlug: 'creditos', requiresData: '["nombre_completo"]', icon: '🏦', sortOrder: 9 },

      // ═══ Permisos de Conducir ═══
      { name: 'Permiso Conducir sin Placa CDMX', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 1 },
      { name: 'Permiso Conducir sin Placa Edo. México', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 2 },
      { name: 'Permiso Conducir sin Placa Jalisco', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 3 },
      { name: 'Permiso Conducir sin Placa Oaxaca', price: 90, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 4 },
      { name: 'Permiso Conducir sin Placa Aguas Calientes', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 5 },
      { name: 'Permiso Conducir sin Placa San Luis Potosí', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 6 },
      { name: 'Permiso Conducir sin Placa Copalillo Guerrero', price: 60, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 7 },
      { name: 'Permiso Conducir sin Placa Tlapa Guerrero', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 8 },
      { name: 'Permiso Conducir sin Placa Huitzuco Guerrero', price: 180, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]', icon: '🚗', sortOrder: 9 },

      // ═══ Licencias y Software ═══
      { name: 'Licencia IBO Player Pro 1 Año', price: 30, deliveryTime: '24/7 Instant', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]', icon: '💿', sortOrder: 1 },
      { name: 'Licencia Smart Player 1 Año', price: 8, deliveryTime: '24/7 Instant', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]', icon: '💿', sortOrder: 2 },
      { name: 'Licencia Vivo Player 1 Año', price: 25, deliveryTime: '24/7 Instant', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]', icon: '💿', sortOrder: 3 },
      { name: 'Eleventa Multicaja 5.20 Permanente', price: 160, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["nombre","email","serie_equipo"]', icon: '💿', sortOrder: 4 },
      { name: 'Código Japishow Descargas Premium', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["email"]', icon: '💿', sortOrder: 5 },
      { name: 'Ibo Multi Player', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]', icon: '💿', sortOrder: 6 },
      { name: 'Multi Player', price: 5, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]', icon: '💿', sortOrder: 7 },

      // ═══ Streaming e IPTV ═══
      { name: 'Cuenta FlujoTV 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 1 },
      { name: 'Cuenta FlujoTV 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 2 },
      { name: 'Cuenta FlujoTV 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 3 },
      { name: 'Cuenta FlujoTV 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 4 },
      { name: 'Cuenta StellaTV 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 5 },
      { name: 'Cuenta StellaTV 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 6 },
      { name: 'Cuenta StellaTV 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 7 },
      { name: 'Cuenta StellaTV 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 8 },
      { name: 'Cuenta TeleLatino 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 9 },
      { name: 'Cuenta TeleLatino 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 10 },
      { name: 'Cuenta TeleLatino 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 11 },
      { name: 'Cuenta TeleLatino 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 12 },
      { name: 'Cuenta Oleada TV 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 13 },
      { name: 'Cuenta Oleada TV 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 14 },
      { name: 'Cuenta Oleada TV 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 15 },
      { name: 'Cuenta Oleada TV 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 16 },
      { name: 'IPTV M327 Cuenta Nueva', price: 110, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 17 },
      { name: 'IPTV M327 Renovación', price: 55, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]', icon: '📺', sortOrder: 18 },

      // ═══ Identidad y CURP ═══
      { name: 'Documento CURP Estado Emergencia', price: 10, deliveryTime: '10-15 MIN', categorySlug: 'identidad', requiresData: '["nombre_completo","fecha_nacimiento","entidad"]', icon: '🪪', sortOrder: 1 },

      // ═══ Plataformas de Streaming ═══
      { name: 'Netflix Cuenta Individual', price: 185, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 1 },
      { name: 'Netflix Perfil Adicional', price: 55, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 2 },
      { name: 'Disney+ Cuenta Individual', price: 110, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 3 },
      { name: 'Disney+ Perfil Adicional', price: 50, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 4 },
      { name: 'Spotify Cuenta Individual', price: 40, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 5 },
      { name: 'Spotify Cuenta Premium', price: 110, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 6 },
      { name: 'Prime Video Cuenta Individual', price: 75, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 7 },
      { name: 'Prime Video Perfil Adicional', price: 20, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 8 },
      { name: 'ClaroVideo + Fox Premium', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 9 },
      { name: 'ClaroVideo + Fox Renovación', price: 35, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 10 },
      { name: 'ClaroVideo + Crunchyroll Premium', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 11 },
      { name: 'ClaroVideo + Crunchyroll Renovación', price: 35, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 12 },
      { name: 'HBO Max Cuenta Individual', price: 80, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 13 },
      { name: 'HBO Max Perfil Adicional', price: 30, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 14 },
      { name: 'Amazon Music Individual', price: 35, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 15 },
      { name: 'Amazon Music Anual', price: 85, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]', icon: '🎬', sortOrder: 16 },

      // ═══ Software y Herramientas ═══
      { name: 'Canva Pro Mensual', price: 45, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email"]', icon: '🛠️', sortOrder: 1 },
      { name: 'Canva Pro Anual', price: 120, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email"]', icon: '🛠️', sortOrder: 2 },
      { name: 'Punto de Venta Mensual', price: 160, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","nombre"]', icon: '🛠️', sortOrder: 3 },
      { name: 'Punto de Venta Permanente', price: 200, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","nombre"]', icon: '🛠️', sortOrder: 4 },
      { name: 'Sistema de Facturación Mensual', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","nombre","rfc"]', icon: '🛠️', sortOrder: 5 },
      { name: 'Sistema de Facturación Renovación', price: 70, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","rfc"]', icon: '🛠️', sortOrder: 6 },

      // ═══ OSINT e Inteligencia ═══
      { name: 'Perfilamiento por Nombre Completo', price: 150, deliveryTime: '15-30 MIN', categorySlug: 'osint', requiresData: '["nombre_completo"]', icon: '🔍', sortOrder: 1 },
      { name: 'Perfilamiento por Número de Teléfono', price: 120, deliveryTime: '15-30 MIN', categorySlug: 'osint', requiresData: '["telefono"]', icon: '🔍', sortOrder: 2 },
      { name: 'Perfilamiento por Correo Electrónico', price: 100, deliveryTime: '15-30 MIN', categorySlug: 'osint', requiresData: '["email"]', icon: '🔍', sortOrder: 3 },
      { name: 'Enriquecimiento y Búsqueda de Redes Sociales', price: 80, deliveryTime: '10-20 MIN', categorySlug: 'osint', requiresData: '["nombre_completo","telefono"]', icon: '🔍', sortOrder: 4 },
      { name: 'Análisis de Riesgo y Búsqueda en Listas Negras', price: 200, deliveryTime: '20-45 MIN', categorySlug: 'osint', requiresData: '["nombre_completo","curp"]', icon: '🔍', sortOrder: 5 },
      { name: 'Antecedentes Penales Estatales en Tiempo Real', price: 250, deliveryTime: '30-60 MIN', categorySlug: 'osint', requiresData: '["nombre_completo","curp","entidad"]', icon: '🔍', sortOrder: 6 },
    ];

    for (const svc of servicesData) {
      await db.service.create({
        data: {
          name: svc.name,
          slug: slugify(svc.name),
          description: '',
          price: svc.price,
          deliveryTime: svc.deliveryTime,
          categorySlug: svc.categorySlug,
          requiresData: svc.requiresData,
          icon: svc.icon,
          sortOrder: svc.sortOrder,
          active: true,
        },
      });
    }

    // ─── 5. Create Default Settings ───
    await db.setting.createMany({
      data: [
        { key: 'bank_name', value: 'SANTANDER' },
        { key: 'bank_clabe', value: '0146 1014 0229 4278 94' },
        { key: 'bank_account', value: 'EVANGELINA GARCIA' },
        { key: 'bank_reference', value: 'PANELTRAMITES' },
        { key: 'min_payment', value: '250' },
        { key: 'max_payment', value: '50000' },
        { key: 'site_name', value: 'DOCUFAST' },
        { key: 'site_description', value: 'Plataforma de Trámites Digitales' },
        { key: 'whatsapp', value: '8146954100' },
        { key: 'support_email', value: 'soporte@synkdata.online' },
        { key: 'telegram_token', value: '' },
        { key: 'telegram_chat_id', value: '' },
      ],
    });

    return NextResponse.json({
      message: 'Base de datos poblada exitosamente',
      seeded: true,
      stats: {
        categories: categoriesData.length,
        services: servicesData.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Error al poblar base de datos' }, { status: 500 });
  }
}
