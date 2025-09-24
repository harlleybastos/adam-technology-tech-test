import { prisma } from '../utils/database.js';

export async function getMyAvailability(painterUserId: string) {
  const painter = await prisma.painter.findFirst({ where: { userId: painterUserId } });
  if (!painter) throw new Error('Painter profile not found');
  const slots = await prisma.availability.findMany({ where: { painterId: painter.id }, orderBy: { startTime: 'asc' } });
  return slots;
}

export async function addAvailability(painterUserId: string, params: { startTime: string; endTime: string }) {
  const painter = await prisma.painter.findFirst({ where: { userId: painterUserId } });
  if (!painter) throw new Error('Painter profile not found');
  const startTime = new Date(params.startTime);
  const endTime = new Date(params.endTime);
  if (!(endTime > startTime)) throw new Error('Invalid time range');
  const created = await prisma.availability.create({ data: { painterId: painter.id, startTime, endTime } });
  return created;
}

export async function deleteAvailability(painterUserId: string, availabilityId: string) {
  const painter = await prisma.painter.findFirst({ where: { userId: painterUserId } });
  if (!painter) throw new Error('Painter profile not found');
  const slot = await prisma.availability.findUnique({ where: { id: availabilityId } });
  if (!slot || slot.painterId !== painter.id) throw new Error('Not found');
  await prisma.availability.delete({ where: { id: availabilityId } });
}


