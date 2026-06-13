import { db } from '@/lib/db';

async function getTelegramConfig(): Promise<{ token: string; chatId: string } | null> {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: { in: ['telegram_token', 'telegram_chat_id'] }
      }
    });
    
    const token = settings.find(s => s.key === 'telegram_token')?.value || process.env.TELEGRAM_BOT_TOKEN || '';
    const chatId = settings.find(s => s.key === 'telegram_chat_id')?.value || process.env.TELEGRAM_CHAT_ID || '';
    
    if (!token || !chatId) return null;
    return { token, chatId };
  } catch {
    return null;
  }
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  const config = await getTelegramConfig();
  if (!config) return false;
  
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${config.token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text,
          parse_mode: 'HTML'
        })
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function notifyNewUser(userName: string, email: string): Promise<boolean> {
  return sendTelegramMessage(
    `🆕 <b>Nuevo Usuario Registrado</b>\n\n` +
    `👤 Nombre: ${userName}\n` +
    `📧 Email: ${email}\n` +
    `🕐 Fecha: ${new Date().toLocaleString('es-MX')}`
  );
}

export async function notifyNewOrder(orderId: string, userName: string, serviceName: string, total: number): Promise<boolean> {
  return sendTelegramMessage(
    `📋 <b>Nuevo Pedido</b>\n\n` +
    `🔢 ID: ${orderId}\n` +
    `👤 Cliente: ${userName}\n` +
    `📦 Servicio: ${serviceName}\n` +
    `💰 Total: $${total.toFixed(2)}\n` +
    `🕐 Fecha: ${new Date().toLocaleString('es-MX')}`
  );
}

export async function notifyNewDeposit(userName: string, amount: number, reference: string): Promise<boolean> {
  return sendTelegramMessage(
    `💰 <b>Nueva Solicitud de Recarga</b>\n\n` +
    `👤 Usuario: ${userName}\n` +
    `💵 Monto: $${amount.toFixed(2)}\n` +
    `🔗 Referencia: ${reference}\n` +
    `🕐 Fecha: ${new Date().toLocaleString('es-MX')}`
  );
}

export async function testTelegramNotification(): Promise<{ success: boolean; message: string }> {
  const config = await getTelegramConfig();
  if (!config) {
    return { success: false, message: 'No se encontró la configuración de Telegram' };
  }
  
  const sent = await sendTelegramMessage(
    `✅ <b>Prueba de Notificación</b>\n\n` +
    `Las notificaciones de Telegram están funcionando correctamente.\n` +
    `🕐 ${new Date().toLocaleString('es-MX')}`
  );
  
  return sent 
    ? { success: true, message: 'Notificación enviada correctamente' }
    : { success: false, message: 'Error al enviar la notificación' };
}
