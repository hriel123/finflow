import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Loads a record by id and returns it only if it belongs to userId, otherwise
// null. Centralizes the ownership check shared by every /:id route handler.
export async function findOwned(model, id, userId) {
  const record = await model.findUnique({ where: { id } });
  if (!record || record.userId !== userId) return null;
  return record;
}
