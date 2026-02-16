import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TYPES = ['Shirt', 'Pants', 'Jacket', 'Shoes', 'Dress', 'Sweater', 'Coat', 'Shorts', 'Skirt', 'Accessory'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown', 'Blue', 'Green', 'Red', 'Pink', 'Burgundy', 'Olive'];
const BRANDS = ['Uniqlo', 'Zara', 'H&M', 'COS', 'Everlane', 'Patagonia', 'Nike', 'Adidas', 'Levi\'s', 'J.Crew', 'Gap', 'Nordstrom'];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const demoEmail = 'demo@wardrobe.app';
  let user = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!user) {
    const hash = await bcrypt.hash('demo1234', 10);
    user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: demoEmail,
        passwordHash: hash,
      },
    });
    console.log('Created demo user:', user.email);
  }

  const existingCount = await prisma.wardrobeItem.count({ where: { userId: user.id } });
  if (existingCount >= 50) {
    console.log('Already have 50+ items, skipping seed.');
    return;
  }

  const toCreate = 50 - existingCount;
  const baseYear = 2020;
  const items = Array.from({ length: toCreate }, (_, i) => {
    const n = existingCount + i + 1;
    const purchaseDate = randomDate(new Date(baseYear, 0, 1), new Date());
    return {
      userId: user!.id,
      name: `${randomChoice(TYPES)} ${n}`,
      brand: randomChoice(BRANDS),
      type: randomChoice(TYPES),
      size: randomChoice(['XS', 'S', 'M', 'L', 'XL', '32', '34', '36', '8', '10']),
      color: randomChoice(COLORS),
      cost: Math.round((20 + Math.random() * 180) * 100) / 100,
      purchaseDate,
      notes: n % 4 === 0 ? `Note for item ${n}` : null,
      imageUrl: `https://picsum.photos/seed/wardrobe-${n}/800/1000`,
    };
  });

  await prisma.wardrobeItem.createMany({ data: items });
  console.log(`Seeded ${items.length} wardrobe items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
