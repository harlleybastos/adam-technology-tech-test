import { prisma } from '../utils/database.js';
import { JwtUser } from '../utils/jwt.js';

type AvailabilityWithPainter = {
  id: string;
  painterId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  painter: {
    id: string;
    name: string;
    experience: number;
    rating: unknown;
    specialties: string[];
  };
};

export class NoAvailabilityError extends Error {
  alternatives: Array<{
    startTime: string;
    endTime: string;
    painter: { id: string; name: string; rating: number; experience: number; specialties: string[] };
  }>;
  code: string;
  constructor(message: string, alternatives: NoAvailabilityError['alternatives']) {
    super(message);
    this.name = 'NoAvailabilityError';
    this.code = 'NO_AVAILABILITY';
    this.alternatives = alternatives;
  }
}

function computePainterScore(input: { rating: number; experience: number; workload: number }) {
  const ratingNorm = Math.max(0, Math.min(1, input.rating / 5));
  const experienceNorm = Math.max(0, Math.min(1, input.experience / 10));
  const workloadNorm = 1 - Math.max(0, Math.min(1, input.workload / 10));
  return ratingNorm * 0.5 + experienceNorm * 0.3 + workloadNorm * 0.2;
}

async function findClosestAlternatives(start: Date, end: Date): Promise<NoAvailabilityError['alternatives']> {
  const beforeWindow = new Date(start.getTime() - 1000 * 60 * 60 * 24 * 3); // 3 days before
  const afterWindow = new Date(end.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days after

  const nearbySlots = await prisma.availability.findMany({
    where: {
      isBooked: false,
      OR: [
        { startTime: { gte: beforeWindow, lte: afterWindow } },
        { endTime: { gte: beforeWindow, lte: afterWindow } },
      ],
    },
    include: { painter: true },
    orderBy: { startTime: 'asc' },
    take: 25,
  });

  const withDistance = nearbySlots.map((slot) => {
    let distanceMs = 0;
    if (slot.endTime < start) distanceMs = start.getTime() - slot.endTime.getTime();
    else if (slot.startTime > end) distanceMs = slot.startTime.getTime() - end.getTime();
    else distanceMs = 0; // overlaps partially
    return { slot, distanceMs };
  });

  withDistance.sort((a, b) => a.distanceMs - b.distanceMs);

  return withDistance.slice(0, 5).map(({ slot }) => ({
    startTime: slot.startTime.toISOString(),
    endTime: slot.endTime.toISOString(),
    painter: {
      id: slot.painter.id,
      name: slot.painter.name,
      rating: Number(slot.painter.rating),
      experience: slot.painter.experience,
      specialties: slot.painter.specialties,
    },
  }));
}

export async function requestBooking(user: JwtUser, params: { startTime: string; endTime: string; notes?: string }) {
  if (user.role !== 'customer') throw new Error('Only customers can request bookings');
  const customer = await prisma.customer.findFirst({ where: { userId: user.id } });
  if (!customer) throw new Error('Customer profile not found');

  const start = new Date(params.startTime);
  const end = new Date(params.endTime);
  if (!(end > start)) throw new Error('Invalid time range');

  const availableSlots = await prisma.availability.findMany({
    where: {
      isBooked: false,
      startTime: { lte: start },
      endTime: { gte: end },
    },
    include: { painter: true },
  });

  if (availableSlots.length === 0) {
    const alternatives = await findClosestAlternatives(start, end);
    throw new NoAvailabilityError('No painters are available for the requested time slot.', alternatives);
  }

  // Simple scoring placeholder based on rating, experience, and workload
  const paintersWithWorkload: Array<{ slot: AvailabilityWithPainter; workload: number; score: number }> = await Promise.all(
    availableSlots.map(async (slot: AvailabilityWithPainter) => {
      const workload = await prisma.booking.count({
        where: { painterId: slot.painterId, status: { in: ['confirmed', 'pending'] } },
      });
      const score = computePainterScore({
        rating: Number(slot.painter.rating),
        experience: slot.painter.experience,
        workload,
      });
      return { slot, workload, score };
    })
  );

  paintersWithWorkload.sort((a, b) => b.score - a.score);

  const chosen = paintersWithWorkload[0].slot;

  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      painterId: chosen.painterId,
      availabilityId: chosen.id,
      startTime: start,
      endTime: end,
      status: 'confirmed',
      notes: params.notes ?? null,
    },
    include: { painter: true },
  });

  await prisma.availability.update({ where: { id: chosen.id }, data: { isBooked: true } });

  return {
    bookingId: booking.id,
    painter: {
      id: booking.painter.id,
      name: booking.painter.name,
      rating: Number(booking.painter.rating),
      experience: booking.painter.experience,
      specialties: booking.painter.specialties,
    },
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
    status: booking.status,
  };
}

export async function listCustomerBookings(customerUserId: string) {
  const customer = await prisma.customer.findFirst({ where: { userId: customerUserId } });
  if (!customer) throw new Error('Customer profile not found');
  return prisma.booking.findMany({
    where: { customerId: customer.id },
    orderBy: { startTime: 'desc' },
    include: { painter: true, availability: true },
  });
}

export async function listPainterBookings(painterUserId: string) {
  const painter = await prisma.painter.findFirst({ where: { userId: painterUserId } });
  if (!painter) throw new Error('Painter profile not found');
  return prisma.booking.findMany({
    where: { painterId: painter.id },
    orderBy: { startTime: 'desc' },
    include: { customer: true, availability: true },
  });
}


