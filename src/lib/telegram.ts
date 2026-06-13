import { db } from './db';

export async function sendTelegramNotification(text: string) {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: { in: ['telegram_token', 'telegram_chat_id'] }
      }
    });

    const token = settings.find(s => s.key === 'telegram_token')?.value;
    const chatId = settings.find(s => s.key === 'telegram_chat_id')?.value;

    if (!token || !chatId) {
      console.warn('Telegram notifications skipped: token or chatId not configured in settings.');
      return;
    }

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML'
        })
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error('Telegram API error:', error);
    }
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}

export async function testTelegramNotification() {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: { in: ['telegram_token', 'telegram_chat_id'] }
      }
    });

    const token = settings.find(s => s.key === 'telegram_token')?.value;
    const chatId = settings.find(s => s.key === 'telegram_chat_id')?.value;

    if (!token || !chatId) {
      return { success: false, message: 'Token o Chat ID no configurados' };
    }

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🔔 <b>Prueba de Notificación</b>\n\nEl sistema de notificaciones de Telegram está configurado correctamente.',
          parse_mode: 'HTML'
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.description || 'Error de la API de Telegram' };
    }

    return { success: true, message: 'Notificación de prueba enviada' };
  } catch (error: any) {
    console.error('Telegram test error:', error);
    return { success: false, message: error.message || 'Error al probar Telegram' };
  }
}
