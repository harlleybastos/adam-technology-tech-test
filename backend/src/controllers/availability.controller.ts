import { Request, Response } from 'express';
import { z } from 'zod';
import { addAvailability, deleteAvailability, getMyAvailability } from '../services/painter.service.js';

const availabilitySchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});

export async function createAvailability(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const parsed = availabilitySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.flatten() });
    const slot = await addAvailability(req.user.id, parsed.data);
    res.json({ success: true, data: slot });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}

export async function listMyAvailability(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const slots = await getMyAvailability(req.user.id);
    res.json({ success: true, data: slots });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}

export async function removeAvailability(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    await deleteAvailability(req.user.id, req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}


