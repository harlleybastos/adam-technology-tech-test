import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const painterUser = await prisma.user.upsert({
    where: { email: 'painter@example.com' },
    update: {},
    create: { email: 'painter@example.com', passwordHash, role: 'painter' },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: { email: 'customer@example.com', passwordHash, role: 'customer' },
  });

  const painter = await prisma.painter.upsert({
    where: { userId: painterUser.id },
    update: {},
    create: {
      userId: painterUser.id,
      name: 'John Painter',
      experience: 5,
      rating: 4.5,
      specialties: ['interior', 'exterior'],
      phone: '555-1234',
      bio: 'Experienced house painter',
    },
  });

  await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      name: 'Alice Customer',
      phone: '555-5678',
      address: '123 Main St',
    },
  });

  const now = new Date();
  const twoHours = 1000 * 60 * 60 * 2;
  await prisma.availability.createMany({
    data: [
      {
        painterId: painter.id,
        startTime: new Date(now.getTime() + twoHours),
        endTime: new Date(now.getTime() + twoHours * 2),
      },
      {
        painterId: painter.id,
        startTime: new Date(now.getTime() + twoHours * 3),
        endTime: new Date(now.getTime() + twoHours * 4),
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


