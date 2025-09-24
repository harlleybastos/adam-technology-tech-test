import { prisma } from '../utils/database.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';

export async function registerUser(params: {
  email: string;
  password: string;
  role: 'painter' | 'customer';
  name: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(params.password, 10);

  const user = await prisma.user.create({
    data: {
      email: params.email,
      passwordHash,
      role: params.role,
      painter:
        params.role === 'painter'
          ? { create: { name: params.name, phone: params.phone ?? null, experience: 0, rating: 0, specialties: [] } }
          : undefined,
      customer:
        params.role === 'customer'
          ? { create: { name: params.name, phone: params.phone ?? null } }
          : undefined,
    },
    include: { painter: true, customer: true },
  });

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { user: { id: user.id, email: user.email, role: user.role }, token };
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: params.email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(params.password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { user: { id: user.id, email: user.email, role: user.role }, token };
}

export async function demoLogin(role: 'painter' | 'customer') {
  // Try to find an existing user by role; fallback to seed emails; otherwise create a minimal account
  let user = await prisma.user.findFirst({ where: { role } });
  if (!user) {
    const email = role === 'painter' ? 'painter@example.com' : 'customer@example.com';
    user = await prisma.user.findUnique({ where: { email } });
  }
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: `${role}-${Date.now()}@example.com`,
        passwordHash: await bcrypt.hash('password123', 10),
        role,
        painter: role === 'painter' ? { create: { name: 'Demo Painter', experience: 0, rating: 0, specialties: [] } } : undefined,
        customer: role === 'customer' ? { create: { name: 'Demo Customer' } } : undefined,
      },
    });
  }

  // Ensure profile exists
  if (role === 'painter') {
    const painter = await prisma.painter.findFirst({ where: { userId: user.id } });
    if (!painter) {
      await prisma.painter.create({ data: { userId: user.id, name: 'Demo Painter', experience: 0, rating: 0, specialties: [] } });
    }
  } else {
    const customer = await prisma.customer.findFirst({ where: { userId: user.id } });
    if (!customer) {
      await prisma.customer.create({ data: { userId: user.id, name: 'Demo Customer' } });
    }
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { user: { id: user.id, email: user.email, role: user.role }, token };
}


