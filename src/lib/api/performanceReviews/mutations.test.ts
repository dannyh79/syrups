import { db } from '@/__mocks__/db';
import { createPerformanceReview, updatePerformanceReview } from './mutations';
import {
  NewPerformanceReviewParams,
  UpdatePerformanceReviewParams,
} from '@/lib/db/schema/performanceReviews';

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('createPerformanceReview()', () => {
  const params: NewPerformanceReviewParams = {
    submittedAt: mockPerformanceReview.submittedAt,
    feedback: mockPerformanceReview.feedback,
    employeeId: mockEmployee1.id,
    assigneeId: mockEmployee2.id,
  };

  it('returns created performance review', async () => {
    db.performanceReview.create.mockResolvedValue(mockPerformanceReview);

    const result = await createPerformanceReview(params);
    expect(result).toEqual({ performanceReview: mockPerformanceReview });
  });

  it('returns error', async () => {
    const errorMessage = 'Some error.';
    db.performanceReview.create = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage)) as typeof db.performanceReview.create;

    await expect(createPerformanceReview(params)).rejects.toEqual({
      error: errorMessage,
    });
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, errorMessage);
  });
});

describe('updatePerformanceReview()', () => {
  const params: UpdatePerformanceReviewParams = {
    id: mockPerformanceReview.id,
    submittedAt: mockPerformanceReview.submittedAt,
    feedback: mockPerformanceReview.feedback,
    employeeId: mockEmployee1.id,
    assigneeId: mockEmployee2.id,
  };

  it('returns updated performance review', async () => {
    db.performanceReview.update.mockResolvedValue(mockPerformanceReview);

    const result = await updatePerformanceReview('cm52qujk500032q00utlpa2mj', params);
    expect(result).toEqual({ performanceReview: mockPerformanceReview });
  });

  it('returns error', async () => {
    const errorMessage = 'Some error.';
    db.performanceReview.update = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage)) as typeof db.performanceReview.update;

    await expect(updatePerformanceReview('', params)).rejects.toEqual({
      error: errorMessage,
    });
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, errorMessage);
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
