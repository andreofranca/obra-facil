import { PrismaClient } from '@prisma/client';
import { beforeEach, afterEach, afterAll } from 'vitest';

const prisma = new PrismaClient();

async function truncateDB() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`);
    }
  } catch (error) {
    console.error('Error truncating tables', error);
  }
}

beforeEach(async () => {
  await truncateDB();
});

afterEach(async () => {
  await truncateDB();
});

afterAll(async () => {
  await prisma.$disconnect();
});
