import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function checkConfig() {
  const settings = await db.setting.findMany({
    where: {
      key: { in: ['telegram_token', 'telegram_chat_id'] }
    }
  });
  console.log('Current Telegram Settings:');
  console.log(JSON.stringify(settings, null, 2));
  process.exit(0);
}

checkConfig();
