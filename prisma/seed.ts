import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await db.user.upsert({
    where: { email: 'admin@tramfast.io' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@tramfast.io',
      password: hashedPassword,
      role: 'admin',
      balance: 9999,
    },
  });
  console.log('Admin user created:', admin.email);

  // Create categories
  const categories = [
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

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categories created');

  // Services data
  const services = [
    // Actas
    { name: 'Certificado De No Deudor Alimentario', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","curp"]' },
    { name: 'Acta de Defunción con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]' },
    { name: 'Acta de Defunción Folio', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha_defuncion"]' },
    { name: 'Acta de Defunción México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha_defuncion"]' },
    { name: 'Acta de Defunción México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    { name: 'Acta de Divorcio con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]' },
    { name: 'Acta de Divorcio Folio', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha"]' },
    { name: 'Acta de Divorcio México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    { name: 'Acta de Divorcio México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    { name: 'Acta de Matrimonio con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]' },
    { name: 'Acta de Matrimonio Folio', price: 40, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha"]' },
    { name: 'Acta de Matrimonio México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    { name: 'Acta de Matrimonio México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    { name: 'Acta de Nacimiento con Nº Cadena', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'actas', requiresData: '["folio_cadena"]' },
    { name: 'Acta de Nacimiento Folio', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'actas', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Acta de Nacimiento México (Lento)', price: 12, deliveryTime: '15-30 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    { name: 'Acta de Nacimiento México Solo (L-D)', price: 25, deliveryTime: '10-20 MIN', categorySlug: 'actas', requiresData: '["nombre_completo"]' },
    // Fiscales
    { name: 'Alta Contribuyente sin Acudir', price: 700, deliveryTime: '15-25 Días', categorySlug: 'fiscales', requiresData: '["nombre","curp","rfc"]' },
    { name: 'Antecedentes No Penales Estatal (Reseteo)', price: 110, deliveryTime: '24-72 Hrs', categorySlug: 'fiscales', requiresData: '["nombre_completo","curp"]' },
    { name: 'Antecedentes No Penales Estatal (Primera Vez)', price: 100, deliveryTime: '1-24 Hrs', categorySlug: 'fiscales', requiresData: '["nombre_completo","curp"]' },
    { name: 'Antecedentes No Penales Federal Original', price: 280, deliveryTime: '2-3 Hrs', categorySlug: 'fiscales', requiresData: '["nombre_completo","curp"]' },
    { name: 'Cédula de Datos Fiscales', price: 40, deliveryTime: '10-45 MIN', categorySlug: 'fiscales', requiresData: '["rfc","curp"]' },
    { name: 'Constancia de No Afiliación al ISSTE', price: 15, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["nombre","curp"]' },
    { name: 'Opinión Cumplimiento Obligaciones Fiscales 32-D', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["rfc"]' },
    { name: 'Generar CURP a RFC', price: 6, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["curp"]' },
    { name: 'Refacturación Registrada SAT', price: 90, deliveryTime: '10-15 MIN', categorySlug: 'fiscales', requiresData: '["rfc","uuid"]' },
    // IMSS e Infonavit
    { name: 'Asignación NSS IMSS', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp"]' },
    { name: 'Aviso Retención Infonavit', price: 200, deliveryTime: '10-45 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Captura Promedio de Salario', price: 140, deliveryTime: '10-45 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Desbloqueo + Cambio Contraseña Infonavit', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Desbloqueo Buró Infonavit (OCI)', price: 10, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Desvinculación Dispositivo Infonavit', price: 200, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Estado Cuenta Histórico Infonavit', price: 120, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Localizar Afore', price: 90, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp"]' },
    { name: 'Número Seguro Social IMSS', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp"]' },
    { name: 'Precalificación Infonavit Bansefi', price: 16, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Precalificación Infonavit + Desbloqueo', price: 50, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Precalificación Infonavit Sistema (OCI)', price: 400, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Precalificación Mejoravit', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Recibo CFE Solo Número Servicio', price: 190, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["numero_servicio"]' },
    { name: 'Registro Nuevo Infonavit', price: 120, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nombre_completo","curp","nss"]' },
    { name: 'Reporte Personalizado IMSS (RPCI)', price: 40, deliveryTime: '10-45 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Reseteo Infonavit', price: 40, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Resumen Movimientos Infonavit', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Semanas Cotizadas Detalladas (Premium)', price: 110, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Semanas Cotizadas Sencilla (Premium)', price: 140, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'SINDO de Pensión (Nómina)', price: 40, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'SINDO de Pensión (Status)', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'SINDO de Pensión (Viudas)', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'SINDO Fechas Último Retiro', price: 150, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'SINDO Promedio', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'SINDOS Completos', price: 340, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Vigencia (Premium)', price: 70, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss"]' },
    { name: 'Cambio Contraseña Mejoravit', price: 120, deliveryTime: '10-15 MIN', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    { name: 'Eliminación Cuenta Mejoravit', price: 60, deliveryTime: 'Lunes a Viernes', categorySlug: 'imss', requiresData: '["nss","nombre"]' },
    // Buró y Crédito
    { name: 'Buró de Crédito sin Datos Original', price: 160, deliveryTime: '2-24 Hrs', categorySlug: 'creditos', requiresData: '["nombre_completo","curp"]' },
    { name: 'CSF con CURP Persona Física Original', price: 140, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["curp"]' },
    { name: 'CSF con CURP Verificable Express', price: 70, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["curp"]' },
    { name: 'CSF con CURP Verificable Lento', price: 65, deliveryTime: '10-45 MIN', categorySlug: 'creditos', requiresData: '["curp"]' },
    { name: 'CSF con RFC e IDCIF', price: 20, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["rfc"]' },
    { name: 'CSF Solo con CURP Clon', price: 30, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["curp"]' },
    { name: 'CSF Persona Moral Original', price: 180, deliveryTime: '10-45 MIN', categorySlug: 'creditos', requiresData: '["rfc","idcif"]' },
    { name: 'Localizar IDCIF Express', price: 60, deliveryTime: '10-15 MIN', categorySlug: 'creditos', requiresData: '["nombre_completo"]' },
    { name: 'Localizar IDCIF Lento', price: 500, deliveryTime: '3 Hrs', categorySlug: 'creditos', requiresData: '["nombre_completo"]' },
    // Permisos de Conducir
    { name: 'Permiso Conducir sin Placa CDMX', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Edo. México', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Jalisco', price: 25, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Oaxaca', price: 90, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Aguas Calientes', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa San Luis Potosí', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Copalillo Guerrero', price: 60, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Tlapa Guerrero', price: 80, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    { name: 'Permiso Conducir sin Placa Huitzuco Guerrero', price: 180, deliveryTime: '10-45 MIN', categorySlug: 'conducir', requiresData: '["nombre_completo","fecha_nacimiento"]' },
    // Licencias
    { name: 'Licencia IBO Player Pro 1 Año', price: 30, deliveryTime: '24/7 Instant', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]' },
    { name: 'Licencia Smart Player 1 Año', price: 8, deliveryTime: '24/7 Instant', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]' },
    { name: 'Licencia Vivo Player 1 Año', price: 25, deliveryTime: '24/7 Instant', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]' },
    { name: 'Eleventa Multicaja 5.20 Permanente', price: 160, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["nombre","email","serie_equipo"]' },
    { name: 'Código Japishow Descargas Premium', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["email"]' },
    { name: 'Ibo Multi Player', price: 100, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]' },
    { name: 'Multi Player', price: 5, deliveryTime: '10-15 MIN', categorySlug: 'licencias', requiresData: '["email","mac_dispositivo"]' },
    // Streaming
    { name: 'Cuenta FlujoTV 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta FlujoTV 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta FlujoTV 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta FlujoTV 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta StellaTV 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta StellaTV 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta StellaTV 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta StellaTV 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta TeleLatino 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta TeleLatino 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta TeleLatino 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta TeleLatino 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta Oleada TV 1 Mes', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta Oleada TV 3 Meses', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta Oleada TV 6 Meses', price: 260, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Cuenta Oleada TV 12 Meses', price: 500, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    // Identidad
    { name: 'Documento CURP Estado Emergencia', price: 10, deliveryTime: '10-15 MIN', categorySlug: 'identidad', requiresData: '["nombre_completo","fecha_nacimiento","entidad"]' },
    // Plataformas de Streaming
    { name: 'Netflix Cuenta Individual', price: 185, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Netflix Perfil Adicional', price: 55, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Disney+ Cuenta Individual', price: 110, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Disney+ Perfil Adicional', price: 50, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Spotify Cuenta Individual', price: 40, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Spotify Cuenta Premium', price: 110, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Prime Video Cuenta Individual', price: 75, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Prime Video Perfil Adicional', price: 20, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'ClaroVideo + Fox Premium', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'ClaroVideo + Fox Renovación', price: 35, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'ClaroVideo + Crunchyroll Premium', price: 60, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'ClaroVideo + Crunchyroll Renovación', price: 35, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'HBO Max Cuenta Individual', price: 80, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'HBO Max Perfil Adicional', price: 30, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'IPTV M327 Cuenta Nueva', price: 110, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'IPTV M327 Renovación', price: 55, deliveryTime: '24/7 Instant', categorySlug: 'streaming', requiresData: '["email"]' },
    { name: 'Amazon Music Individual', price: 35, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    { name: 'Amazon Music Anual', price: 85, deliveryTime: '24/7 Instant', categorySlug: 'plataformas', requiresData: '["email"]' },
    // Software y Herramientas
    { name: 'Canva Pro Mensual', price: 45, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email"]' },
    { name: 'Canva Pro Anual', price: 120, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email"]' },
    { name: 'Punto de Venta Mensual', price: 160, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","nombre"]' },
    { name: 'Punto de Venta Permanente', price: 200, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","nombre"]' },
    { name: 'Sistema de Facturación Mensual', price: 140, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","nombre","rfc"]' },
    { name: 'Sistema de Facturación Renovación', price: 70, deliveryTime: '24/7 Instant', categorySlug: 'software', requiresData: '["email","rfc"]' },
    // OSINT e Inteligencia
    { name: 'Perfilamiento por Nombre Completo', price: 150, deliveryTime: '15-30 MIN', categorySlug: 'osint', requiresData: '["nombre_completo"]' },
    { name: 'Perfilamiento por Número de Teléfono', price: 120, deliveryTime: '15-30 MIN', categorySlug: 'osint', requiresData: '["telefono"]' },
    { name: 'Perfilamiento por Correo Electrónico', price: 100, deliveryTime: '15-30 MIN', categorySlug: 'osint', requiresData: '["email"]' },
    { name: 'Enriquecimiento y Búsqueda de Redes Sociales', price: 80, deliveryTime: '10-20 MIN', categorySlug: 'osint', requiresData: '["nombre_completo","telefono"]' },
    { name: 'Análisis de Riesgo y Búsqueda en Listas Negras', price: 200, deliveryTime: '20-45 MIN', categorySlug: 'osint', requiresData: '["nombre_completo","curp"]' },
    { name: 'Antecedentes Penales Estatales en Tiempo Real', price: 250, deliveryTime: '30-60 MIN', categorySlug: 'osint', requiresData: '["nombre_completo","curp","entidad"]' },
  ];

  for (const svc of services) {
    const slug = svc.name.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, '-').replace(/^-|-$/g, '');
    await db.service.upsert({
      where: { slug },
      update: {},
      create: {
        name: svc.name,
        slug,
        price: svc.price,
        deliveryTime: svc.deliveryTime,
        categorySlug: svc.categorySlug,
        requiresData: svc.requiresData,
      },
    });
  }
  console.log(`Services created: ${services.length}`);

  // Default site config
  const configs = [
    { key: 'bank_name', value: 'SANTANDER' },
    { key: 'bank_clabe', value: '0146 1014 0229 4278 94' },
    { key: 'bank_reference', value: 'PANELTRAMITES' },
    { key: 'bank_account', value: 'EVANGELINA GARCIA' },
    { key: 'min_payment', value: '250' },
    { key: 'max_payment', value: '50000' },
    { key: 'site_name', value: 'TramFast' },
    { key: 'site_description', value: 'Plataforma de Trámites Digitales' },
    { key: 'whatsapp', value: '5217411104223' },
    { key: 'support_email', value: 'soporte@tramfast.io' },
    { key: 'telegram_token', value: '' },
    { key: 'telegram_chat_id', value: '' },
  ];
  for (const config of configs) {
    await db.setting.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log('Site config created');

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
