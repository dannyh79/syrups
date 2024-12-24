import { db } from '@/__mocks__/db';
import { getPerformanceReviewById, getPerformanceReviews } from './queries';

describe('getPerformanceReviews()', () => {
  beforeEach(() => {
    db.performanceReview.findMany.mockResolvedValue([mockPerformanceReview]);
  });

  it('returns performance reviews', async () => {
    const result = await getPerformanceReviews();
    expect(result).toEqual({ performanceReviews: [mockPerformanceReview] });
  });
});

describe('getPerformanceReviewById()', () => {
  beforeEach(() => {
    db.performanceReview.findFirst = vi.fn((args) => {
      if (args?.where?.id === 'cm52qujk500032q00utlpa2mj') {
        return Promise.resolve(mockPerformanceReview);
      }
      return Promise.resolve(null);
    }) as typeof db.performanceReview.findFirst;
  });

  it('returns a performance review', async () => {
    const result = await getPerformanceReviewById('cm52qujk500032q00utlpa2mj');
    expect(result).toEqual({ performanceReview: mockPerformanceReview });
  });

  it('returns { performanceReview: undefined } if none found', async () => {
    const result = await getPerformanceReviewById('cm4zskw1q00002q4jo2vf8p00');
    expect(result).toEqual({ performanceReview: null });
  });
});

const mockEmployee1 = {
  id: 'cm4zskw1q00002q4jo2vf8p00',
  firstName: 'John',
  lastName: 'Doe',
  email: 'jdoe@example.com',
  role: '',
  createdAt: new Date('2024-12-22T15:57:39.518Z'),
  updatedAt: new Date('2024-12-22T15:57:39.518Z'),
};

const mockEmployee2 = {
  id: 'cm4zsla8200012q4j963n4gn0',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'janedoe@example.com',
  role: '',
  createdAt: new Date('2024-12-22T15:57:39.518Z'),
  updatedAt: new Date('2024-12-22T15:57:39.518Z'),
};

const mockPerformanceReview = {
  id: 'cm52qujk500032q00utlpa2mj',
  submittedAt: new Date('2024-12-23T14:57:39.518Z'),
  feedback: 'Some feedback.',
  employeeId: mockEmployee1.id,
  assigneeId: mockEmployee2.id,
  createdAt: new Date('2024-12-23T15:57:39.518Z'),
  updatedAt: new Date('2024-12-23T15:57:39.518Z'),
};
