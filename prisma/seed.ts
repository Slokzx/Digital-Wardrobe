import 'dotenv/config';
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

async function fetchPexelsPhotos(count: number): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error('PEXELS_API_KEY is required in .env to seed with Pexels images');
  }
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=wardrobe&per_page=${Math.min(count, 80)}`,
    { headers: { Authorization: apiKey } }
  );
  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`);
  const data = (await res.json()) as { photos?: { src?: { large?: string } }[] };
  const urls = (data.photos ?? [])
    .map((p) => p.src?.large)
    .filter((url): url is string => Boolean(url));
  return urls;
}

async function main() {
  const masterEmail = 'master@wardrobe.app';
  let user = await prisma.user.findUnique({ where: { email: masterEmail } });
  if (!user) {
    const hash = await bcrypt.hash('master1234', 10);
    user = await prisma.user.create({
      data: {
        name: 'Master',
        email: masterEmail,
        passwordHash: hash,
      },
    });
    console.log('Created master account:', user.email);
  }

  const deleted = await prisma.wardrobeItem.deleteMany({ where: { userId: user.id } });
  if (deleted.count > 0) {
    console.log(`Removed ${deleted.count} old items from master account.`);
  }

  const imageUrls = await fetchPexelsPhotos(50);
  if (imageUrls.length < 50) {
    throw new Error(`Pexels returned only ${imageUrls.length} photos; need 50`);
  }

  const baseYear = 2020;
  const items = Array.from({ length: 50 }, (_, i) => {
    const n = i + 1;
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
      imageUrl: imageUrls[i],
    };
  });

  await prisma.wardrobeItem.createMany({ data: items });
  console.log(`Seeded ${items.length} wardrobe items with Pexels images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
