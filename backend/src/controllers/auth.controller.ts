import { Request, Response } from 'express';
import { loginUser, registerUser, demoLogin } from '../services/auth.service.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['painter', 'customer']),
  name: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.flatten() });
  try {
    const result = await registerUser(parsed.data);
    return res.json({ success: true, data: result });
  } catch (e: any) {
    return res.status(400).json({ success: false, error: e.message });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.flatten() });
  try {
    const result = await loginUser(parsed.data);
    return res.json({ success: true, data: result });
  } catch (e: any) {
    return res.status(401).json({ success: false, error: e.message });
  }
}

export async function loginDemo(req: Request, res: Response) {
  const schema = z.object({ role: z.enum(['painter', 'customer']) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.flatten() });
  try {
    const result = await demoLogin(parsed.data.role);
    return res.json({ success: true, data: result });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}


