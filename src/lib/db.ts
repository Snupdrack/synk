import { PrismaClient } from '@prisma/client'
import { sendTelegramNotification } from './telegram'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createExtendedClient> | undefined
}

function createExtendedClient() {
  return new PrismaClient({
    log: ['query'],
  }).$extends({
    query: {
      user: {
        async create({ args, query }) {
          const user = await query(args);
          await sendTelegramNotification(
            `👤 <b>Nuevo Usuario Registrado</b>\n\n` +
            `<b>Nombre:</b> ${user.name}\n` +
            `<b>Email:</b> ${user.email}\n` +
            `<b>Rol:</b> ${user.role}`
          );
          return user;
        },
      },
      order: {
        async create({ args, query }) {
          const order = await query(args);
          await sendTelegramNotification(
            `📦 <b>Nueva Orden Recibida</b>\n\n` +
            `<b>ID:</b> <code>${order.id}</code>\n` +
            `<b>Total:</b> $${order.total.toFixed(2)}\n` +
            `<b>Estado:</b> ${order.status}`
          );
          return order;
        },
      },
      transaction: {
        async create({ args, query }) {
          const transaction = await query(args);
          if (transaction.type === 'deposit') {
            await sendTelegramNotification(
              `💰 <b>Nuevo Depósito Solicitado</b>\n\n` +
              `<b>Monto:</b> $${transaction.amount.toFixed(2)}\n` +
              `<b>Estado:</b> ${transaction.status}\n` +
              `<b>Referencia:</b> ${transaction.reference || 'N/A'}`
            );
          }
          return transaction;
        },
      },
    },
  });
}

export const db =
  globalForPrisma.prisma ?? createExtendedClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db