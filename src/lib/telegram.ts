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
