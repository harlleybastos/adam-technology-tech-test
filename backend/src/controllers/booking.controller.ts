import { Request, Response } from 'express';
import { z } from 'zod';
import { requestBooking, listCustomerBookings, listPainterBookings } from '../services/booking.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const bookingRequestSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
});

export async function createBookingRequest(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const parsed = bookingRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.flatten() });
  try {
    const result = await requestBooking(req.user, parsed.data);
    res.json({ success: true, data: result });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}

export async function getMyBookings(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    if (req.user.role === 'customer') {
      const data = await listCustomerBookings(req.user.id);
      return res.json({ success: true, data });
    }
    const data = await listPainterBookings(req.user.id);
    return res.json({ success: true, data });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}


