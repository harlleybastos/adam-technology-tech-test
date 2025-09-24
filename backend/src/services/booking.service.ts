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
    throw new Error('No painters are available for the requested time slot.');
  }

  // Simple scoring placeholder based on rating, experience, and workload
  const paintersWithWorkload: Array<{ slot: AvailabilityWithPainter; workload: number }> = await Promise.all(
    availableSlots.map(async (slot: AvailabilityWithPainter) => {
      const workload = await prisma.booking.count({
        where: { painterId: slot.painterId, status: { in: ['confirmed', 'pending'] } },
      });
      return { slot, workload };
    })
  );

  paintersWithWorkload.sort((a, b) => {
    const aScore = Number(a.slot.painter.rating) * 0.6 - a.workload * 0.4;
    const bScore = Number(b.slot.painter.rating) * 0.6 - b.workload * 0.4;
    return bScore - aScore;
  });

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


