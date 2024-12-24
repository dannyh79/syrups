import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'vitest-mock-extended';

export const db = mockDeep<PrismaClient>();

vi.mock('@/lib/db/index', () => ({ db }));

beforeEach(() => {
  mockReset(db);
});

export default db;
