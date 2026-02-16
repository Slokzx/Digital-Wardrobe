import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
  const offset = Number(searchParams.get('offset')) || 0;
  const search = searchParams.get('search')?.trim() || '';
  const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
  const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
  const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
  const minCost = searchParams.get('minCost') ? Number(searchParams.get('minCost')) : undefined;
  const maxCost = searchParams.get('maxCost') ? Number(searchParams.get('maxCost')) : undefined;
  const dateFrom = searchParams.get('dateFrom') || undefined;
  const dateTo = searchParams.get('dateTo') || undefined;
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  const where: Record<string, unknown> = { userId: session.userId };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { brand: { contains: search } },
      { notes: { contains: search } },
    ];
  }
  if (types.length) where.type = { in: types };
  if (colors.length) where.color = { in: colors };
  if (sizes.length) where.size = { in: sizes };
  if (minCost != null || maxCost != null) {
    where.cost = {};
    if (minCost != null) (where.cost as Record<string, number>).gte = minCost;
    if (maxCost != null) (where.cost as Record<string, number>).lte = maxCost;
  }
  if (dateFrom || dateTo) {
    where.purchaseDate = {};
    if (dateFrom) (where.purchaseDate as Record<string, Date>).gte = new Date(dateFrom);
    if (dateTo) (where.purchaseDate as Record<string, Date>).lte = new Date(dateTo);
  }

  const orderBy = sort === 'cost' ? { cost: order } : sort === 'purchaseDate' ? { purchaseDate: order } : { createdAt: order };

  const [items, totalCount] = await Promise.all([
    prisma.wardrobeItem.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    }),
    prisma.wardrobeItem.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((i) => ({
      ...i,
      purchaseDate: i.purchaseDate?.toISOString().slice(0, 10) ?? null,
    })),
    totalCount,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, brand, type, size, color, cost, purchaseDate, notes, imageUrl } = body;
    if (!name || !type || !imageUrl) {
      return NextResponse.json(
        { error: 'Name, type and imageUrl required' },
        { status: 400 }
      );
    }
    const item = await prisma.wardrobeItem.create({
      data: {
        userId: session.userId,
        name: String(name),
        brand: brand ? String(brand) : null,
        type: String(type),
        size: size ? String(size) : null,
        color: color ? String(color) : null,
        cost: cost != null ? Number(cost) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        notes: notes ? String(notes) : null,
        imageUrl: String(imageUrl),
      },
    });
    return NextResponse.json({
      ...item,
      purchaseDate: item.purchaseDate?.toISOString().slice(0, 10) ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}
